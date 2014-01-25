//emitter to place at a location
var particleEmitter = function(context, position, velocity, colour){
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.colour = colour;
    
    this.particles = new Array();
}

particleEmitter.prototype.run = function(time){
    //update position first
    
    //then emit a new particle
    this.particles.push(new particleSquare(this.context, this.position, this.colour));
    
    this.particles.forEach( function(each){
        each.run();
    });
    
    if(this.particles.length >= 20){
        this.particles.splice(0, 1);
    };
    
    console.log(this.position);
}



//individual particle
var particleSquare = function(context, origin, colour){
    this.context = context;
    this.position = new Array();
    this.position[0] = origin[0];
    this.position[1] = origin[1];
    this.rotation = new Array();
    this.rotation[0] = Math.random();
    this.rotation[1] = Math.random();
    
    this.velocity = new Array();
    this.velocity[0] = Math.floor((Math.random()*20)-10);
    this.velocity[1] = Math.floor((Math.random()*20)-10);
    this.colour = colour;
}

particleSquare.prototype.update = function(){
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
    this.rotation[0] += 0.1;
    this.rotation[1] += 0.1;
}
particleSquare.prototype.draw = function(){
    this.context.fillStyle = 'black';
    
    this.context.fillRect(this.position[0], this.position[1], 5, 5);
}
particleSquare.prototype.run = function(){
    this.update();
    this.draw();
}