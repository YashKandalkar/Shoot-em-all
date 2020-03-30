const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

var port = process.env.PORT || 3000

var players = {};
var bullets = {};
var playerName;
var playerNames = [];

var width = 1000, height = 1000;

app.get('/', function (request, result) {
    result.sendfile('index.html');
});

io.on('connection', newConnection);


function newConnection(socket){
    console.log("new user connected: " + socket.id);
    //players[socket.id] = null;
    /*playerName = prompt("Enter your name");

    while(playerNames.index(playerName) > -1){
        playerName = prompt("Someone already has taken this name.\nPlease use a different one");
    }*/

    socket.on('player', (data) => {
        players[socket.id] = data;
        // console.log(data);
        io.sockets.emit('playersData', players);
    });

    socket.on('bullet', ({bullet_obj}) => {
        bullet_obj.owner_id = socket.id;
        io.sockets.emit('new-bullet', {b: bullet_obj});
    })

    socket.on('hit', ({player_id}) => {
        io.to(player_id).emit('take-hit', {amount: 10});
    });

    socket.on('disconnect', () => {
        console.log("user disconnected: " + socket.id);
        io.sockets.emit('playerDisconnected', {id: socket.id});
        delete players[socket.id];
    });
}

http.listen(port, function (){
    console.log('yay server running on: ' + port);
});
