var socket = io();
var players = {};

var player_img;
var player, space_background;

var startDiv, charDiv, gameName;
var startB, helpB, aboutB;
var started = false;

function start(){
    started = true;
    startDiv.hide()
}

var paths = {
  'damage': ['assets/playerShip1_damage1.png', 'assets/playerShip1_damage2.png', 'assets/playerShip1_damage3.png', 'assets/playerShip2_damage1.png', 'assets/playerShip2_damage2.png', 'assets/playerShip2_damage3.png', 'assets/playerShip3_damage1.png', 'assets/playerShip3_damage2.png', 'assets/playerShip3_damage3.png'], 
  'effects': ['assets/fire00.png', 'assets/fire01.png', 'assets/fire02.png', 'assets/fire03.png', 'assets/fire04.png', 'assets/fire05.png', 'assets/fire06.png', 'assets/fire07.png', 'assets/fire08.png', 'assets/fire09.png', 'assets/fire10.png', 'assets/fire11.png', 'assets/fire12.png', 'assets/fire13.png', 'assets/fire14.png', 'assets/fire15.png', 'assets/fire16.png', 'assets/fire17.png', 'assets/fire18.png', 'assets/fire19.png', 'assets/shield1.png', 'assets/shield2.png', 'assets/shield3.png', 'assets/speed.png', 'assets/star1.png', 'assets/star2.png', 'assets/star3.png'], 
  'lasers': ['assets/laserBlue01.png', 'assets/laserBlue02.png', 'assets/laserBlue03.png', 'assets/laserBlue04.png', 'assets/laserBlue05.png', 'assets/laserBlue06.png', 'assets/laserBlue07.png', 'assets/laserBlue08.png', 'assets/laserBlue09.png', 'assets/laserBlue10.png', 'assets/laserBlue11.png', 'assets/laserBlue12.png', 'assets/laserBlue13.png', 'assets/laserBlue14.png', 'assets/laserBlue15.png', 'assets/laserBlue16.png', 'assets/laserGreen01.png', 'assets/laserGreen02.png', 'assets/laserGreen03.png', 'assets/laserGreen04.png', 'assets/laserGreen05.png', 'assets/laserGreen06.png', 'assets/laserGreen07.png', 'assets/laserGreen08.png', 'assets/laserGreen09.png', 'assets/laserGreen10.png', 'assets/laserGreen11.png', 'assets/laserGreen12.png', 'assets/laserGreen13.png', 'assets/laserGreen14.png', 'assets/laserGreen15.png', 'assets/laserGreen16.png', 'assets/laserRed01.png', 'assets/laserRed02.png', 'assets/laserRed03.png', 'assets/laserRed04.png', 'assets/laserRed05.png', 'assets/laserRed06.png', 'assets/laserRed07.png', 'assets/laserRed08.png', 'assets/laserRed09.png', 'assets/laserRed10.png', 'assets/laserRed11.png', 'assets/laserRed12.png', 'assets/laserRed13.png', 'assets/laserRed14.png', 'assets/laserRed15.png', 'assets/laserRed16.png'], 
  'playerShip': ['assets/playerShip1_blue.png', 'assets/playerShip1_green.png', 'assets/playerShip1_orange.png', 'assets/playerShip1_red.png', 'assets/playerShip2_blue.png', 'assets/playerShip2_green.png', 'assets/playerShip2_orange.png', 'assets/playerShip2_red.png', 'assets/playerShip3_blue.png', 'assets/playerShip3_green.png', 'assets/playerShip3_orange.png', 'assets/playerShip3_red.png'], 
  'powerUps': ['assets/bold_silver.png', 'assets/bolt_bronze.png', 'assets/bolt_gold.png', 'assets/pill_blue.png', 'assets/pill_green.png', 'assets/pill_red.png', 'assets/pill_yellow.png', 'assets/powerupBlue.png', 'assets/powerupBlue_bolt.png', 'assets/powerupBlue_shield.png', 'assets/powerupBlue_star.png', 'assets/powerupGreen.png', 'assets/powerupGreen_bolt.png', 'assets/powerupGreen_shield.png', 'assets/powerupGreen_star.png', 'assets/powerupRed.png', 'assets/powerupRed_bolt.png', 'assets/powerupRed_shield.png', 'assets/powerupRed_star.png', 'assets/powerupYellow.png', 'assets/powerupYellow_bolt.png', 'assets/powerupYellow_shield.png', 'assets/powerupYellow_star.png', 'assets/shield_bronze.png', 'assets/shield_gold.png', 'assets/shield_silver.png', 'assets/star_bronze.png', 'assets/star_gold.png', 'assets/star_silver.png', 'assets/things_bronze.png', 'assets/things_gold.png', 'assets/things_silver.png']
}

var images = {
  'damage': {},
  'effects': {},
  'lasers': {},
  'playerShip': {},
  'powerUps': {}
}

var bullets = [];

function preload(){
  for(let folder of Object.keys(paths)){
    for(let path of paths[folder]){
      images[folder][path.split('/')[1]] = loadImage('assets/' + folder + '/' + path.split('/')[1]);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  width = 1000; height = 1000;
  player = new Ship(50, 50, 'playerShip1_blue.png', 100);
  space_background = new Back(width*2, height*2, 300, [-width, -height]);
  
  socket.on('playersData', (data) => {
    for(let id of Object.keys(data)){
      if(id !== socket.id){
        players[id] = [new Ship(data[id].x, data[id].y, data[id].imgName, data[id].hp), data[id].angle];
      }
    }
  });

  socket.on('playerDisconnected', (data)=>{
    delete players[data.id];
  });

  startDiv = createDiv();
  charDiv = createDiv();
  
  gameName = createP("Shoot 'em All");
    
  helpB = createDiv('<i class="fas fa-info-circle fa-2x"></i>');
  startB = createButton("START");

  startDiv
    .position(0, 0)
    .style("width", str(windowWidth) + "px")
    .style("height", str(windowHeight) + "px")
    .style("background-image", "url(https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX1168602.jpg)");

  gameName
    .position(windowWidth/2-50, 70)
    .style("font-family", "'Cinzel', serif")
    .style("color", "rgb(255, 194, 102)")
    .style("font-size", "40px")
    .style("text-align", "center")
    .style("border", "3px solid rgb(204, 122, 0)")
    .parent(startDiv);

  startB
    .position(windowWidth/2-80, str(windowHeight/2-70))
    .style("font-family", "'Cinzel', serif")
    .style("color", "rgb(255, 194, 102)")
    .style("font-size", "40px")
    .style("text-align", "center")
    .style("background", "#000000")        
    .style("border-color", "rgb(204, 122, 0)")
    .mouseClicked(start)
    .parent(startDiv)
        
  helpB
    .position(windowWidth-45, windowHeight-45)
    .style("background", "#ffffff")
    .parent(startDiv)
}

function draw() {
  if(started){
    background(0);
    
    rect(0, 0, 100, 50);
    text(int(player.pos.x), 10, 15);
    text(int(player.pos.y), 10, 30);
    
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

    socket.emit('player', player.toObj());
    //socket.emit('bullets', {b: bullets})

    if(Object.keys(players).length > 0){
      for(let id of Object.keys(players)){
        if(id !== player.id){
          players[id][0].show(players[id][1]);
        }
      }
    }

    for(let i = bullets.length - 1; i > 0; i--){
      if(bullets[i].collided()){
        bullets.splice(i, 1);
        continue;
      }
      bullets[i].update();
      bullets[i].show()
    }
  }
}

function mouseClicked(){
  if(started){
    bullets.push(player.shoot(images['lasers']['laserBlue01.png']));
  }
}