var Engine = function(canvasID) {
    var self = this,
        canvas = document.getElementById(canvasID);
    canvas.width = getWidth();
    canvas.height = getHeight();
    this.context = canvas.getContext('2d');
    
    this.startTime = 0;
    this.lastTime = 0;
    
    // variables
    this.speed = 500; // px/s
    this.gravity = 50; //px/s
    // this.difficulty
    // this.points;
    // this.colour;
    this.char = new Character();
    
    this.worldCoords = [[0, getHeight()/2], [200, getHeight()/2]];
    this.platformCoords = [];  
    this.tx = 0;
    this.ty = 0;
    
    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 32) {
            self.char.jump();
        }
    });
    
    
    //particle emitter stuff
    this.pEmitter = new particleEmitter(this.context, new Array(300,300), new Array(0,0), new Array(255,0,0));
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
    var timeSinceLastFrame = time - this.lastTime;
    
    // Update
    this.updateWorld();
    this.translateWorld(timeSinceLastFrame);
    
    
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
    
    //particle emitter stuff
    this.pEmitter.run(this.lastTime);
    
    // character
    this.char.render(context);
    
    
    // call next frame
    this.lastTime = time;
    window.requestAnimationFrame(function(time) {
        self.animate.call(self, time);
    });
};

Engine.prototype.translateWorld = function(t) {
    var d = new Date();
    this.speed = this.speed + t/1000;

    // Move world according to speed
    for (var i = 0; i < this.worldCoords.length; i++) {
        // x
        this.worldCoords[i][0] -= this.speed*t/1000;
        // y
        if (this.char.isJumping) {
            this.char.jumpV = this.char.jumpV - (t*this.gravity/1000);
            this.worldCoords[i][1] += this.char.jumpV;
        }
        else if (this.char.falling) {
            this.char.jumpV = this.char.jumpV - (t*this.gravity/1000);
            this.worldCoords[i][1] += this.char.jumpV;
        }
        else if (this.char.climbBy) {
            this.worldCoords[i][1] -= this.char.climbBy;
        }
    }
    
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
    
    // determine how far away the char is from the line, and whether falling or climbing
    var slope = (rightPt[1] - leftPt[1]) / (rightPt[0] - leftPt[0]);
    var dx = this.char.x - leftPt[0];
    //console.log("slope: " + slope);
    if ((slope*dx + leftPt[1]) > this.char.y && !this.char.jumping) {
        //console.log("Char needs to fall now");
        this.char.falling = d.getTime();
        this.char.jumpV = 0;
        this.char.climbBy = null;
    } else if((slope*dx + leftPt[1]) < this.char.y) {
        this.char.climbBy = (slope*dx + leftPt[1]) - this.char.y;
        this.char.falling = null;
        this.char.isJumping = null;
    } else {
        this.char.falling = false;
        this.char.climbBy = null;
        this.char.isJumping = false;
    }
};

Engine.prototype.updateWorld = function() {
    // get rid of old coords
    if (this.worldCoords[1][0] < 0) {
        this.worldCoords.splice(0,1);
    }
    // add a new world chunk if needed
    var lastCoord = this.worldCoords[this.worldCoords.length - 1];
    if (lastCoord[0] < getWidth())
        this.worldCoords.push([lastCoord[0] + Math.random()*300 + 200, lastCoord[1] - (Math.random()*200 - 100)]);    
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