import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

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

        
        //SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);

        console.log("--- DEBUGGING SOCKET ---");
        console.log("Receiver ID from Params:", receiverId);
        console.log(
          "Current Socket Map:",
          JSON.stringify(io.sockets.adapter.rooms),
        ); // Optional check
        console.log("Target Socket ID found:", receiverSocketId);

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({ newMessage });

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