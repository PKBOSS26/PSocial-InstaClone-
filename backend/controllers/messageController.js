import { Conversation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";


export const sendMessage = async (req, res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        const message = req.body.message;

        const conversation = await new Conversation.findone({ participants: {$all: [senderId, receiverId]}});

        if(!conversation) {
            const newConversation = await Conversation.create({participants: [senderId, receiverId]});
        }

        const newMessage = await Message.create({senderId, receiverId, message});
        if(newMessage) conversation.messages.push(newMessage._id);
        
        await Promise.all([
            conversation.save(),
            newMessage.save()
        ]);

        // TODO: Implement Socket.io notification logic here

        res.status(200).json({success: true, msg: "Message sent"});
    }catch(err){
        console.log(err);
    }
}

export const getMessages = async (req, res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.find({
            participants: {$all: [senderId, receiverId]}
        });

        if(!conversation) return res.status(200).json({msgs: [], success: true});

        return res.status(200).json({msgs: conversation?.messages, success: true});
    }catch(err){
        console.log(err);
    }
}