import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'
import CommentRoute from './Routes/CommentRoute.js'
import ChatRoute from './Routes/ChatRoute.js'
import MessageRoute from './Routes/MessageRoute.js'
import {createServer} from 'http';
import { Server } from "socket.io";


const app = express();
//to serve images for public
app.use(express.static('public'))
app.use('/images', express.static("./public/images"))

//middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
    origin:["https://main.d34ofsx00uuomk.amplifyapp.com","http://localhost:3000"],
    credentials:true,
  }))
dotenv.config();

mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Database Connected'))
    .catch((error) => console.log(error));

//usage of routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
app.use("/comment", CommentRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);




const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000","https://main.d34ofsx00uuomk.amplifyapp.com"],
    },
  });



  let activeUsers = []

  io.on("connection", (socket) => {
      // add new User
  
      socket.on('new-user-add', (newUserId) => {
          //if user is not added previously
          if (!activeUsers.some((user) => user.userId === newUserId)) {
              activeUsers.push({
                  userId: newUserId,
                  socketId: socket.id
              })
          }
          io.emit('get-users', activeUsers)
      })
  
      //send message
      socket.on("send-message", (data) => {
          const { receiverId } = data;
          const user = activeUsers.find((user) => user.userId === receiverId)
          if (user) {
              io.to(user.socketId).emit("receive-message", data)
          }
      })
  
      socket.on("disconnect", () => {
          activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
          io.emit('get-users', activeUsers)
      })
  })

httpServer.listen(process.env.PORT, () =>
      console.log(`Listening at ${process.env.PORT}`)
)