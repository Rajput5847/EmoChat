(function() {

  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  app.querySelector(".join-screen #join-user").addEventListener("click", function() {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      return;
    }
    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  app.querySelector(".chat-screen #send-message").addEventListener("click", function() {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length == 0) {
      return;
    }
    renderMessage("my", {
      username: uname,
      text: message
    });
    socket.emit("chat", {
      username: uname,
      text: message
    });
    app.querySelector(".chat-screen #message-input").value = "";
  });

  app.querySelector(".chat-screen #message-input").addEventListener("keypress", function(dets) {

      socket.emit("typing", uname);
    if (dets.keyCode == 13) {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message
      });
      socket.emit("chat", {
        username: uname,
        text: message
      });
      app.querySelector(".chat-screen #message-input").value = "";
    }
  });

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function() {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  socket.on("typing", function(username){
    // console.log ('hmm')
    let para = document.querySelector("#typing");
    para.textContent = `${username} is typing...` ;
    let remove = setTimeout (function(){
      para.textContent = '';
    }, 3000);
  });
  
  socket.on("update", function(update) {
    renderMessage("update", update);
  });

  socket.on("chat", function(message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let time = new Date();
      let timehour = time.getHours();
      let timemin =  String(time.getMinutes());
      let meridian = 'am';
      if (timehour > 12) {
        timehour = timehour - 12;
        meridian = 'pm';
      }
      if (timemin < 10) {
        timemin = `0${timemin}`
      }
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div class="baate">
          <div class="name">You</div>
          <div class="text">${message.text}</div>
          
        <div class="name time">${timehour}:${timemin} ${meridian}</div>
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let audioElem = new Audio ('ting.mp3');
      let time = new Date();
      let timehour = time.getHours();
      let timemin =  String(time.getMinutes());
      let meridian = 'am';
      if (timehour > 12) {
        timehour = timehour - 12;
        meridian = 'pm';
      }
      if (timemin < 10) {
        timemin = `0${timemin}`
      }
      
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      audioElem.play();
      el.innerHTML = `
        <div class="baate">
          <div class="name">${message.username}</div>
          <div class="text">${message.text}</div>
          
        <div class="name time">${timehour}:${timemin} ${meridian}</div>
        </div>
        
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    //scroll chat to end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }

})();