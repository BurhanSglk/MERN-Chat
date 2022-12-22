const express = require('express')
const cors = require('cors')
require("dotenv").config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const socket = require('socket.io')
const app = express();
const userRouter = require('./Routes/userRouter')
const messageRouter = require('./Routes/messageRouter')


app.use(cors())
app.use(express.json())

app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

mongoose.connect(process.env.MONGO_URL, {

}).then(() => {
  console.log("db connection succesfuly")
}).catch((err) => {
  console.log(err)
})


const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started On Port ${process.env.PORT}`)
})

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });


  // socket.on("send-msg", (data) => {
  //   const sendUserSocket = onlineUsers.get(data.to);
  //   if (sendUserSocket) {
  //     socket.emit("msg-recieve", data.message);
  //   }
  // });

  socket.on("send-msg", (data) => {
    io.sockets.emit("msg-recieve", data)
  });

  socket.on("typing", (text) => {
    socket.broadcast.emit('typing', text)
  })
});