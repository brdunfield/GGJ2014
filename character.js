var Character = function() {
    this.y = getHeight() /2;
    this.x = 75;
    
    this.isJumping = null;
    this.jumpV = 1;
    this.falling = null;
    this.climbBy = null;
};

Character.prototype.jump = function() {
    var d = new Date();
    this.isJumping = d.getTime();
    this.jumpV = 50;
};

Character.prototype.attack = function() {
    
};

// ?
Character.prototype.render = function(context) {
    context.beginPath();
    context.rect(25, getHeight()/2 - 100, 100, 100);
    context.fillStyle = 'blue';
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'black';
    context.stroke();
};
