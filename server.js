const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

var port = process.env.PORT || 3000

var players = {};
var bullets = [];

app.get('/', function (request, result) {
    result.sendfile('index.html');
});

io.on('connection', newConnection);


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

http.listen(port, function (){
    console.log('yay server running on: ' + port);
});
