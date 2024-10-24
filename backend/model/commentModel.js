import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true }, // what the user wrote
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // the user who wrote the comment
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // the post on which comment was made
}, { timestamps: true }); // Add timestamps to track creation and update times

const Comment = mongoose.model('Comment', commentSchema); 

export default Comment;
