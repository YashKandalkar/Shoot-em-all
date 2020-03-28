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

    socket.on('bullets', ({bullet_objs}) => {
        let t = bullet_objs;
        for (let [i, b] of t.entries()) {
            if(b.x > width || b.x < -width || b.y > height|| b.y < -height){
                delete b;
                t.splice(i, 1);
            }
            for(let id of Object.keys(players)){
                if(id !== socket.id){
                    if(Math.hypot(b.x - players[id].x, b.y - players[id].y) < 35){
                        //send only to that player which got hit by a bullet
                        io.to(id).emit('hit', {amount:10});
                        //delete the bullet
                        delete b;
                        t.splice(i, 1);
                    }
                }
            }
        }
        bullets[socket.id] = t;
        io.sockets.emit('allBullets', bullets);
    })

    socket.on('disconnect', () => {
        console.log("user disconnected: " + socket.id);
        io.sockets.emit('playerDisconnected', {id: socket.id});
        delete players[socket.id];
        delete bullets[socket.id];
    });
}

http.listen(port, function (){
    console.log('yay server running on: ' + port);
});
