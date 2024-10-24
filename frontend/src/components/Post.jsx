import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import heartSvg from '../assets/heart-svgrepo-com.svg';
import sendSvg from '../assets/send-svgrepo-com.svg';
import commentSvg from '../assets/comment-1-svgrepo-com.svg';
import bookmarkSvg from '../assets/bookmark-svgrepo-com.svg';
import CommentDialog from './CommentDialog';
import { useSelector } from 'react-redux';


const Post = ({ post }) => {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store => store.auth)

    const changeEvenetHandler = (e) => {
        const inputText = e.target.value
        if(inputText.trim()) {
            setText(inputText)
        }else{
            setText('')
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
                    <h1 className="font-semibold">{post.author?.username}</h1>
                </div>

                {/* More Options Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col text-center text-sm items-center">
                        <Button variant="ghost" className="w-fit text-red-400 font-bold cursor-pointer">
                            Unfollow
                        </Button>
                        <Button variant="ghost" className="w-fit cursor-pointer">Add to favorites</Button>
                        {
                            user && user?._id === post.author._id &&
                            <Button variant="ghost" className="w-fit font-bold cursor-pointer">Delete</Button>
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
                    <img src={heartSvg} alt="Like" className="w-7 h-7 cursor-pointer" />
                    <img src={commentSvg} alt="Comment" className="w-6 h-6 cursor-pointer" onClick={() => setOpen(true)}/>
                    <img src={sendSvg} alt="Share" className="w-6 h-6 cursor-pointer" />
                </div>

                {/* Right Action: Bookmark */}
                <div>
                    <img src={bookmarkSvg} alt="Bookmark" className="w-6 h-6 cursor-pointer" />
                </div>
            </div>
            <span className='text-gray-500 font-medium'>{post.likes.length} likes</span>
            
            <p>
                <span className='font-medium mr-2'>{post.author.username}</span>
                {post.caption}
            </p>
            <span className='text-gray-500 font-medium cursor-pointer' onClick={() => setOpen(true)}>View all 10 comments</span>
            <CommentDialog open={open} setOpen={setOpen}/>
            <div className='flex justify-between items-center'>
                <input
                    type="text" 
                    placeholder="Add a comment..." 
                    className="outline-none w-full text-sm"
                    value={text}
                    onChange={changeEvenetHandler}
                    />
                    {
                        text.trim() && <Button onClick={() => setText('')}>Post</Button>
                    }
            </div>
        </div>
    );
};

export default Post;
