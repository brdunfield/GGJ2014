//emitter to place at a location
var particleEmitter = function(context, position, velocity, colour){
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.colour = colour;
    
    this.particles = new Array();
}

particleEmitter.prototype.run = function(){
    //update position first
    
    //then emit a new particle
    this.particles.push(new particleSquare(this.context, this.position, this.colour));
    
//    if(
    this.particles.forEach( function(each){
        each.run();
//        console.log(each.position);
    });
    
    if(this.particles.length >= 20) this.particles.splice(0, 1);
}



//individual particle
var particleSquare = function(context, origin, colour){
    this.context = context;
    this.position = origin;
    this.velocity = new Array();
    this.velocity[0] = Math.floor((Math.random()*100)+1);
    this.velocity[1] = Math.floor((Math.random()*100)+1);
    this.colour = colour;
}

particleSquare.prototype.update = function(){
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
}
particleSquare.prototype.draw = function(){
    this.context.fillStyle = 'black';
    this.context.strokeStyle = null;
    this.context.lineWidth = 1;
    this.context.fillRect(this.position[0], this.position[1], 5, 5);
}
particleSquare.prototype.run = function(){
    this.update();
    this.draw();
}