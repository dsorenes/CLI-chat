const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const readline = require('readline');
const program = require('commander');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program
    .version('1.0.0')
    .option('--port <port>', 'udp port, default: 3000')
    .option('--username <username>', 'username, default uses current user')
    .parse(process.argv);


function setUsernamePrompt(username) {
    rl.setPrompt(`${username}> `);
    rl.prompt();
}

function broadcast(username, data, string) {
    rl.setPrompt('');
    rl.prompt();
    console.log(`${data} ${string}`);
    setUsernamePrompt(username);
}



socket.on('connect', () => {
    setUsernamePrompt(program.username);
});

socket.emit('disconnect', {username: program.username});

socket.on('connected', (data) => {
    broadcast(data.username, data.users_connected, 'in the chat');
});

socket.emit('joined', {
    username: program.username
});

//user joined the chat
socket.on('joined', (data) => {
    broadcast(data.username, data.username, 'joined the chat');
});


//displays messages from other sockets
socket.on('client-message', (data) => {
    rl.setPrompt('');
    rl.prompt();
    console.log(`${data.username}> ${data.message}`);
    setUsernamePrompt(program.username);
});

socket.on('end', (data) => {
    broadcast(data.username, data.username, 'left the chat');
});

//creates the message 
rl.on('line', (message) => {
    rl.setPrompt('');
    rl.prompt();
    if (message.trim().localeCompare('/quit') === 0) {
        socket.emit('end', {username: program.username});
        rl.setPrompt('you left the chat');
        rl.prompt();
        rl.close();
    } else {
        setUsernamePrompt(program.username);
        socket.emit('message', {
            username: program.username,
            message: message
        });
    }
    
});