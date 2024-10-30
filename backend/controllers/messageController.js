import { Conversation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Send a message to a recipient
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; 
        const receiverId = req.params.id; 
        const { textMessage: message } = req.body; // Extract message from request body

        // Find an existing conversation or create a new one
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });

        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId] });
        }

        // Create a new message
        const newMessage = await Message.create({ senderId, receiverId, message });

        // Push the new message ID to the conversation
        conversation.messages.push(newMessage._id);

        // Save both the conversation and the new message
        await Promise.all([
            conversation.save(),
            newMessage.save()
        ]);

        // Notify the receiver via Socket.io if connected
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        // Respond with success and the new message
        res.status(200).json({ success: true, newMessage }); // Return the new message
    } catch (err) {
        console.error(err); // Use console.error for better error logging
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}

// Get messages for a conversation
export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        // Find the conversation
        const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate('messages');

        if (!conversation || !conversation.messages.length) {
            return res.status(200).json({ msgs: [], success: true });
        }

        // Return messages in response
        return res.status(200).json({ msgs: conversation.messages, success: true });
    } catch (err) {
        console.error(err); // Use console.error for better error logging
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}
