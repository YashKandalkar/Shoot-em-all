var socket;
var players = {};
var can_shoot = true;
var player_img;
var player, space_background;
var started = false;
var startDiv = document.getElementById("start-div");
var startButton;

var local_bullets = [];
var others_bullets = [];
var active_powerups = []

var images = {
  'damage': {},
  'effects': {},
  'lasers': {},
  'playerShip': {},
  'powerUps': {}
}
let paths = {
      'damage': ['assets/playerShip1_damage1.png', 'assets/playerShip1_damage2.png', 'assets/playerShip1_damage3.png', 'assets/playerShip2_damage1.png', 'assets/playerShip2_damage2.png', 'assets/playerShip2_damage3.png', 'assets/playerShip3_damage1.png', 'assets/playerShip3_damage2.png', 'assets/playerShip3_damage3.png'], 
      'effects': ['assets/fire00.png', 'assets/fire01.png', 'assets/fire02.png', 'assets/fire03.png', 'assets/fire04.png', 'assets/fire05.png', 'assets/fire06.png', 'assets/fire07.png', 'assets/fire08.png', 'assets/fire09.png', 'assets/fire10.png', 'assets/fire11.png', 'assets/fire12.png', 'assets/fire13.png', 'assets/fire14.png', 'assets/fire15.png', 'assets/fire16.png', 'assets/fire17.png', 'assets/fire18.png', 'assets/fire19.png', 'assets/shield1.png', 'assets/shield2.png', 'assets/shield3.png', 'assets/speed.png', 'assets/star1.png', 'assets/star2.png', 'assets/star3.png'], 
      'lasers': ['assets/laserBlue01.png', 'assets/laserBlue02.png', 'assets/laserBlue03.png', 'assets/laserBlue04.png', 'assets/laserBlue05.png', 'assets/laserBlue06.png', 'assets/laserBlue07.png', 'assets/laserBlue08.png', 'assets/laserBlue09.png', 'assets/laserBlue10.png', 'assets/laserBlue11.png', 'assets/laserBlue12.png', 'assets/laserBlue13.png', 'assets/laserBlue14.png', 'assets/laserBlue15.png', 'assets/laserBlue16.png', 'assets/laserGreen01.png', 'assets/laserGreen02.png', 'assets/laserGreen03.png', 'assets/laserGreen04.png', 'assets/laserGreen05.png', 'assets/laserGreen06.png', 'assets/laserGreen07.png', 'assets/laserGreen08.png', 'assets/laserGreen09.png', 'assets/laserGreen10.png', 'assets/laserGreen11.png', 'assets/laserGreen12.png', 'assets/laserGreen13.png', 'assets/laserGreen14.png', 'assets/laserGreen15.png', 'assets/laserGreen16.png', 'assets/laserRed01.png', 'assets/laserRed02.png', 'assets/laserRed03.png', 'assets/laserRed04.png', 'assets/laserRed05.png', 'assets/laserRed06.png', 'assets/laserRed07.png', 'assets/laserRed08.png', 'assets/laserRed09.png', 'assets/laserRed10.png', 'assets/laserRed11.png', 'assets/laserRed12.png', 'assets/laserRed13.png', 'assets/laserRed14.png', 'assets/laserRed15.png', 'assets/laserRed16.png'], 
      'playerShip': ['assets/playerShip1_blue.png', 'assets/playerShip1_green.png', 'assets/playerShip1_orange.png', 'assets/playerShip1_red.png', 'assets/playerShip2_blue.png', 'assets/playerShip2_green.png', 'assets/playerShip2_orange.png', 'assets/playerShip2_red.png', 'assets/playerShip3_blue.png', 'assets/playerShip3_green.png', 'assets/playerShip3_orange.png', 'assets/playerShip3_red.png'], 
      'powerUps': ['assets/bold_silver.png', 'assets/bolt_bronze.png', 'assets/bolt_gold.png', 'assets/pill_blue.png', 'assets/pill_green.png', 'assets/pill_red.png', 'assets/pill_yellow.png', 'assets/powerupBlue.png', 'assets/powerupBlue_bolt.png', 'assets/powerupBlue_shield.png', 'assets/powerupBlue_star.png', 'assets/powerupGreen.png', 'assets/powerupGreen_bolt.png', 'assets/powerupGreen_shield.png', 'assets/powerupGreen_star.png', 'assets/powerupRed.png', 'assets/powerupRed_bolt.png', 'assets/powerupRed_shield.png', 'assets/powerupRed_star.png', 'assets/powerupYellow.png', 'assets/powerupYellow_bolt.png', 'assets/powerupYellow_shield.png', 'assets/powerupYellow_star.png', 'assets/shield_bronze.png', 'assets/shield_gold.png', 'assets/shield_silver.png', 'assets/star_bronze.png', 'assets/star_gold.png', 'assets/star_silver.png', 'assets/things_bronze.png', 'assets/things_gold.png', 'assets/things_silver.png']
}

function start(){
  started = true;
  startDiv.style.display = "none";
  fullscreen();
  startButton.style("display", 'none');
  let t = document.getElementsByTagName('canvas');
  t[0].requestFullscreen();
}

