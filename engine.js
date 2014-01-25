Math.twoPI = Math.PI * 2;

var Engine = function(canvasID) {
    var self = this,
        canvas = document.getElementById(canvasID);
    
    canvas.width = getWidth();
    canvas.height = getHeight();
    this.context = canvas.getContext('2d');
    
    //useful stuff
    this.generator = new Generator();
    
    //graphics 
    this.offsetForeground = 0;
    this.numScrolls = 1;
    this.imgForeground = this.generator.generateBackground(canvas.width, canvas.height, 30, 0, 0.05);
    this.imgForegroundNext = this.generator.generateBackground(canvas.width, canvas.height, 30, 1, 0.05);
    
    // time
    this.startTime = 0;
    this.lastTime = 0;
    
    // physics
    this.speed = 500; // px/s
    this.gravity =  50; //px/s/s
    
    // game variables
    this.distance = 0;
    this.char = this.generator.generateCharacter(100);
    this.enemies = new Enemies();
    
    this.timeSinceLastEnemy = 0;
    
    this.colourDecay = [2, 2, 2]; // per second
    this.r = Math.random() * 100 + 50;
    this.g = Math.random() * 100 + 50;
    this.b = Math.random() * 100 + 50;
    
    this.timeSinceLastColor = 0;
    this.timeSinceLastParticle = 0;
    this.timeSinceLastDamage = 0;
    this.colorPickup = null;
    
    // world variables
    this.worldCoords = [{'x': 0, 'y': getHeight()/2, 'damage': false}, {'x': 200, 'y': getHeight()/2 + 50, 'damage': false}];
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
    this.restartHandler = null;
    
    //particle emitter stuff
    this.pEmitter = new particleEmitter(this.context, new Array(300,300), new Array(0,0), new Array(255,0,0));
};

Engine.prototype.start = function() {
    var self = this;
    var d = new Date();
    this.startTime = d.getTime();
    this.restartHandler = null;
    window.requestAnimationFrame(function (time) {
        self.animate.call(self, time);
    });
};

