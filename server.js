const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var random = require('lodash');

app.use(express.static('public'));

var port = process.env.PORT || 3000
var width = 1000, height = 1000;

const powerup_types = [
                        "shield_silver.png",
                        "pill_green.png"
                      ]
var players = {};
var active_powerups = [];


for(let i = 0; i < 10; i++){
    let t = {
                x: random(-1000, 1000),
                y: random(-1000, 1000),
                type: powerup_types[random(powerup_types.length-1)]
            }  
    active_powerups.push(t);
}

app.get('/', function (request, result) {
    result.sendfile('index.html');
});

io.on('connection', newConnection);


function newConnection(socket){
    console.log("new user connected: " + socket.id);
    
    io.to(socket.id).emit('powerups', {powerups: active_powerups});

    socket.on('player', (data) => {
        players[socket.id] = data;
        io.sockets.emit('playersData', players);
        for(let [ind, p] of active_powerups.entries()){
            if(Math.hypot(data.x-p.x, data.y-p.y) < 30){
                io.to(socket.id).emit('powerup', p);
                delete p;
                active_powerups.splice(i, 1);
            }
        }
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
