const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app)
const io = new Server(server);

app.use(express.static('public'));
const usernames = {};
const rooms = [
   
    { name: "globalChat", creator: "anonymous" },
    { name: "chess", creator: "anonymous" },
    { name: "javascript", creator: "anonymous" },
];

//connect to backend
io.on("connection", function(socket) {
    console.log('user connected to server')
    // receive username from the frontend 
    socket.on("createUser", function(username) {
       socket.username = username;
    //    put username in the usernames 
       usernames[username] = username;
       socket.currentRoom = "globalChat";

       socket.join("globalChat");

       //can name anything..sends to frontend
       socket.emit("updateChat", "INFO", "You have joined globalchat room");
    });

    socket.on("sendMessage", function(data){
        io.sockets.to(socket.currentRoom).emit("updateChat", socket.username, data);
    })

    socket.on("createRoom", function (room) {
        if (room != null) {
          rooms.push({ name: room, creator: socket.username });
          io.sockets.emit("updateRooms", rooms, null);
        }
      });
    
    socket.on("updateRooms", function(room){
        socket.broadcast
        .to(socket.currentRoom)
        .emit("updateChat", "INFO", socket.username + " left room");

        socket.leave(socket.currentRoom);
        socket.currentRoom = room;
        socket.join(room);
        socket.emit("updateChat", "INFO", "you have joined this " + room);
        socket.broadcast
        .to(socket.currentRoom)
        .emit("updateChat", "INFO", socket.username + " has joined "+ room)

    })

    socket.on("disconnect", function () {
        console.log(`User ${socket.username} disconnected from server.`);
        delete usernames[socket.username];
        io.sockets.emit("updateUsers", usernames);
        socket.broadcast.emit(
          "updateChat",
          "INFO",
          socket.username + " has disconnected"
        );
      });
});



server.listen(4000, function(){
    console.log('server running at port 4000');
})