Engine.prototype.animate = function(time) {
    var self = this,
        context = this.context;
    var timeSinceLastFrame = time - this.lastTime;
    this.timeSinceLastColor += timeSinceLastFrame;
    this.timeSinceLastEnemy += timeSinceLastFrame;
    this.timeSinceLastDamage += timeSinceLastFrame;
    
    // Update ~~~~~~~~~~~~~~~~~~~
    this.distance += (this.speed * timeSinceLastFrame / 1000) / 500; // divide by initial speed as if it were a meter
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
    
    //update image color blending
    var r = this.r / 255,
        g = this.g / 255,
        b = this.b / 255;
    this.imgForeground.blend(r * r, g * g, b * b);
    this.imgForegroundNext.blend(r * r, g * g, b * b);
    //image positions
    this.offsetForeground -= this.speed * timeSinceLastFrame * 0.001;
    if(this.offsetForeground <= -context.canvas.width)
    {
        this.offsetForeground = 0;
        this.imgForeground = this.imgForegroundNext;
        this.imgForegroundNext = this.generator.generateBackground(this.imgForeground.w, this.imgForeground.h, 30, ++this.numScrolls, 0.05);
    }
    
    //update character and enemies
    this.char.update(time, this.generator);
    this.enemies.update(time, this.generator);
    
    // Draw ~~~~~~~~~~~~~~~~~~~~~~~
    context.clearRect(0, 0, getWidth(), getHeight());
    
    if (this.char.hp <= 0) {
        context.font = "50px Arial";
        context.fillStyle = "#000";
        context.textAlign = "left";
        context.fillText("Game Over.", getWidth()/2, getHeight()/2);
        
        context.rect(getWidth()/2, getHeight()/2 + 50, 300, 50);
        context.fillStyle = 'green';
        context.fill();
        
        context.font = "18px Arial";
        context.fillStyle="#000";
        context.fillText("Play Again", getWidth() / 2 + 100, getHeight()/2 + 80);
        
        this.restartHandler = document.getElementById("canvas").addEventListener('click', function(e) {
            if (e.clientX > getWidth() / 2 && e.clientX < getWidth() / 2 + 300 && e.clientY > getHeight()/2 + 50 && e.clientY < getWidth()/2 + 100) {
                self = new Engine("canvas");
                self.start();
            }
        });
        return;
    }
    
    // background
    
    
    // foreground
    //draw path for clipping
    context.save();
        context.beginPath();
        context.moveTo(this.worldCoords[0].x, this.worldCoords[0].y);
        for (var i=1; i < this.worldCoords.length; i++) {
            context.lineTo(this.worldCoords[i].x, this.worldCoords[i].y);
        }
        context.lineTo(context.canvas.width, context.canvas.height);
        context.lineTo(0, context.canvas.height);
        context.closePath();
        context.clip();
        //draw background images
        context.translate(this.offsetForeground, 0);
        context.drawImage(this.imgForeground.getImage(), 0, 0);
        context.drawImage(this.imgForegroundNext.getImage(), this.imgForeground.w, 0);
    context.restore();
    
    if (this.colorPickup) { this.colorPickup.render(context); }
    
    //particle emitter stuff
    //character projectiles
    this.timeSinceLastParticle += timeSinceLastFrame;
    if(this.char.projectiles.length !=0 && this.timeSinceLastParticle >= 1000/this.char.projectiles[0].rate){
        for(var i = 0; i < this.char.projectiles.length; i++){
            this.char.projectiles[i].makeParticle();
        };
        this.timeSinceLastParticle = 0;
    };
    this.char.projectiles.forEach(function(each){
        each.run();
    });
    
    //character shield particles
    if(this.char.shields.length !=0 && this.timeSinceLastParticle >= 1000/this.char.shields[0].rate){
        for(var i = 0; i < this.char.shields.length; i++){
            this.char.shields[i].makeParticle();
        };
        this.timeSinceLastParticle = 0;
    };
    this.char.shields.forEach(function(each){
        each.run();
    });
    
    //remove character particles as they go off screen
    for(var i = this.char.projectiles.length-1; i >= 0; i--){
        if(this.char.projectiles[i].position[0] >= window.getWidth() + 500){
            this.char.projectiles.splice(i, 1);
        };
    };
    
    // character
    this.char.render(context, this.r, this.g, this.b);
    this.enemies.render(context);
    
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
    this.speed = this.speed + t * 0.001;
    
    if (this.char.falling)
        this.char.jumpV = this.char.jumpV - (t*this.gravity/1000);
    
    //find what we're translating by
    var dX = -this.speed * t * 0.001,
        dY = 0;
    if (this.char.falling) {
        dY = this.char.jumpV;
    }
    else if (this.char.climbBy) {
        dY = -this.char.climbBy;
    }

    
    // translate world according to speed / falling speed
    for (var i = 0; i < this.worldCoords.length; i++) {
        // x
        this.worldCoords[i].x += dX;
        // y
        this.worldCoords[i].y += dY;
    }
    // translate colorPickup
    if (this.colorPickup) {
        this.colorPickup.x += dX;
        this.colorPickup.y += dY;
    }
    //translate enemies
    this.enemies.translate(dX, dY);
};

