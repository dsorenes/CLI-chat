const ip = require('ip');
const server = require('http').createServer();
const io = require('socket.io')(server);

//array of currently connected users
let connected = [];

server.listen(3000, () => {
    console.log('server started');
});

io.sockets.on('connection', (socket) => {

    connected.push(socket.id);

    socket.emit('connected', {
        users_connected: connected.length
    });

    socket.on('message', (data) => {

        socket.broadcast.emit('client-message', data);
    });

    socket.on('joined', (data) => {
        io.sockets.emit('joined', data);
    });

    socket.on('disconnect', (data) => {
        connected.splice(connected.indexOf(socket.id), 1);

    });

    socket.on('end', (data) => {
        socket.broadcast.emit('end', data);

        socket.disconnect();

        console.log(connected);
    });

})
