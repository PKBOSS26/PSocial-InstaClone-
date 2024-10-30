import mongoose from "mongoose";

// Define the message schema
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    message: {
        type: String,
        required: true
    }
});

// Register the model with a proper name
export const Message = mongoose.model('Message', messageSchema); 
