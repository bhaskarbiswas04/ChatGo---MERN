import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);  //top of layer to the app server.
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-go-ui.vercel.app"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
    console.log(receiverId);
    
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId -> socketId}

io.on('connection', (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //sending online users data to the frontend.

  // --- ADD TYPING LISTENERS HERE ---
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Tell the receiver that this specific userId is typing
      socket.to(receiverSocketId).emit("typing", userId);
    }
  });

  socket.on("stop typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("stop typing", userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };