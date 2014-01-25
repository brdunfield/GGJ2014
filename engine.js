Math.twoPI = Math.PI * 2;

var Engine = function(canvasID) {
    var self = this,
        canvas = document.getElementById(canvasID);
    canvas.width = getWidth();
    canvas.height = getHeight();
    this.context = canvas.getContext('2d');
    
    // time
    this.startTime = 0;
    this.lastTime = 0;
    
    //useful stuff
    this.generator = new Generator();
    
    // physics
    this.speed = 500; // px/s
    this.gravity =  50; //px/s/s
    
    // game variables
    this.distance = 0;
    this.char = this.generator.generateCharacter(100);
    
    this.colourDecay = [2, 2, 2]; // per second
    this.r = 70;
    this.g = 100;
    this.b = 200;
    
    this.timeSinceLastColor = 0;
    this.colorPickup = null;
    
    // world variables
    this.worldCoords = [[0, getHeight()/2], [200, getHeight()/2 + 50]];
    this.platformCoords = [];
    this.cG = new chunkGenerator();
    
    // Handlers
    
    // Jump handler
    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 32) {
            if (!self.char.falling)
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
    this.timeSinceLastColor += timeSinceLastFrame;
    
    // Update ~~~~~~~~~~~~~~~~~~~
    this.distance += (this.speed/200 * timeSinceLastFrame / 1000);
    //console.log(Math.round(this.distance));
    this.updateWorld();
    this.translateWorld(timeSinceLastFrame);
    // gravity - fall until you hit a line
    this.checkFalling(timeSinceLastFrame);
    
    // collisions
    if (this.colorPickup) this.checkColourCollisions();
    
    // Update colours
    this.r = Math.max(0, this.r - this.colourDecay[0] * timeSinceLastFrame/1000);
    this.g = Math.max(0, this.g - this.colourDecay[1] * timeSinceLastFrame/1000);
    this.b = Math.max(0, this.b - this.colourDecay[2] * timeSinceLastFrame/1000);
    
    //update character
    this.char.update(time, this.generator);
    
    // Draw ~~~~~~~~~~~~~~~~~~~~~~~
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
    
    if (this.colorPickup) { this.colorPickup.render(context); }
    
    //particle emitter stuff
    this.pEmitter.run(this.lastTime);
    
    // character
    this.char.render(context, this.r, this.g, this.b);
    
    // UI ~~~~~~~~~~~~~~~~~~~
    this.drawUI(context);
    
    
    // call next frame
    this.lastTime = time;
    window.requestAnimationFrame(function(time) {
        self.animate.call(self, time);
    });
};

Engine.prototype.translateWorld = function(t) {
    var d = new Date();
    this.speed = this.speed + t/1000;
    if (this.char.falling)
        this.char.jumpV = this.char.jumpV - (t*this.gravity/1000);
    // translate world according to speed / falling speed
    for (var i = 0; i < this.worldCoords.length; i++) {
        // x
        this.worldCoords[i][0] -= this.speed*t/1000;
        // y
        if (this.char.falling) {
            this.worldCoords[i][1] += this.char.jumpV;
        }
        else if (this.char.climbBy) {
            this.worldCoords[i][1] -= this.char.climbBy;
        }
    }
    // translate colorPickup
    if (this.colorPickup) {
        this.colorPickup.x -= this.speed*t/1000;
        
        if (this.char.falling)
            this.colorPickup.y += this.char.jumpV;
        else if (this.char.climbBy)
            this.colorPickup.y -= this.char.climbBy;
    }
};

Engine.prototype.updateWorld = function() {
    // get rid of old coords
    if (this.worldCoords[1][0] < 0) {
        this.worldCoords.splice(0,1);
    }
    if (this.colorPickup && this.colorPickup.x < -this.colorPickup.radius) {
        this.colorPickup = null;
    }
    // add a new world chunk if needed
    var lastCoord = this.worldCoords[this.worldCoords.length - 1];
    if (lastCoord[0] < getWidth()) {
        var newChunk = this.cG.generateChunk(lastCoord, this.r, this.g, this.b, this.distance, this.speed, this.gravity);
        for (var i=0; i < newChunk.length; i++)
            this.worldCoords.push(newChunk[i]);   
    }
    // generate a colour Pickup maybe
    if (!this.colorPickup && Math.random()*4000 + 2000 < this.timeSinceLastColor) {
        var typeRNG = Math.random();
        var type;
        if (typeRNG < 0.33) {
            type = "red";
        } else if (typeRNG < 0.67) {
            type = "green";
        } else { type = "blue"; }
        this.colorPickup = new colourPickup(type, lastCoord[0], lastCoord[1] - 50);
        this.timeSinceLastColor = 0;
    }
};

Engine.prototype.checkColourCollisions = function() {
    var distance = Math.sqrt(Math.pow(this.char.x - this.colorPickup.x, 2) + Math.pow(this.char.y - this.colorPickup.y, 2));
    if (distance < this.colorPickup.radius + 50) {
        // Pick up the colourPickup
        switch (this.colorPickup.type) {
            case "red":
                this.r = Math.min(255, this.r + 85);
                break;
            case "green":
                this.g = Math.min(255, this.g + 85);
                break;
            case "blue":
                this.b = Math.min(255, this.b + 85);
                break;
        }
        this.colorPickup = null;
    }
};

Engine.prototype.checkFalling = function(t) {
    // determine two points around the char to determine the line segment
    var leftPt, rightPt;
    for (var i = 0; i < this.worldCoords.length; i++) {
        if (this.worldCoords[i][0] < this.char.x) leftPt = this.worldCoords[i];
        
        if (this.worldCoords[i][0] > this.char.x) {
            rightPt = this.worldCoords[i];
            break;
        }
    }
    
    if(!rightPt) return;
    // determine how far away the char is from the line, and whether falling or climbing
    var slope = (rightPt[1] - leftPt[1]) / (rightPt[0] - leftPt[0]);
    var dx = this.char.x - leftPt[0];
    //console.log("slope: " + slope);
    var d = t*this.gravity / 1000; // how far the char would fall with gravity on this frame;
    if ((slope*dx + leftPt[1]) - (this.char.y + 50) > d && !this.char.falling) {
        //console.log("Char needs to fall now");
        this.char.falling = true;
        this.char.jumpV = 0;
        this.char.climbBy = null;
    } else if ((slope*dx + leftPt[1]) > this.char.y + 50) {
        this.char.climbBy = (slope*dx + leftPt[1]) - this.char.y - 50;;
        this.falling = null;
    } else if((slope*dx + leftPt[1]) < this.char.y + 50) {
        this.char.climbBy = (slope*dx + leftPt[1]) - this.char.y - 50;
        this.char.falling = null;
    } else {
        this.char.falling = false;
        this.char.climbBy = null;
    }  
};

Engine.prototype.drawUI = function(context) {
    context.font = "30px Arial";
    context.fillStyle = "#000";
    context.fillText(Math.round(this.distance) + "m", getWidth() - 100, 40);
    
    context.rect(40, 28, 255, 15);
    context.rect(40, 48, 255, 15);
    context.rect(40, 68, 255, 15);
    context.strokeStyle = "#aaa";
    context.lineWidth = 1;
    context.stroke();
    
    context.font = "14px Arial";
    context.fillStyle = "red";
    context.textAlign = "right";
    context.fillText(Math.round(this.r), 30, 40);
    
    context.fillRect(40, 28, Math.round(this.r), 15);
    
    context.fillStyle = "green";
    context.fillText(Math.round(this.g), 30, 60);
    context.fillRect(40, 48, Math.round(this.g), 15);
    
    context.fillStyle = "blue";
    context.fillText(Math.round(this.b), 30, 80);
    context.fillRect(40, 68, Math.round(this.b), 15);
    
    context.setLineDash([5]);
    context.strokeStyle = "#555";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(240, 10);
    context.lineTo(240, 110);
    context.stroke();
    context.setLineDash([0]);
};

/* ~~ Helper Functions ~~ */
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