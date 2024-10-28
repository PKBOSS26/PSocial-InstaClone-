import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart } from 'react-icons/fa';
import sendSvg from '../assets/send-svgrepo-com.svg';
import commentSvg from '../assets/comment-1-svgrepo-com.svg';
import bookmarkSvg from '../assets/bookmark-svgrepo-com.svg';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post?.likedBy?.includes(user?._id));
    const [postLikes, setPostLikes] = useState(post?.likes?.length || 0);
    const [comment, setComment] = useState(post?.comments || []);
    const dispatch = useDispatch();


    // Handle input changes for the comment text
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const handleCommentClick = () => {
        dispatch(setSelectedPost(post)); // Set selected post before opening dialog
        setOpen(true); // Open the CommentDialog
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/v1/post/delete/${post._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPostData = posts.filter((p) => p?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:3000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            console.log(res.data);

            if (res.data.success) {
                const updatedLikes = liked ? postLikes - 1 : postLikes + 1;

                setPostLikes(updatedLikes);
                setLiked(!liked);

                // updating post data
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    }

    const commentHandler = async () => {

        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/v1/post/${post._id}/bookmark`, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message || 'Something went wrong');
        }
    }

    return (
        <div className="my-8 w-full max-w-sm mx-auto">
            {/* Post Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt={`${post.author.username}'s avatar`} />
                        <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-2'>
                        <h1 className="font-semibold">{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant={'outline'}>Author</Badge>}
                    </div>
                </div>

                {/* More Options Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col text-center text-sm items-center">
                        {
                            post?.author._id !== user?._id &&
                            <Button variant="ghost" className="w-fit text-red-400 font-bold cursor-pointer">Unfollow</Button>
                        }
                        <Button variant="ghost" className="w-fit cursor-pointer">Add to favorites</Button>
                        {
                            user && user?._id === post.author._id &&
                            <Button onClick={deletePostHandler} variant="ghost" className="w-fit font-bold cursor-pointer">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Image */}
            <div>
                <img
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                    src={post.image}
                    alt="Post content"
                />
            </div>

            {/* Post Footer with Actions */}
            <div className="flex justify-between items-center mt-2">
                {/* like, comment and share */}
                <div className="flex items-center gap-4">
                    <FaHeart
                        className={`w-7 h-7 cursor-pointer ${liked ? 'text-red-400 liked' : ''}`}
                        onClick={likeOrDislikeHandler}
                    />

                    <img
                        src={commentSvg}
                        alt="Comment"
                        className="w-6 h-6 cursor-pointer"
                        onClick={handleCommentClick}
                    />
                    <CommentDialog open={open} setOpen={setOpen} />
                    <img src={sendSvg} alt="Share" className="w-6 h-6 cursor-pointer" />
                </div>

                {/* Right Action: Bookmark */}
                <div>
                    <img src={bookmarkSvg} onClick={bookmarkHandler} alt="Bookmark" className="w-6 h-6 cursor-pointer" />
                </div>
            </div>
            <span className='text-gray-500 font-medium'>{postLikes} likes</span>

            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>

            {
                comment.length > 0 && (
                    <span onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpen(true)
                    }} className='text-gray-500 font-medium cursor-pointer'> View all {comment.length} comments</span>
                )
            }

            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex justify-between items-center'>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="outline-none w-full text-sm"
                    value={text}
                    onChange={changeEventHandler} // Changed to match the function name
                />
                {
                    text && <span onClick={commentHandler} className="text-gray-500 font-medium cursor-pointer" >Post</span>
                }

            </div>
        </div>
    );
};

export default Post;
