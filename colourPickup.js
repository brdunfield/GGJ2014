var colourPickup  = function(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.radius = Math.random()*25 + 25;
};

colourPickup.prototype.render = function(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    context.closePath();
    context.fillStyle = this.type;
    context.fill();
};