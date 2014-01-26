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
    else if (RNG < 0.5 && this.lastChunk != "spikes" && dist > /*50*/ 5) return this.generateSpikes(lastPoint, maxJumpRange);
    else if (RNG < 0.75 && this.lastChunk != "cliff") return this.generateCliff(lastPoint);
    else return this.generateStraight(lastPoint);
};

//make mountain from last point
chunkGenerator.prototype.generateMountain = function(startPoint, maxSlope){
    console.log("Generating Mountain");
    var points = [];
    var peak = [startPoint.x + Math.random()*1000 +400, startPoint.y - Math.random()*400 - 100];
    var endX = peak[0] + Math.random()* 1000 + 400;
    points.push({'x': peak[0], 
                 'y': peak[1],
                 'damage': false });
    points.push({'x': endX, 
                 'y': peak[1] + Math.random()*(endX - peak[0])*maxSlope,
                 'damage': false});
    
    this.lastChunk = "mountain";
    return points;
};

//make spikes
//make mountain from last point
chunkGenerator.prototype.generateSpikes = function(startPoint, maxJumpRange){
    console.log("Generating Spikes");
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
    points.push({'x': startPoint.x + 5,
                 'y': startPoint.y - 10,
                 'damage': true });
    points.push({'x': startPoint.x + 10,
                 'y': startPoint.y,
                 'damage': true });
    points.push({'x': startPoint.x + 15,
                 'y': startPoint.y,
                 'damage': true });
    return points;
}

chunkGenerator.prototype.generateCliff = function(startPoint){
    console.log("Generating Cliff");
    var points = [];
    var bottom = startPoint.y + Math.random()*100 + 100;
    points.push({'x': startPoint.x, 
                 'y': bottom,
                 'damage': false});
    points.push({'x': startPoint.x + Math.random(200) + 50, 
                 'y': bottom,
                 'damage': false});
    this.lastChunk="cliff";
    
    return points;
};

chunkGenerator.prototype.generateStraight = function(startPoint){
    console.log("Generating Straight");
    var points = [];
    
    points.push({'x': startPoint.x + Math.random()*1000 + 500,
                 'y': startPoint.y,
                 'damage': false});
    this.lastChunk="straight";
    
    return points;
};
