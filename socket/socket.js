import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);  //top of layer to the app server.
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: [GET, POST],
  },
});

io.on('connection', (socket)=>{
    console.log('user connected', socket.id);
});

export { app, io, server };