//emitter to place at a location
var particleEmitter = function(context, position, velocity, particleVelocity, colour, size, rate, maxParticles){
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.particleVelocity = particleVelocity;
    this.colour = colour;
    this.rate = rate;
    this.size = size;
    this.maxParticles = maxParticles;
    
    this.particles = new Array();
}

particleEmitter.prototype.makeParticle = function(){
    this.particles.push(new particleSquare(this.context, this.position, this.particleVelocity, this.colour, this.size));
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
var particleSquare = function(context, origin, velocity, colour, size){
    this.context = context;
    this.position = new Array();
    this.position[0] = origin[0];
    this.position[1] = origin[1];
    this.rotation = new Array();
    this.rotation[0] = Math.random();
    this.rotation[1] = Math.random();
    this.velocity = new Array();
    this.velocity[0] = Math.floor((Math.random()*velocity[0])-velocity[0]/2);
    this.velocity[1] = Math.floor((Math.random()*velocity[1])-velocity[1]/2);
    this.colour = colour;
    this.size = size;
}

particleSquare.prototype.update = function(){
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
    this.rotation[0] += 0.1;
    this.rotation[1] += 0.1;
}
particleSquare.prototype.draw = function(){
    this.context.fillStyle = "rgb(" + Math.round(this.colour[0]) + ", " + Math.round(this.colour[1]) + ", " + Math.round(this.colour[2]) + ")";
    this.context.ellipse = 
    this.context.fillRect(this.position[0], this.position[1], this.size, this.size);
}
particleSquare.prototype.run = function(){
    this.update();
    this.draw();
}