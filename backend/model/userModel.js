import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true, unique:false},
    profilepicture: {type:String, default:''},
    bio: {type:String, default:''},
    gender: {type:String, enum:['male', 'female', 'other']},
    followers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    following: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    posts: [{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
    bookmarks: [{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
},{timestamps:true})
export const User = mongoose.model('User', userSchema);