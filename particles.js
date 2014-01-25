//emitter to place at a location
var particleEmitter = function(context, type, position, velocity, particleVelocity, hue, size, rate, maxParticles, life){
    this.context = context;
    this.type = type;
    this.position = position;
    this.velocity = velocity;
    this.particleVelocity = particleVelocity;
    this.hue = hue;
    this.rate = rate;
    this.size = size;
    this.maxParticles = maxParticles;
    
    this.particles = new Array();
}

particleEmitter.prototype.makeParticle = function(){
    this.particles.push(new particle(this.context, this.type, this.position, this.particleVelocity, this.hue, this.size));
}

particleEmitter.prototype.run = function(time){
    //update position first
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
    
    this.particles.forEach( function(each){
        each.run();
    });
    
    if(this.particles.length >= this.maxParticles){
        this.particles.splice(0, 1);
    };
    
    
    //draw the projectile
    this.context.fillRect(this.position[0], this.position[1], 10,5);
}



//individual particle
var particle = function(context, type, origin, velocity, hue, size){
    this.context = context;
    this.type = type;
    this.position = new Array();
    this.position[0] = origin[0];
    this.position[1] = origin[1];
    this.rotation = 0;
    this.velocity = new Array();
    this.velocity[0] = Math.floor((Math.random()*velocity[0])-velocity[0]/2);
    this.velocity[1] = Math.floor((Math.random()*velocity[1])-velocity[1]/2);
    this.hue = hue;
    this.size = size;
}

particle.prototype.update = function(){
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
    this.rotation[0] += 0.1;
    this.rotation[1] += 0.1;
}
particle.prototype.drawRect = function(){
    this.context.fillStyle = "hsla(" + this.hue + ", 100%, 20%, 0.5)";
    this.context.strokeStyle = null;
    this.context.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
}
particle.prototype.drawEllipse = function(){
    this.context.beginPath();
    this.context.fillStyle = "hsla(" + this.hue + ", 90%, 40%, 0.5)";
    this.context.strokeStyle = 'black';
    this.context.ellipse(this.position[0], this.position[1], this.size[0], this.size[1], this.rotation, 0, 2*Math.PI, false);
    this.context.fill();
    this.context.closePath();
}

particle.prototype.run = function(){
    this.update();
    //pick a rect or an ellipse
    if(this.type=="ellipse") this.drawEllipse();
    else if(this.type=="rect") this.drawRect();
}


