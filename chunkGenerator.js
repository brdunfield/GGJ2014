var chunkGenerator = function(){
    this.type = "none";
    this.lastPoint = [0, window.getHeight/2];
}

chunkGenerator.prototype.pickType = function(){
    
    //use values for ryb to form a pool of types that can be chosen:
    //eg red red yellow, make pool of 2 1's and a 0
    //pick one of the numbers at random to use as terrain type
    
    //generate random number between 1 and 2 (# of terrain types)
    //assign terrain types as
    
    //return string type of terrain to generate
    //mountain, pit, spikes
    return type;
}

//make mountain from last point
chunkGenerator.prototype.makeMountain = function(){
    this.points = [];
    this.points.push(this.lastPoint);
    this.points.push([this.lastPoint[0] + 25, this.lastPoint[1] - 50]);
    this.points.push([this.lastPoint[0] + 50, this.lastPoint[1]]);
    
    return this.points;
}

//make spikes
//make mountain from last point
chunkGenerator.prototype.makeSpikes = function(){
    this.points = [];
    
    this.points.push(this.lastPoint);
    this.points.push([this.lastPoint[0], this.lastPoint[1] - 10]);
    this.points.push([this.lastPoint[0] + 5, this.lastPoint[1]]);
    this.points.push([this.lastPoint[0] + 10, this.lastPoint[1] - 10]);
    this.points.push([this.lastPoint[0] + 15, this.lastPoint[1]]);
    this.points.push([this.lastPoint[0] + 20, this.lastPoint[1] - 10]);
    this.points.push([this.lastPoint[0] + 25, this.lastPoint[1]]);
    this.points.push([this.lastPoint[0] + 30, this.lastPoint[1] - 10]);
    this.points.push([this.lastPoint[0] + 35, this.lastPoint[1]]);
    this.points.push([this.lastPoint[0] + 40, this.lastPoint[1] - 10]);
    this.points.push([this.lastPoint[0] + 45, this.lastPoint[1]]);
    
    return this.points;
}

chunkGenerator.prototype.makeCliff = function(){
    this.points = [];
    
    this.points.push(this.lastPoint);
    this.points.push([this.lastPoint[0], this.lastPoint[1] + 50]);
    
    return this.points;
}