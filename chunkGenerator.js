var chunkGenerator = function(){
    this.type = null;
    this.lastChunk = null;
};

chunkGenerator.prototype.generateChunk = function(lastPoint, r, g, b, dist, speed, gravity) {
    // TODO - algorithm to make this based on difficulty
    
    // leave vStart as a power of 2 to save computation
    var vStart = Math.pow(speed, 2) + Math.pow(20, 2), // 20 is jumpV
        theta = Math.asin(20/speed);
    var maxJumpRange = vStart * 2 * Math.sin(theta) * Math.cos(theta) / gravity;
    console.log(maxJumpRange);
    var RNG = Math.random();
    if (RNG < 0.25 && this.lastChunk != "mountain") return this.generateMountain(lastPoint, gravity/speed);
    else if (RNG < 0.5 && this.lastChunk != "spikes" && dist > /*50*/ 5) return this.generateSpikes(lastPoint, maxJumpRange);
    else if (RNG < 0.75 && this.lastChunk != "cliff") return this.generateCliff(lastPoint);
    else return this.generateStraight(lastPoint);
};

chunkGenerator.prototype.generatePlatform = function(startPoint, width) {
    var points = [];
    points.push({'x': startPoint.x, 
                 'y': startPoint.y,
                 'damage': false });
    points.push({'x': startPoint.x, 
                 'y': startPoint.y - 50, 
                 'damage': false });
    points.push({'x': startPoint.x + width, 
                 'y': startPoint.y - 50,
                 'damage': false });
    points.push({'x': startPoint.x + width, 
                 'y': startPoint.y,
                 'damage': false });
    points.push({'x': startPoint.x, 
                 'y': startPoint.y,
                 'damage': false });
    
    return points;
};

chunkGenerator.prototype.generateFork = function(startPoint) {
    console.log("Generating Fork");
    var line = {}
    line.points = [];
    var d = new Date();
    line.id = d.getTime();
    line.master = false;
    line.platform = false;
    
    line.points.push({'x': startPoint.x, 
                 'y': startPoint.y - 150,
                 'damage': false });
    line.points.push({'x': startPoint.x + 500, 
                 'y': startPoint.y - 150,
                 'damage': false });
    line.points.push({'x': startPoint.x + 500, 
                 'y': startPoint.y - 300,
                 'damage': false });
    line.points.push({'x': startPoint.x + 1000, 
                 'y': startPoint.y - 300,
                 'damage': false });
    line.points.push({'x': startPoint.x + 1000, 
                 'y': startPoint.y - 450,
                 'damage': false });
    line.points.push({'x': startPoint.x + 1500, 
                 'y': startPoint.y - 450,
                 'damage': false });
    line.points.push({'x': startPoint.x + 1500, 
                 'y': startPoint.y - 600,
                 'damage': false });
    line.points.push({'x': startPoint.x + 2000, 
                 'y': startPoint.y - 600,
                 'damage': false });
    return line;
};

//make mountain from last point
chunkGenerator.prototype.generateMountain = function(startPoint, maxSlope){
    console.log("Generating Mountain");
    var result = {};
    result.upper = [];
    result.lower =[];
    var peak = [startPoint.x + Math.random()*1000 +400, startPoint.y - Math.random()*400 - 100];
    var endX = peak[0] + Math.random()* 1000 + 400;
    result.upper.push({'x': peak[0], 
                 'y': peak[1],
                 'damage': false });
    result.upper.push({'x': endX, 
                 'y': peak[1] + Math.random()*(endX - peak[0])*maxSlope,
                 'damage': false});
    result.lower.push({'x': endX, 
                 'y': 2*getHeight(),
                 'damage': false});
    
    this.lastChunk = "mountain";
    return result;
};

//make spikes
chunkGenerator.prototype.generateSpikes = function(startPoint, maxJumpRange){
    var result = {};
    console.log("Generating Spikes");
    result.upper = [];
    result.lower = [];
    result.upper.push(startPoint);
    result.platform = null;
    var numSpikes = Math.round(Math.random() * ((maxJumpRange / 15)*2)) + 20;
    console.log("Max jump range: " + maxJumpRange + ", spike distance generated: " + numSpikes*15);
    
    
    if (numSpikes > maxJumpRange/15) {
        // generate a platform
        console.log("Platform");
        var startPoint = {'x': Math.random()*maxJumpRange/15 + startPoint.x,
                          'y': startPoint.y - 150,
                          'damage': false};
        result.platform = new GroundPoly(true, startPoint, 300);
    }
    
    for (var i = 0; i < numSpikes; i++) {
        var spike = this.generateSpike(result.upper[result.upper.length-1]);
        for (var j=0; j < spike.length; j++) {
            result.upper.push(spike[j]);
        }
    }
    result.upper.splice(0,1);
    result.lower.push({'x': result.upper[result.upper.length -1], 
                 'y': 2*getHeight(),
                 'damage': false});
    this.lastChunk="spikes";
    return result;
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
    var result = {};
    result.upper = [];
    result.lower = [];
    var bottom = startPoint.y + Math.random()*100 + 100;
    var endX = startPoint.x + Math.random(200) + 50;
    result.upper.push({'x': startPoint.x, 
                 'y': bottom,
                 'damage': false});
    result.upper.push({'x': endX, 
                 'y': bottom,
                 'damage': false});
    result.lower.push({'x': endX, 
                 'y': 2*getHeight(),
                 'damage': false});
    this.lastChunk="cliff";
    
    return result;
};

chunkGenerator.prototype.generateStraight = function(startPoint){
    console.log("Generating Straight");
    var result = {};
    result.upper = [];
    result.lower = [];
    var endX = startPoint.x + Math.random()*1000 + 500;
    result.upper.push({'x': endX,
                 'y': startPoint.y,
                 'damage': false});
    result.lower.push({'x': endX, 
                 'y': 2*getHeight(),
                 'damage': false});
    this.lastChunk="straight";
    
    return result;
};