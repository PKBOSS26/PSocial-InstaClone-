import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {type:String, required:true}, //what he wrote
    author: {type:mongoose.Schema.Types.ObjectId, ref: 'User'}, //user will comment(who wrote)
    post:{type:mongoose.Schema.Types.ObjectId, ref:'Post', required:true}, //on which post
})
export default commentSchema = mongoose.model('commentSchema', commentSchema)