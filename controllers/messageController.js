import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

// --RouteLogic: SEND MESSAGE.
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // --check: if conversation is already exists or not.
        let gotConversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        })

        if(!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = await Message.create({senderId, receiverId, message});
        
        if(newMessage) {
            gotConversation.messages.push(newMessage._id);
        }
        await gotConversation.save();

        return res.status(201).json({message: "Message send successfully."});

        //SOCKET IO


    } catch (error) {
        console.log(error)
    }
}

// --RouteLogic: GET MESSAGE.
export const getMessage = async (req, res)=>{
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        }).populate("messages");

        return res.status(200).json(conversation?.messages);
        
    } catch (error) {
        console.log(error);
    }
}