function preload(){
    for(let folder of Object.keys(paths)){
        for(let path of paths[folder]){
          images[folder][path.split('/')[1]] = loadImage('assets/' + folder + '/' + path.split('/')[1]);
        }
    }
}

function setup() {
  let cnv = createCanvas(displayWidth, displayHeight);
  let container = document.getElementById('container')
  cnv.parent(container);
  container.style.display = "block";

  width = 1000; height = 1000;
  player = new Ship(50, 50, 'playerShip1_blue.png', 100);
  space_background = new Back(width*2, height*2, 300, [-width, -height]);

  startButton  = createElement("BUTTON", "START")
                    .id("start-button")
                    .mousePressed(start);

  socket = io()
  socket.on('playersData', (data) => {
    for(let id of Object.keys(data)){
      if(id !== socket.id){
        let t = new Ship(data[id].x, data[id].y, data[id].imgName, data[id].hp);
        t.shield = data[id].shield;
        t.shieldTime = data[id].shieldTime;
        t._date = Date.parse(data[id]._date);
        t.shieldTimeout = data[id].shieldTimeout;
        t.speedTimeout = data[id].speedTimeout;
        t.speedDate = Date.parse(data[id].speedDate);
        t.speedTime = data[id].speedTime;
        t.speed = data[id].speed;
        players[id] = [t, data[id].angle];
      }
    }
  });

  socket.on('playerDisconnected', (data) => {
    delete players[data.id];
  });

  socket.on('new-bullet', ({b}) => {
    if (b.owner_id !== socket.id) {
      let t = new Bullet(createVector(b.x, b.y), 
                          createVector(b.vx, b.vy),
                          b.imgName,
                          b.owner_id);
      others_bullets.push(t);
    }
  });

  socket.on('take-hit', ({amount}) => {
    player.takeHit(amount);
  });

  socket.on('powerups', ({powerups}) => {
    active_powerups = powerups;
  });

  socket.on('powerup', ({powerup, id}) => {
    if(id == socket.id){
      if(powerup.type == "pill_green.png"){
        player.hp = 100;
      }
      else if(powerup.type == "shield_silver.png"){
        player.giveShield(10);
      }
      else if(powerup.type == "bolt_bronze.png"){
        player.giveSpeed(10, 5);
      }
    }
  });
}
// setup()
function draw() {
  if(started){
    if(player.hp <= 0){
      socket.close();
      alert("You died. RIP.");
      setTimeout(()=>{
        location.reload();
      }, 5000);
      alert("Reloading window in 5s...");
      noLoop();
    }
    background(0);
    
    noFill();
    rect(0, 0, 100, 50);
    text(int(player.pos.x), 10, 15);
    text(int(player.pos.y), 10, 30);
    
    //health bar 
    noFill();
    rect(windowWidth/2-windowWidth*0.25/2, 10, windowWidth*0.25, 30)
    noStroke();
    fill((100-player.hp)/100*255, (player.hp)/100*255, 0);
    rect(windowWidth/2-windowWidth*0.25/2, 10, windowWidth*0.25*player.hp/100, 30)

    translate(windowWidth/2, windowHeight/2);
    scale(1);
    
    //things below this translate moves relative to the 
    //player (if not in separate push pop). Things above stay in place on the screen.
    translate(-player.pos.x, -player.pos.y);
    space_background.show();
    
    player.update();
    player.show();
    
    noFill();
    stroke(255)
    rect(-width, -height, 2*width, 2*height);

    if(Object.keys(players).length > 0){
      for(let id of Object.keys(players)){
        if(id !== socket.id){
          players[id][0].show(players[id][1]);
        }
      }
    }

    for(let [i, b] of others_bullets.entries()){
      for (let id of Object.keys(players)) {
        if((b.owner !== id) && (b.pos.dist(players[id][0].pos) <= 35)) {
          b.collided_with_player = true;
        }
        if(b.pos.dist(player.pos) <= 35){
          b.collided_with_player = true;
        }
      }
      if(b.collided()){
        delete b;
        others_bullets.splice(i, 1);
        continue;
      }

      b.update();
      b.show();
    }

    for(let i = local_bullets.length - 1; i > 0; i--){
      for (let id of Object.keys(players)) {
        if(local_bullets[i].pos.dist(players[id][0].pos) <= 35){
          local_bullets[i].collided_with_player = true;
          socket.emit('hit', {player_id: id});
        }
      }
      if(local_bullets[i].collided()){
        delete local_bullets[i];
        local_bullets.splice(i, 1);
        continue;
      }
      local_bullets[i].update();
      local_bullets[i].show();
    }

    fill(255);
    stroke(255);
    for(let powerup of active_powerups){
      image(images['powerUps'][powerup.type], powerup.x-15, powerup.y-15, 30, 30);
    }
    socket.emit('player', player.toObj());
  }
}

function mouseClicked(){
  if(started && can_shoot){
    let b = player.shoot('laserBlue01.png', socket.id);
    local_bullets.push(b);
    socket.emit('bullet', {bullet_obj: b.toObj()});
    can_shoot = false;
    setTimeout(()=>{
      can_shoot = true;
    }, 500);
  }
}