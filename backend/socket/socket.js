import {Server} from "socket.io";
import express from "express";
import http from 'http'

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {}; //this will store the socket id of the user

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]; // this will return the socket id of the receiver 

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`user connected: UserId = ${userId}, SocketId = ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if(userId){
            delete userSocketMap[userId];
            console.log(`user disconnected: UserId = ${userId}, SocketId = ${socket.id}`);
        }

        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})

export {app, server, io }