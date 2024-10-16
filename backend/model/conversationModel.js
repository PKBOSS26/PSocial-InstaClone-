import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }], // the user who is chattting
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
})
export default Conversation = mongoose.model('Conversation', conversationSchema);