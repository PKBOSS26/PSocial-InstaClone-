import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/postModel.js";
import { User } from "../model/userModel.js";
import { Comment } from "../model/commentModel.js";
import { io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ msg: "Image is required", success: false });

        const resizedImage = await sharp(image.buffer)
            .resize({ height: 800, width: 800, fit: 'inside' })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer();

        // Buffer to data URI
        const fileUri = `data:image/jpeg;base64,${resizedImage.toString('base64')}`;
        const cloudRes = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({ caption, image: cloudRes.secure_url, author: authorId });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: "author", select: '-password' });

        res.status(201).json({ success: true, post, msg: 'New post created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Failed to create post' });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilepicture' })
            .populate({ 
                path: 'comments', 
                options: { sort: { createdAt: -1 } }, 
                populate: { path: 'author', select: 'username profilepicture' } 
            });

        if (!posts.length) return res.status(404).json({ msg: "No posts found", success: false });

        res.status(200).json({ success: true, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Failed to fetch posts' });
    }
};


export const getPostById = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilepicture' })
            .populate({ 
                path: 'comments', 
                options: { sort: { createdAt: -1 } }, 
                populate: { path: 'author', select: 'username profilepicture' } 
            });

        if (!posts.length) return res.status(404).json({ msg: "Posts not found", success: false });

        res.status(200).json({ success: true, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Failed to fetch posts' });
    }
};

export const likePost = async (req, res) => {
    try {
        const likersId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ msg: "Post not found", success: false });

        // Check if the post is already liked by this user
        if (post.likes.includes(likersId)) {
            return res.status(400).json({ msg: "Already liked", success: false });
        }

        // Add the like
        await post.updateOne({ $addToSet: { likes: likersId } });

        // Notification logic
        const user = await User.findById(likersId).select('username profilePicture');
        const postAuthor = post.author.toString();

        if (postAuthor !== likersId) {
            const notification = {
                Type: 'like',
                userId: likersId,
                userDetails: user,
                postId: postId,
                message: `${user.username} liked your post`,
            };

            try {
                const postAuthorSocketId = getSocketId(postAuthor);
                if (postAuthorSocketId) {
                    io.to(postAuthorSocketId).emit('notification', notification);
                }
            } catch (socketError) {
                console.error("Socket notification failed:", socketError);
            }
        }

        res.status(200).json({ success: true, msg: "Post liked" });
    } catch (err) {
        console.error("Error liking post:", err.message, err.stack);
        res.status(500).json({ success: false, msg: 'Failed to like post', error: err.message });
    }
};


export const dislikePost = async (req, res) => {
    try {
        const dislikersId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ msg: "Post not found", success: false });

        // Dislike logic
        await post.updateOne({ $pull: { likes: dislikersId } });
        await post.save();

        // TODO: Implement Socket.io notification logic here
        const user  = await User.findById(likersId).select('username profilePicture');
        const postAuthor = post.author.toString();
        if(postAuthor !== likersId){
            //emit notification
            const notification = {
                Type: 'dislike',
                userId: likersId,
                userDetails: user,
                postId: postId,
                message: `${user.username} disliked your post`,
            };
            const postAuthorSocketId = getSocketId(postAuthor);
            if (postAuthorSocketId) {
                io.to(postAuthorSocketId).emit('notification', notification);
            }
        }
        res.status(200).json({ success: true, msg: "Post disliked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Failed to dislike post' });
    }
};


export const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const commentersId = req.id;

        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required', success:false});

        const comment = await Comment.create({
            text,
            author:commentersId,
            post:postId
        })

        await comment.populate({
            path:'author',
            select:"username profilePicture"
        });
        
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
};

export const getCommentsOfPost = async(req, res) => {
    try{
        const postId = req.params.id;
        const comments = await Comment.find({post: postId}).populate({path: 'author', select: 'username profilepicture'}); //it will get all the comments of the post and show the username and profilepicture
        if(!comments) return res.status(404).json({msg: "Comments not found", success: false}); 
        
        return res.status(200).json({success: true, comments});
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, msg: 'Failed to fetch comments' });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found", success: false });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== req.id) {
            return res.status(403).json({ msg: "You are not authorized to delete this post", success: false });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Remove the post from the user's posts array
        const user = await User.findById(req.id);
        user.posts.pull(postId);
        await user.save();

        // Delete associated comments
        await Comment.deleteMany({ post: postId });

        res.status(200).json({ success: true, msg: "Post deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found", success: false });
        }

        // Check if the user is the author of the comment
        if (comment.author.toString() !== req.id) { 
            return res.status(403).json({ msg: "You are not authorized to delete this comment", success: false });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Remove the comment from the post's comments array
        const post = await Post.findById(comment.post);
        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({ success: true, msg: "Comment deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found", success: false });
        }

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({ msg: "User not found", success: false });
        }

        const isBookmarked = user.bookmarks.includes(postId);
        const updateOperation = isBookmarked 
            ? { $pull: { bookmarks: postId } } 
            : { $addToSet: { bookmarks: postId } };

        await user.updateOne(updateOperation);

        const action = isBookmarked ? 'unbookmark' : 'bookmark';
        return res.status(200).json({ 
            type: action, 
            success: true, 
            msg: `Post ${action}ed` 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Failed to bookmark post' });
    }
};

