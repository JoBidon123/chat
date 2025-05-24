const socket = io({
    auth:{
        cookie: document.cookie
    }
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('message');

socket.on('all_messages', function(msgArray){
    msgArray.forEach(msg => {
        let item = document.createElement('li');
        item.textContent = msg.login + ': ' + msg.content;
        messages.appendChild(item);
        
    });
    window.scrollTo(0, document.body.scrollHeight);
})

form.addEventListener('submit', function(e){
    e.preventDefault();
    if(input.value){
        socket.emit('new_message', input.value);
        input.value = '';
    }
});

socket.on('message', function(msg){
    let item = document.createElement('li');
    item.textContent = msg;
      console.log(item);
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})

exitButton.addEventListener("click", (e) => {
    document.cookie = "token; "
})