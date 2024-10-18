import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }], // the user who is chattting
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
})
export const Conversation = mongoose.model('Conversation', conversationSchema);