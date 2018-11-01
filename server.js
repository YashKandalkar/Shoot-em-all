var express = require('express');
var app = express();

var server = app.listen(3000);
var socket = require('socket.io');
var io = socket(server);

app.use(express.static('public'));

io.sockets.on('connection', newConnection);

var players = {};
var bullets = [];

function newConnection(socket){
    console.log("new user connected: " + socket.id);
    //players[socket.id] = null;

    socket.on('player', (data) => {
        players[socket.id] = data;
        //console.log(data);
        io.sockets.emit('playersData', players);
    });

    socket.on('bullets', (data) => {
        Array.prototype.push.apply(bullets, data.b);
        io.sockets.emit('allBullets');
    })

    socket.on('disconnect', () => {
        console.log("user disconnected: " + socket.id);
        io.sockets.emit('playerDisconnected', {id: socket.id});
        delete players[socket.id];
    });
}


console.log("yay server running");