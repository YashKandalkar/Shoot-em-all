class Ship{
  constructor(x, y, imgName, hp){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.speed = 5;
    this.imgName = imgName;
    this.hp = hp;
    this.shield = false;
    this.shieldTime = 0
    this._date = 0;
    this.shieldTimeout;
  }
  
  show(angle = null){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle || this.vel.heading()+PI/2);
    image(images['playerShip'][this.imgName], -17.5, -15, 35, 30);
    if(this.shield){
      image(images['effects']['shield3.png'], -22.5, -20, 45, 40);
    }
    pop();
    if(this.shield){
      noFill();
      stroke(255);
      rect(this.pos.x - 25, this.pos.y + 30, 50, 10);
      fill(255, 255, 255, 100);
      noStroke();
      rect(this.pos.x - 25, this.pos.y + 30, (1-((new Date()) - this._date)/this.shieldTime)*50, 10);
    }
  }
  
  update(){
    this.vel = createVector(mouseX - windowWidth/2, mouseY - windowHeight/2);
    var d = dist(mouseX, mouseY, width/2, height/2);
    this.vel.mult(d*0.0005);    
    this.vel.limit(this.speed);

    this.pos.x = constrain(this.pos.x, -width, width);
    this.pos.y = constrain(this.pos.y, -height, height);

    this.pos.add(this.vel);
  }

  giveShield(time){
    if(this.shieldTimeout){
      clearTimeout(this.shieldTimeout);
    }
    this.shield = true;
    this._date = new Date();
    this.shieldTime = time*1000;
    this.shieldTimeout = setTimeout(()=>{
                          this.shield = false;
                         }, time*1000);
  }
  
  shoot(imgName, owner){
    var v = createVector(mouseX - windowWidth/2, mouseY - windowHeight/2);
    v.setMag(17);
    // v.setMag(this.vel.magSq() > 4 ? this.vel.magSq() : 9);
    return new Bullet(createVector(this.pos.x, this.pos.y), v, imgName, owner);
  }

  takeHit(amount){
    if(!this.shield)
      this.hp -= amount;
  }

  toObj(){
    return  {
              x: this.pos.x, 
              y: this.pos.y, 
              imgName: this.imgName, 
              hp: this.hp,
              angle: this.vel.heading()+PI/2
            }
  }
}

class Bullet{
  constructor(pos, vel, imgName, owner){
    this.vel = vel;
    this.pos = pos;
    this.imgName = imgName;
    this.collided_with_player = false;
    this.owner = owner;
  }

  show(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI/2);
    image(images['lasers'][this.imgName], 0, 0, 10, 40);
    pop();
  }

  update(){
    this.pos.add(this.vel);
  }

  collided(){
    return this.pos.x > width || this.pos.x < -width
        || this.pos.y > height|| this.pos.y < -height
        || this.collided_with_player;
  }
  toObj(){
    return {
              x: this.pos.x,
              y: this.pos.y,
              vx: this.vel.x,
              vy: this.vel.y,
              imgName: this.imgName
            }
  }
}

class Back{
  constructor(w, h, maxStars, origin){
    this.w = w;
    this.h = h;
    this.prop = [];
    this.origin = origin;
    this.maxStars = maxStars;
    for(let i = 0; i <= maxStars; i++){
      this.prop.push([random()*w, random()*h, random(1, 5)]);
    }
  }

  show(){
    for(let i = this.prop.length-1; i >= 0; i--){
      fill(255);
      ellipse(this.prop[i][0]+this.origin[0], 
              this.prop[i][1]+this.origin[1], 
              this.prop[i][2], 
              this.prop[i][2]);
    }
  }
}

class Powerup{
  
}