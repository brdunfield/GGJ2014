var Character = function() {
    this.y = getHeight() /2;
    this.x = 100;
    
    this.jumpV = 1;
    this.falling = null;
    this.climbBy = null;
};

Character.prototype.jump = function() {
    var d = new Date();
    this.falling = true;
    this.jumpV = 200;
};

Character.prototype.attack = function() {
    
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
