const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('../backend/db');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoute');
const bodyParser = require('body-parser');
const http = require('http');
const User = require('./model/User');
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/user' , authRoutes);
app.use('/message' , messageRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT , () => {
    console.log("This is active on port " , PORT);
});

const io = require('socket.io')(server , {
    pingTimeout:60000,
    cors: {
        origin: "https://chatapp-frontend-wj6k.onrender.com"
    }
});

const onlineUser = {};
const lastSeen = {};

io.on("connection" , (socket) => {
    console.log("socket io connected");

    socket.on("setup" , async (userId) => {
        socket.join(userId);
        console.log(userId);
        console.log(socket.id);
        socket.emit("connected");
        const users = await User.find();
        if(users){
            users.map((user) => {
                lastSeen[user._id] = user.lastSeen;
            })
            socket.emit("last Seen" , lastSeen);
        }
        if(userId){
            await User.findByIdAndUpdate(userId , {isOnline: true});
            onlineUser[userId] = socket.id;
            io.emit("online User" , onlineUser);
        }
    });

    socket.on("joinChat" , (room) => {
        socket.join(room);
        console.log(room);
    })

    socket.on("newMessage" , (messageData) => {
        socket.to(messageData.receiverId).emit("new Message" , messageData);
        console.log("message: ", messageData);
        socket.broadcast.emit("messageRec" , messageData);
    })

    socket.on("typing" , (room) => {
        socket.in(room).emit("typing");
    })

    socket.on("stop typing" , (room) => {
        socket.in(room).emit("stop typing");
    })

    socket.on("disconnect" , async () => {
        const userId = Object.keys(onlineUser).find((key) => onlineUser[key] === socket.id);
        if(userId){
            const lastSeenTime = new Date().toISOString();
            delete onlineUser[userId];
            await User.findByIdAndUpdate(userId , {isOnline: false , lastSeen: lastSeenTime});
            io.emit("online User" , onlineUser);
            lastSeen[userId] = lastSeenTime;
            io.emit("last Seen" , lastSeen)
        }
        console.log("User disconnected:", socket.id);
    })

    socket.on("logout" , async(userId) => {
        if(userId){
            const lastSeenTime = new Date().toISOString();
            delete onlineUser[userId];

            await User.findByIdAndUpdate(userId , {
                isOnline: false,
                lastSeen: lastSeenTime
            });

            io.emit("online User" , onlineUser);
            lastSeen[userId] = lastSeenTime;
            io.emit("last Seen" , lastSeen);
        }
    })
})
