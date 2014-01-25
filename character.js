var Character = function() {
    this.y = getHeight() /2;
    this.x = 100;
    
    this.jumpV = 1;
    this.falling = null;
    this.climbBy = null;
    
    this.projectiles = [];
    this.shields = [];
};

Character.prototype.jump = function() {
    var d = new Date();
    this.falling = true;
    this.jumpV = 200;
};

Character.prototype.attack = function(context) {
    this.projectiles.push(new particleEmitter(context, [this.x,this.y], [25,0], [5,5], [0,0,0], 4, 20, 5));
};

Character.prototype.defend = function(context){
    this.shields.push(new particleEmitter(context, [this.x,this.y], [0,0], [5,5], [0,0,0], 50, 20, 5));
};

// ?
Character.prototype.render = function(context, r, g, b) {
    context.beginPath();
    context.rect(this.x - 50, this.y - 50, 100, 100);
    context.fillStyle = "rgb(" + Math.round(r) + ", " + Math.round(g) + ", " + Math.round(b) + ")";
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'black';
    context.stroke();
};
