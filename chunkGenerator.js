var chunkGenerator = function(){
    this.type = "none";
    this.lastPoint = [];
    this.lastPoint[0] = 0;
    this.lastPoint[1] = window.getHeight/2;
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
    this.points = new Array();
    for(i = 0; i< 3; i++){
        this.points[i] = new Array();
    }
    this.points[0] = this.lastPoint;
    this.points[1][0] = this.lastPoint[0] + 25;
    this.points[1][1] = this.lastPoint[1] - 50;
    this.points[2][0] = this.lastPoint[0] + 50;
    this.points[2][1] = this.lastPoint[1];
    
    return this.points;
}

//make spikes
//make mountain from last point
chunkGenerator.prototype.makeSpikes = function(){
    this.points = [];
    for(i = 0; i< 11; i++){
        this.points[i] = [];
    }
    this.points[0] = this.lastPoint;
    this.points[1][0] = this.lastPoint[0];
    this.points[1][1] = this.lastPoint[1] - 10;
    this.points[2][0] = this.lastPoint[0] + 5;
    this.points[2][1] = this.lastPoint[1];
    this.points[3][0] = this.lastPoint[0] + 10;
    this.points[3][1] = this.lastPoint[1] - 10;
    this.points[4][0] = this.lastPoint[0] + 15;
    this.points[4][1] = this.lastPoint[1];
    this.points[5][0] = this.lastPoint[0] + 20;
    this.points[5][1] = this.lastPoint[1] - 10;
    this.points[6][0] = this.lastPoint[0] + 25;
    this.points[6][1] = this.lastPoint[1];
    this.points[7][0] = this.lastPoint[0] + 30;
    this.points[7][1] = this.lastPoint[1] - 10;
    this.points[8][0] = this.lastPoint[0] + 35;
    this.points[8][1] = this.lastPoint[1];
    this.points[9][0] = this.lastPoint[0] + 40;
    this.points[9][1] = this.lastPoint[1] - 10;
    this.points[10][0] = this.lastPoint[0] + 45;
    this.points[10][1] = this.lastPoint[1];
    
    return this.points;
}

chunkGenerator.prototype.makeCliff = function(){
    this.points = [];
    for(i = 0; i< 1; i++){
        this.points[i] = [];
    }
    this.points[0] = this.lastPoint;
    this.points[1][0] = this.lastPoint[0];
    this.points[1][1] = this.lastPoint[1] + 50;
    
    return this.points;
}