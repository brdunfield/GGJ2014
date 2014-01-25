var Engine = function(canvasID) {
    var self = this,
        canvas = document.getElementById(canvasID);
    canvas.width = getWidth();
    canvas.height = getHeight();
    this.context = canvas.getContext('2d');
    
    this.startTime = 0;
    
    // variables
    this.speed = 1;
    // this.difficulty
    // this.points;
    // this.colour;
    this.char = new Character();
    
    this.worldCoords = [[0, getHeight()/2], [200, getHeight()/2]];
    this.platformCoords = [];
    this.tx = 0;
    this.ty = 0;
};

Engine.prototype.start = function() {
    var self = this;
    var d = new Date();
    this.startTime = d.getTime();
    window.requestAnimationFrame(function (time) {
        self.animate.call(self, time);
    });
};

Engine.prototype.animate = function(time) {
    var self = this,
        context = this.context;
    
    
    // Update
    
    this.updateWorld();
    
    
    // Draw
    context.clearRect(0, 0, getWidth(), getHeight());
    
    // background
    
    
    // foreground
    context.beginPath();
    context.moveTo(this.worldCoords[0][0], this.worldCoords[0][1]);
    for (var i=1; i < this.worldCoords.length; i++) {
        context.lineTo(this.worldCoords[i][0], this.worldCoords[i][1]);
    }
    context.strokeStyle = 'black';
    context.stroke();
    
    // character
    this.char.render(context);
    
    
    // call next frame
    window.requestAnimationFrame(function(time) {
        self.animate.call(self, time);
    });
};

Engine.prototype.updateWorld = function() {
    var d = new Date();
    this.speed = 1 + (d.getTime() - this.startTime)/10000;

    // Move world according to speed
    for (var i = 0; i < this.worldCoords.length; i++) {
        this.worldCoords[i][0] -= this.speed;
        if (this.char.falling) {
            var fallV = (d.getTime() - this.char.falling)/1000 * 200;
            this.worldCoords[i][1] -= fallV;
        }
        if (this.char.climbBy) {
            this.worldCoords[i][1] -= this.char.climbBy;
        }
    }
    // get rid of old coords
    if (this.worldCoords[1][0] < 0) {
        this.worldCoords.splice(0,1);
    }
    // add a new coord if needed
    var lastCoord = this.worldCoords[this.worldCoords.length - 1];
    if (lastCoord[0] < getWidth())
        this.worldCoords.push([lastCoord[0] + Math.random()*300 + 200, lastCoord[1] - (Math.random()*200 - 100)]);
    
    // gravity - fall until you hit a line
    // determine two points around the char to determine the line segment
    var leftPt, rightPt;
    for (var i = 0; i < this.worldCoords.length; i++) {
        if (this.worldCoords[i][0] < this.char.x) leftPt = this.worldCoords[i];
        
        if (this.worldCoords[i][0] > this.char.x) {
            rightPt = this.worldCoords[i];
            break;
        }
    }
    var slope = (rightPt[1] - leftPt[1]) / (rightPt[0] - leftPt[0]);
    var dx = this.char.x - leftPt[0];
    //console.log("slope: " + slope);
    if ((slope*dx + leftPt[1]) > this.char.y) {
        //console.log("Char needs to fall now");
        this.char.falling = d.getTime();
        this.fallAcc = 1;
        this.char.climbBy = null;
    } else if((slope*dx + leftPt[1]) < this.char.y) {
        this.char.climbBy = (slope*dx + leftPt[1]) - this.char.y;
        this.char.falling = null;
    } else {
        this.char.falling = false;
        this.char.climbBy = null;
    }
};

/* ~~ Helper Functions */
function getWidth() {
    if (self.innerWidth) {
       return self.innerWidth;
    }
    else if (document.documentElement && document.documentElement.clientWidth){
        return document.documentElement.clientWidth;
    }
    else if (document.body) {
        return document.body.clientWidth;
    }
    return 0;
}
function getHeight() {
    if (self.innerHeight) {
       return self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight){
        return document.documentElement.clientHeight;
    }
    else if (document.body) {
        return document.body.clientHeight;
    }
    return 0;
}