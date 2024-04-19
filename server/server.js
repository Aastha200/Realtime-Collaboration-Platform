const express = require("express");

const http = require("http");
// Importing the cors module to enable CORS with various options
const cors = require("cors");
// Importing user-related functions from the user utility file
const { userJoin, getUsers, userLeave } = require("./utils/user");

// Creating an instance of an Express application
const app = express();
// Creating an HTTP server
const server = http.createServer(app);
// Importing the socket.io module for real-time, bidirectional and event-based communication
const socketIO = require("socket.io");
// Creating a new socket.io instance by passing the HTTP server object
const io = socketIO(server);

// Enabling all CORS requests
app.use(cors());
// Setting up headers for CORS
app.use((req, res, next) => {
  // Allowing all origins to make requests
  res.header("Access-Control-Allow-Origin", "*");
  // Specifying the allowed HTTP headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // Passing control to the next middleware function in the stack
  next();
});

// Defining a route handler for GET requests made to the root path
app.get("/", (req, res) => {
  // Sending a response to the client
  res.send("server");
});

// Setting up socket.io
let imageUrl, userRoom;
// Listening for the connection event to be emitted
io.on("connection", (socket) => {
  // Listening for the user-joined event
  socket.on("user-joined", (data) => {
    const { roomId, userId, userName, host, presenter } = data;
    // Storing the room ID
    userRoom = roomId;
    // Adding the user to the list of users
    const user = userJoin(socket.id, userName, roomId, host, presenter);
    // Getting the list of users in the room
    const roomUsers = getUsers(user.room);
    // Adding the user to the room
    socket.join(user.room);
    // Sending a welcome message to the user
    socket.emit("message", {
      message: "Welcome to ChatRoom",
    });
    // Broadcasting a message to other users in the room
    socket.broadcast.to(user.room).emit("message", {
      message: `${user.username} has joined`,
    });

    // Emitting the list of users and the canvas image to the room
    io.to(user.room).emit("users", roomUsers);
    io.to(user.room).emit("canvasImage", imageUrl);
  });

  // Listening for the drawing event
  socket.on("drawing", (data) => {
    // Storing the image URL
    imageUrl = data;
    // Broadcasting the canvas image to other users in the room
    socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
  });

  socket.on("chat", (data) => {
    socket.broadcast.to(userRoom).emit("chat", data);
  });
  // Listening for the disconnect event
  socket.on("disconnect", () => {
    // Removing the user from the list of users
    const userLeaves = userLeave(socket.id);
    // Getting the list of users in the room
    const roomUsers = getUsers(userRoom);

    // If a user leaves, broadcasting a message and updating the user list
    if (userLeaves) {
      io.to(userLeaves.room).emit("message", {
        message: `${userLeaves.username} left the chat`,
      });
      io.to(userLeaves.room).emit("users", roomUsers);
    }
  });
});

// Setting up the server to listen on a port
const PORT = process.env.PORT || 5000;

// Starting the server
server.listen(PORT, () =>
  console.log(`server is listening on http://localhost:${PORT}`)
);
