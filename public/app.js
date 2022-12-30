// io object is coming from the script in the html
var socket = io();

var userlist = document.getElementById("active_users_list");
var roomlist = document.getElementById("active_rooms_list");
var message = document.getElementById("messageInput");
var sendMessageBtn = document.getElementById("send_message_btn");
var roomInput = document.getElementById("roomInput");
var createRoomBtn = document.getElementById("room_add_icon_holder");
const chatDisplay = document.getElementById("chat");

var currentRoom = "glabalChat";
var myUsername = "";

// once backend is connected 
socket.on("connection", function() {
//   ask for username 
    myUsername = prompt("Enter name");
    //send username to bacckend
    socket.emit("createUser", myUsername);
})