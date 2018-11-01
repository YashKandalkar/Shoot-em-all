class Ship{
  constructor(x, y, imgName, hp){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.imgName = imgName;
    this.hp = hp;
  }
  
  show(angle = null){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle || this.vel.heading()+PI/2);
    image(images['playerShip'][this.imgName], -14, -14, 35, 30);
    pop();
  }
  
  update(){
    this.vel = createVector(mouseX-width/2, mouseY-height/2);
    var d = dist(mouseX, mouseY, width/2, height/2);
    this.vel.mult(d*0.0005);    
    this.vel.limit(5);

    this.pos.x = constrain(this.pos.x, -width, width);
    this.pos.y = constrain(this.pos.y, -height, height);

    this.pos.add(this.vel);
  }

  shoot(img){
    var v = createVector(mouseX - width/2, mouseY - height/2);
    v.setMag(this.vel.magSq() > 4 ? this.vel.magSq() : 9);
    return new Bullet(createVector(this.pos.x, this.pos.y), v, img);
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
  constructor(pos, vel, img){
    this.vel = vel;
    this.pos = pos;
    this.img = img;
  }

  show(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI/2);
    image(this.img, 0, 0, 10, 40);
    pop();
  }

  update(){
    this.pos.add(this.vel);
    for (let i of Object.keys(players)) {
      //players[i]
    }
  }

  collided(){
    return this.pos.x > width || this.pos.x < -width
        || this.pos.y > height|| this.pos.y < -height;
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