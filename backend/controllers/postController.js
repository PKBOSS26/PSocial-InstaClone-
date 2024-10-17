import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/postModel.js";
import { User } from "../model/userModel.js";

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

        // Like logic
        if (post.likes.includes(likersId)) {
            return res.status(400).json({ msg: "Already liked", success: false });
        }

        await post.updateOne({ $addToSet: { likes: likersId } });
        await post.save();

        // TODO: Implement Socket.io notification logic here

        res.status(200).json({ success: true, msg: "Post liked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Failed to like post' });
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

        res.status(200).json({ success: true, msg: "Post disliked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Failed to dislike post' });
    }
};


export const addComment = async(req, res) => {
    try{
        const postId = req.params.id;
        const comment = req.body.comment;
        const commenterId = req.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({msg: "Post not found", success: false});
        if(!comment) return res.status(400).json({msg: "Comment is required", success: false});

        const newComment = await Comment.create({comment, author: commenterId, post: postId}); //it will create a new comment
        await newComment.populate({path: 'author', select: 'username profilepicture'}).execPopulate(); //it will add the username and profilepicture to the new comment

        post.comments.push(newComment._id);
        await post.save();
        res.status(200).json({success: true, msg: "Comment added", newComment});
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, msg: 'Failed to add comment' });
    }
}

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
