const express = require('express')
const { chats } = require("./data/data")
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const color = require('colors')
const app = express()
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
const path = require('path');
dotenv.config()
connectDB()

app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/chats',chatRoutes)
app.use('/api/message', messageRoutes);

// deployment
const __dirname1 = path.resolve();

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1, '/frontend/build')));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname1, 'frontend','build','index.html'));
    })
}
else {
    app.get("/", (req,res) => {
        res.send("Api is running successfully!!");
    })
}
//deployment 
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT
const server = app.listen(PORT, console.log(`My app is running in port ${PORT}`.yellow.bold))

const io= require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket)=>{
    console.log("connected to socket.io");

    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        //console.log(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (roomId)=>{
        socket.join(roomId);
        console.log("user joined ", roomId);
       // socket.emit('connected');
    });

    socket.on('typing',(roomId)=> socket.in(roomId).emit("typing"));
    socket.on('typing',(roomId)=> socket.in(roomId).emit("stop typing"))
    socket.on('new message', (newMessageReceived)=>{
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user=> {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })

    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    })
})