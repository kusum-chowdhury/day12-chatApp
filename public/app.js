// io object is coming from the script in the html
var socket = io();

var userlist = document.getElementById("active_users_list");
var roomlist = document.getElementById("active_rooms_list");
var message = document.getElementById("messageInput");
var sendMessageBtn = document.getElementById("send_message_btn");
var roomInput = document.getElementById("roomInput");
var createRoomBtn = document.getElementById("room_add_icon_holder");
var chatDisplay = document.getElementById("chat");
var currentRoom = "glabalChat";
var myUsername = "";

// once backend is connected 
socket.on("connect", function() {
//   ask for username 
    myUsername = prompt("Enter name");
    //send username to bacckend
    socket.emit("createUser", myUsername);
});

sendMessageBtn.addEventListener('click', function(){
    socket.emit('sendMessage', message.value);
    message.value = "";
})

socket.on("updateChat", function(username, data){
    if (username === "INFO") {
        console.log("Displaying announcement");
        chatDisplay.innerHTML += `<div class="announcement"><span>${data}</span></div>`;
      } else {
        chatDisplay.innerHTML += `<div class="message_holder ${
            username === myUsername ? "me" : ""
          }">
                                      <div class="pic"></div>
                                      <div class="message_box">
                                        <div id="message" class="message">
                                          <span class="message_name">${username}</span>
                                          <span class="message_text">${data}</span>
                                        </div>
                                      </div>
                                    </div>`;
      }
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
});


