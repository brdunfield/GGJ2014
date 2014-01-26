//emitter to place at a location
var particleEmitter = function(context, type, position, velocity, particleVelocity, color, size, rate, maxParticles, centralParticle){
    this.context = context;
    this.type = type;
    this.position = position;
    this.velocity = velocity;
    this.particleVelocity = particleVelocity;
    this.color = color;
    this.rate = rate;
    this.size = size;
    this.maxParticles = maxParticles;
    this.centralParticle = (typeof(centralParticle) == 'undefined') ? true : centralParticle;
    
    this.particles = new Array();
}

particleEmitter.prototype.makeParticle = function(){
    this.particles.push(new particle(this.context, this.type, this.position, this.particleVelocity, this.color, this.size));
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
    if(this.centralParticle){
        this.context.save();
        this.context.fillStyle = this.color;
        this.context.globalAlpha = 0.9;
        this.context.lineWidth = 2;
        this.context.fillRect(this.position[0], this.position[1], 20,10);
        this.context.restore();
    }
}

//individual particle
var particle = function(context, type, origin, velocity, color, size){
    this.context = context;
    this.type = type;
    this.position = new Array();
    this.position[0] = origin[0];
    this.position[1] = origin[1];
    this.rotation = 0;
    this.velocity = new Array();
    this.velocity[0] = Math.floor((Math.random()*velocity[0])-velocity[0]/2);
    this.velocity[1] = Math.floor((Math.random()*velocity[1])-velocity[1]/2);
    this.color = color;
    this.opacity = 1.0;
    this.size = size;
}

particle.prototype.update = function(){
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
    this.rotation[0] += 0.1;
    this.rotation[1] += 0.1;
    
    this.opacity = Math.max(this.opacity - 0.1, 0);
}
particle.prototype.drawRect = function(){
    this.context.save();
    this.context.fillStyle = this.color;
    this.context.globalAlpha = this.opacity;
    this.context.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
    this.context.restore();
}
particle.prototype.drawEllipse = function(){
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = this.color;
    this.context.globalAlpha = this.opacity;
    this.context.lineWidth = 2;
    this.context.ellipse(this.position[0], this.position[1], this.size[0], this.size[1], this.rotation, 0, 2*Math.PI, false);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
}

particle.prototype.run = function(){
    this.update();
    //pick a rect or an ellipse
    if(this.type=="ellipse") this.drawEllipse();
    else if(this.type=="rect") this.drawRect();
}