Engine.prototype.updateWorld = function() {
    // get rid of old coords
    if (this.worldCoords[1].x < 0) {
        this.worldCoords.splice(0,1);
    }
    if (this.colorPickup && this.colorPickup.x < -this.colorPickup.radius) {
        this.colorPickup = null;
    }
    // add a new world chunk if needed
    var lastCoord = this.worldCoords[this.worldCoords.length - 1];
    if (lastCoord.x < getWidth()) {
        var newChunk = this.cG.generateChunk(lastCoord, this.r, this.g, this.b, this.distance, this.speed, this.gravity);
        for (var i=0; i < newChunk.length; i++)
            this.worldCoords.push(newChunk[i]);   
    }
    // generate a colour Pickup maybe
    if (!this.colorPickup && Math.random()*10000 + 4000 < this.timeSinceLastColor) {
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
    // generate an enemy maybe
    if (Math.random()*6000 < this.timeSinceLastEnemy) {
        this.enemies.spawn( this.context.canvas.width + 10, 
                            this.context.canvas.height * 0.25,
                            this.generator);
        this.timeSinceLastEnemy = 0;
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
        if (this.worldCoords[i].x < this.char.x) leftPt = this.worldCoords[i];
        
        if (this.worldCoords[i].x > this.char.x) {
            rightPt = this.worldCoords[i];
            break;
        }
    }
    
    if(!rightPt) return;
    // determine how far away the char is from the line, and whether falling or climbing
    var slope = (rightPt.y - leftPt.y) / (rightPt.x - leftPt.x);
    var dx = this.char.x - leftPt.x;
    var d = t*this.gravity / 1000; // how far the char would fall with gravity on this frame;
    var distFromLine = (slope*dx + leftPt.y) - (this.char.y + 50);
    
    if (rightPt.damage && leftPt.damage && distFromLine < 5) {
        //this.falling = null;
        if (this.timeSinceLastDamage > 1000) {
            this.char.hp --;
            this.timeSinceLastDamage = 0;
        }
    } 
    if ( distFromLine > d && !this.char.falling) {
        //console.log("Char needs to fall now");
        this.char.falling = true;
        this.char.jumpV = 0;
        this.char.climbBy = null;
    } else if ((slope*dx + leftPt.y) > this.char.y + 50) {
        this.char.climbBy = (slope*dx + leftPt.y) - this.char.y - 50;;
        this.falling = null;
    } else if((slope*dx + leftPt.y) < this.char.y + 50) {
        this.char.climbBy = (slope*dx + leftPt.y) - this.char.y - 50;
        this.char.falling = null;
    } else {
        this.char.falling = false;
        this.char.climbBy = null;
    }  
};

Engine.prototype.drawUI = function(context) {
    context.font = "30px Arial";
    context.fillStyle = "#000";
    context.textAlign = "left";
    context.fillText(Math.round(this.distance) + "m", 300, 40);
    
    context.rect(40, 18, 255, 15);
    context.rect(40, 38, 255, 15);
    context.rect(40, 58, 255, 15);
    context.strokeStyle = "#aaa";
    context.lineWidth = 1;
    context.stroke();
    
    context.font = "14px Arial";
    context.fillStyle = "red";
    context.textAlign = "right";
    context.fillText(Math.round(this.r), 30, 30);
    
    context.fillRect(40, 18, Math.round(this.r), 15);
    
    context.fillStyle = "green";
    context.fillText(Math.round(this.g), 30, 50);
    context.fillRect(40, 38, Math.round(this.g), 15);
    
    context.fillStyle = "blue";
    context.fillText(Math.round(this.b), 30, 70);
    context.fillRect(40, 58, Math.round(this.b), 15);
    
    context.setLineDash([5]);
    context.strokeStyle = "#555";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(240, 10);
    context.lineTo(240, 110);
    context.stroke();
    context.setLineDash([0]);
    
    for (var i=0; i < this.char.hp; i++) {
        this.drawHeart(context, [getWidth() - 25 - (45*i), 20]);
    }
};

Engine.prototype.drawHeart = function(context, startPoint) {
    context.save();
        context.translate(startPoint[0], startPoint[1]);
        context.moveTo(0, 0);
        context.beginPath();
        context.lineTo(10, -10);
        context.lineTo(20, 0);
        context.lineTo(0, 20);
        context.lineTo(-20, 0);
        context.lineTo(-10, -10);
        context.lineTo(0, 0);
        context.closePath();
        context.fillStyle = "red";
        context.fill();
        context.stroke();
    context.restore();
}

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