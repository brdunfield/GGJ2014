var colourPickup  = function(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.radius = Math.random()*25 + 25;
};

colourPickup.prototype.render = function(context) {
    var gradient = context.createRadialGradient(this.x, this.y, this.radius/2, this.x, this.y, this.radius);
    gradient.addColorStop(0, this.type);
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0');
    
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
};