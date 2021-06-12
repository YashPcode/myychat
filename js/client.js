const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");


let joining = new Audio('../join.wav');
let leaving = new Audio('../leaving.mp3');
let sending = new Audio('../sending.mp3');
let receiving = new Audio('../receiving.mp3');

const append = (message, position,process) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);


    if (process == 'joining') joining.play();
    else if (process == 'sending') sending.play();
    else if (process == 'receiving') receiving.play();
    else if (process == 'leaving') leaving.play();
    
}

const name = prompt("Enter your name to join");

append(`Hey,${name} Welcome to Y chat`,'center','none')

socket.emit('new-user-joined', name);


socket.on('user-joined', previousname => {
    append(`${previousname} joined the chat`, 'center', 'joining');
    
});


form.addEventListener('submit', (e) => {
    e.preventDefault();//by using this page will not be reloaded
    const message = messageInput.value;
    append(`You: ${message}`, 'right','sending');
    socket.emit('send', message);
    messageInput.value = '';


});
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`,'left','receiving')
});
socket.on('leave', leavename => {
    append(`${leavename} left the chat`, 'center','leaving');

});
