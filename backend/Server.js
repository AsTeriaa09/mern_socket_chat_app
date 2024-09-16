const cors = require("cors");
const express = require("express");
const ChatRouter = require("./Routes/ChatRouter");
const AuthRoute = require("./Routes/AuthRouter");
const app = express();
require("dotenv").config();
const connectToDb = require("./db");
const errorMiddleware = require("./middlewares/ErrorMiddleware");
const MessageRoute = require("./Routes/MessageRouter");

const corsOption = {
  origin: "https://mern-socket-app.netlify.app/" || "http://localhost:5173",
  methods: "POST,GET,DELETE,PATCH,PUT,HEAD",
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOption));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/data", ChatRouter);
app.use("/api/auth", AuthRoute);
app.use("/api/messsage", MessageRoute);

app.use(errorMiddleware);

const port = process.env.PORT;

const server = connectToDb().then(() => {
  const serverInstance = app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
  });



  const io = require("socket.io")(serverInstance, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    // will take user data from frontend. creating a new socket where the frontend will send some data and join a room
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      //console.log(userData._id)
      socket.emit("connected");
    })

    socket.on("join chat", (room) => {
      if (room) {
        socket.join(room);
        //console.log("User joined room:", room); 
      } else {
        console.error("Room ID is undefined or invalid");
      }
    })

    // socket for typing
    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    })
    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    })

    // to send msg in the rooms
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
      if (!chat.users) {
        return console.log("chat.users not defined")
      }
      // to make sure the chat/msg is recieved by other user and not me.
      chat.users.forEach(user => {
        if (user._id == newMessageRecieved.sender._id) {
          return;
        }
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      })
    })

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });


  });

  return serverInstance;

}).catch((error) => {
  console.error("Failed to connect to the database:", error);
});
