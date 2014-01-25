var chunkGenerator = function(){
    this.type = null;
    this.lastChunk = null;
};

chunkGenerator.prototype.generateChunk = function(lastPoint, r, g, b, dist, speed, gravity) {
    // TODO - algorithm to make this based on difficulty
    
    // leave vStart as a power of 2 to save computation
    var vStart = Math.pow(speed, 2) + Math.pow(50, 2),
        theta = Math.asin(50/speed);
    var maxJumpRange = vStart * Math.sin(2*theta) / gravity;
    console.log(maxJumpRange);
    var RNG = Math.random();
    if (RNG < 0.25 && this.lastChunk != "mountain") return this.generateMountain(lastPoint, gravity/speed);
    else if (RNG < 0.5 && this.lastChunk != "spikes") return this.generateSpikes(lastPoint, maxJumpRange);
    else if (RNG < 0.75 && this.lastChunk != "cliff") return this.generateCliff(lastPoint);
    else return this.generateStraight(lastPoint);
};

//make mountain from last point
chunkGenerator.prototype.generateMountain = function(startPoint, maxSlope){
    var points = [];
    var peak = [startPoint[0] + Math.random()*1000 +400, startPoint[1] - Math.random()*400 - 100];
    var endX = peak[0] + Math.random()* 1000 + 400;
    points.push([peak[0], peak[1]]);
    points.push([endX, peak[1] + Math.random()*(endX - peak[0])*maxSlope]);
    
    this.lastChunk = "mountain";
    return points;
};

//make spikes
//make mountain from last point
chunkGenerator.prototype.generateSpikes = function(startPoint, maxJumpRange){
    var points = [];
    points.push(startPoint);
    var numSpikes = Math.round(Math.random() * ((maxJumpRange / 15) - 6)) + 5;
    for (var i = 0; i < numSpikes; i++) {
        var spike = this.generateSpike(points[points.length-1]);
        for (var j=0; j < spike.length; j++) {
            points.push(spike[j]);
        }
    }
    points.splice(0,1);
    this.lastChunk="spikes";
    return points;
};

chunkGenerator.prototype.generateSpike = function(startPoint) {
    var points =[];
    points.push([startPoint[0] + 5, startPoint[1] - 10]);
    points.push([startPoint[0] + 10, startPoint[1]]);
    points.push([startPoint[0] + 15, startPoint[1]]);
    return points;
}

chunkGenerator.prototype.generateCliff = function(startPoint){
    var points = [];
    
    points.push([startPoint[0], startPoint[1] + Math.random()*100 + 100]);
    this.lastChunk="cliff";
    
    return points;
};

chunkGenerator.prototype.generateStraight = function(startPoint){
    var points = [];
    
    points.push([startPoint[0] + Math.random()*1000 + 500, startPoint[1]]);
    this.lastChunk="straight";
    
    return points;
};
