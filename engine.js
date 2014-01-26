Math.twoPI = Math.PI * 2;

var Engine = function(canvasID) {
    var self = this,
        canvas = document.getElementById(canvasID);
    
    canvas.width = getWidth();
    canvas.height = getHeight();
    this.context = canvas.getContext('2d');
    
    //draw loading screen//
    this.context.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.context.fillRect(0, 0, getWidth(), getHeight());
    this.context.font = "50px Arial";
    this.context.fillStyle = "#EEE";
    this.context.textAlign = "center";
    this.context.fillText("Loading...", getWidth()*0.5, getHeight()*0.5);
    
    window.requestAnimationFrame(function () {
        self.init.call(self);
    });
}
 
Engine.prototype.init = function()
{
    var self = this;
    
    //useful stuff
    this.generator = new Generator();
    
    //graphics 
    this.offsetForeground = 0;
    this.offsetBackground = 0;
    this.numScrollsForeground = 1;
    this.numScrollsBackground = 1;
    this.imgForeground = this.generator.generateBackground(canvas.width, canvas.height, 30, 0, 0.05, 50, 150);
    this.imgForegroundNext = this.generator.generateBackground(canvas.width, canvas.height, 30, 1, 0.05, 50, 150);
    this.imgBackground = this.generator.generateBackground(canvas.width, canvas.height, 10, 0, 0.05, 175, 250);
    this.imgBackgroundNext = this.generator.generateBackground(canvas.width, canvas.height, 10, 1, 0.05, 175, 250);
    this.imgSky = this.generator.generateBackground(canvas.width, canvas.height, 1, 1, 0.005, 200, 255);
    //heart image
    this.imgHeart = document.createElement('canvas');
    this.imgHeart.width = this.imgHeart.height = 45;
    
    // time
    this.startTime = 0;
    this.lastTime = 0;
    
    // physics
    this.speed = 500; // px/s
    this.gravity =  50; //px/s/s
    
    // game variables
    this.lost = false;
    this.distance = 0;
    this.char = this.generator.generateCharacter(100);
    this.enemies = new Enemies();
    
    this.timeSinceLastEnemy = 0;
    
    this.drawHeart(this.imgHeart);
    
    this.colourDecay = [2, 2, 2]; // per second
    this.r = Math.random() * 100 + 50;
    this.g = Math.random() * 100 + 50;
    this.b = Math.random() * 100 + 50;
    
    this.timeSinceLastColor = 0;
    this.timeSinceLastParticle = 0;
    this.timeSinceLastDamage = 0;
    this.timeSinceLastFork = 0;
    this.colorPickup = null;
    
    //new lines
    this.groundPolys = [];
    this.groundPolys.push( new GroundPoly( false ) );
    this.backPoly = new GroundPoly( false );
    
    this.cG = new chunkGenerator();
    // Handlers //
    // Jump handler
    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 32 /*&& self.g != 0*/) {
            if (!self.char.falling){
                //if(self.colourDecay[1] == 2) self.colourDecay[1] += 10;
                self.char.jump();
            } else if (self.char.falling && self.g > 25) {
                self.char.jump();
                self.g -= 25;
            }
        }
    });
    this.restartHandler = null;
    
    //Attack handler (F key)
    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 70 && self.r != 0) {
            if(self.colourDecay[0] == 2) self.colourDecay[0] += 5;
            self.char.attack(self.context);
        }
    });
    //Defend handler (D key)
    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 68&& self.b != 0) {
            if(self.colourDecay[2] == 2) self.colourDecay[2] += 20;
            self.char.defend(self.context);
        }
    });
    
    this.start();
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
    this.timeSinceLastFork += timeSinceLastFrame;
    
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
    if(this.colourDecay[0] > 2 && this.char.projectiles.length == 0) this.colourDecay[0] --;
    if(this.colourDecay[1] > 2 && !this.char.falling) this.colourDecay[1] --;
    if(this.colourDecay[2] > 2 && this.char.shields.length == 0) this.colourDecay[2] --;
    this.r = Math.max(0, this.r - this.colourDecay[0] * timeSinceLastFrame/1000);
    this.g = Math.max(0, this.g - this.colourDecay[1] * timeSinceLastFrame/1000);
    this.b = Math.max(0, this.b - this.colourDecay[2] * timeSinceLastFrame/1000);
    
    //update image color blending
    var r = this.r / 255,
        g = this.g / 255,
        b = this.b / 255;
    this.imgSky.blend(r, g, b);
    this.imgForeground.blend(r, g, b);
    this.imgForegroundNext.blend(r, g, b);
    this.imgBackground.blend(r, g, b);
    this.imgBackgroundNext.blend(r, g, b);
    //image positions
    this.offsetForeground -= this.speed * timeSinceLastFrame * 0.001;
    if(this.offsetForeground <= -context.canvas.width)
    {
        this.offsetForeground = 0;
        this.imgForeground = this.imgForegroundNext;
        this.imgForegroundNext = this.generator.generateBackground(this.imgForeground.w, 
                                                                   this.imgForeground.h, 
                                                                   30, 
                                                                   ++this.numScrollsForeground, 
                                                                   0.05, 50, 150);
    }
    this.offsetBackground -= this.speed * timeSinceLastFrame * 0.001 * 0.3;
    if(this.offsetBackground <= -context.canvas.width)
    {
        this.offsetBackground = 0;
        this.imgBackground = this.imgBackgroundNext;
        this.imgBackgroundNext = this.generator.generateBackground(this.imgBackground.w, 
                                                                   this.imgBackground.h, 
                                                                   10, 
                                                                   ++this.numScrollsBackground, 
                                                                   0.05, 175, 250);
    }
    
    //update character and enemies
    this.char.update(time, this.generator, this.enemies);
    this.enemies.update(time, this.generator);
    
    // Draw ~~~~~~~~~~~~~~~~~~~~~~~
    context.clearRect(0, 0, getWidth(), getHeight());
    
    //draw sky
    context.drawImage(this.imgSky.getImage(), 0, 0);
    
    // background
    context.save();
        context.beginPath();
    
        //back thorough upper
        var bp = this.backPoly;
        context.moveTo( bp.u[bp.u.length-1].x, bp.u[bp.u.length-1].y );
        for(var j = bp.u.length-1; j >= 0; --j)
        {
            context.lineTo( bp.u[j].x, bp.u[j].y );
        }
        
        //through lower
        for(var j = 0; j < bp.l.length; ++j)
        {
            context.lineTo( bp.l[j].x, bp.l[j].y );
        }

        context.closePath();
        context.clip();
        //draw background images
        context.translate(this.offsetBackground, 0);
        context.drawImage(this.imgBackground.getImage(), 0, 0);
        context.drawImage(this.imgBackgroundNext.getImage(), this.imgBackground.w, 0);
    context.restore();
    
    // foreground
    context.save();
        context.beginPath();
    
        //new
        var gp;
        for(var i = 0; i < this.groundPolys.length; i++)
        {
            gp = this.groundPolys[i];
            
            //back thorough upper
            context.moveTo( gp.u[gp.u.length-1].x, gp.u[gp.u.length-1].y );
            for(var j = gp.u.length-1; j >= 0; --j)
            {
                context.lineTo( gp.u[j].x, gp.u[j].y );
            }
            
            //through lower
            for(var j = 0; j < gp.l.length; ++j)
            {
                context.lineTo( gp.l[j].x, gp.l[j].y );
            }
            context.closePath();
        }
        context.clip();
        //draw foreground images
        context.translate(this.offsetForeground, 0);
        context.drawImage(this.imgForeground.getImage(), 0, 0);
        context.drawImage(this.imgForegroundNext.getImage(), this.imgForeground.w, 0);
    context.restore();
    
    if (this.colorPickup) { this.colorPickup.render(context); }
    
    //particle emitter stuff
    //character projectiles
    this.timeSinceLastParticle += timeSinceLastFrame;
    if(this.char.projectiles.length !=0 || this.char.shields.length != 0){
        var resettime = false;
        //do projectiles
        if(this.char.projectiles[0] != null && this.timeSinceLastParticle >= 1000/this.char.projectiles[0].rate){
            for(var i = 0; i < this.char.projectiles.length; i++){
                this.char.projectiles[i].makeParticle();
                resettime = true;
            };
        };
        this.char.projectiles.forEach(function(each){
            each.run();
        });
        //character shield particles
        if(this.char.shields[0] != null && this.timeSinceLastParticle >= 1000/this.char.shields[0].rate){
            for(var i = 0; i < this.char.shields.length; i++){
                this.char.shields[i].makeParticle();
                resettime = true;
            };
        };
        this.char.shields.forEach(function(each){
            each.run();
        });
        
        if(resettime)this.timeSinceLastParticle = 0;
    };
    
    //remove character projectiles as they go off screen
    for(var i = this.char.projectiles.length-1; i >= 0; i--){
        if(this.char.projectiles[i].position[0] >= window.getWidth() + 500){
            this.char.projectiles.splice(i, 1);
        };
    };
    //remove shieldsshields
    if(this.char.shields.length > 0){
        if(this.char.shields[0].particles.length >= this.char.shields[0].maxParticles-1){
            this.char.shields.splice(0, 1);
        }
    }

    // character
    this.char.render(context, this.r, this.g, this.b);
    this.enemies.render(context);
    
    // UI ~~~~~~~~~~~~~~~~~~~
    this.drawUI(context);
    var fps = Math.round(1000 / timeSinceLastFrame);
    context.fillText(fps, getWidth() - 100, 100);
    
    //draw end screen
    if (this.char.hp <= 0) 
    {
        context.fillStyle = "rgba(0, 0, 0, 0.8)";
        context.fillRect(0, 0, getWidth(), getHeight());
        
        context.font = "50px Arial";
        context.fillStyle = "#EEE";
        context.textAlign = "center";
        context.fillText("Game Over.", getWidth()*0.5, getHeight()*0.5);
        
        context.rect(getWidth()*0.25, getHeight()/2 + 50, getWidth() *0.5, 50);
        context.fillStyle = "hsl(" + this.char.hue + ", 90%, 60%)";
        context.fill();
        
        context.font = "18px Arial";
        context.fillStyle= "hsl(" + this.char.hue + ", 90%, 20%)";;
        context.fillText("Play Again", getWidth() *0.5, getHeight()/2 + 80);
        
        this.restartHandler = document.getElementById("canvas").addEventListener('click', function(e) {
            if (e.clientX > getWidth() *0.25 && e.clientX < getWidth() *0.75 && e.clientY > getHeight()/2 + 50 && e.clientY < getWidth()/2 + 100) {
                self = new Engine("canvas");
                self.start();
            }
        });
        return;
    }
    
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
    
    //new way
    var gp;
    for(var i = 0; i < this.groundPolys.length; ++i)
    {
        gp = this.groundPolys[i];
        
        //upper
        for(var j = 0; j < gp.u.length; j++)
        {
            gp.u[j].x += dX;
            gp.u[j].y += dY;
        }
        //lower
        for(var j = 0; j < gp.l.length; j++)
        {
            gp.l[j].x += dX;
            gp.l[j].y += dY;
        }
    }
    
    //do back polys
    var bp = this.backPoly;
    //upper
    for(var j = 0; j < bp.u.length; j++)
    {
        bp.u[j].x += dX;
        bp.u[j].y += dY;
    }
    //lower
    for(var i = 0; i < bp.l.length; i++)
    {
        bp.l[i].x += dX;
        bp.l[i].y += dY;
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
    
    // add a fork if necessary
    if (this.cG.lastChunk == "straight" && this.timeSinceLastFork > Math.random() * 5000 + 5000) {
        this.groundPolys.push(this.cG.generateFork({'x':getWidth(), 'y':getHeight()/2, 'damage':false}));
        this.timeSinceLastFork = 0;
    }
    
    //new way
    var gp;
    for(var i = (this.groundPolys.length -1); i >= 0; i--)
    {
        gp = this.groundPolys[i];
        
        //add new
        while( !gp.isClosed && gp.lastUpper.x < getWidth() )
        {
            var newPoly = gp.extend(this.cG, this.distance, this.speed, this.gravity);
            if (newPoly) {
                for (var i=0; i < newPoly.length; i++)
                    this.groundPolys.push(newPoly[i]);
            }
        }
        
        //remove old
        if (gp.u.length == 1 || gp.l[0].y < 0 || gp.u[1].y > getHeight() * 2) {
            this.groundPolys.splice(i, 1);
            continue;
        } else {
            if( gp.u[1].x < 0 )
                gp.u.splice(0, 1);
            if( gp.l[1].x < 0 )
                gp.l.splice(0, 1);
        }
        
    }

    //back polys
    var bp = this.backPoly;
    //add new
    while( bp.lastUpper.x < getWidth() )
    {
        bp.extend(this.cG, this.distance, this.speed, this.gravity);
    }
    //remove old
    if (bp.u.length == 0) {
        delete bp;
    }else {
        if( bp.u[1].x < 0 )
            bp.u.splice(0, 1);
        if( bp.l[1].x < 0 )
            bp.l.splice(0, 1);
    }
    
    if (this.colorPickup && this.colorPickup.x < -100) this.colorPickup = null;
    // generate a colour Pickup maybe
    if (!this.colorPickup && Math.random()*10000 + 4000 < this.timeSinceLastColor) {
        var typeRNG = Math.random();
        var type;
        if (typeRNG < 0.33) {
            type = "red";
        } else if (typeRNG < 0.67) {
            type = "green";
        } else { type = "blue"; }
        var x = this.context.canvas.width + 50;
        this.colorPickup = new colourPickup(type, x, this.getGroundIntersect(x) - 50);
        this.timeSinceLastColor = 0;
    }
    // generate an enemy maybe
    if (Math.random()*(12000 - this.speed*2) + 2000 - this.speed < this.timeSinceLastEnemy) {
        var x = this.context.canvas.width + 50;
        this.enemies.spawn( x, this.getGroundIntersect(x) - 50, this.generator);
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
    
    var groundHeight = this.getGroundIntersect(this.char.x, this.char.y - 50),
        dY = t * this.gravity * 0.001;
    var dist = groundHeight - this.char.y - 50;
    
    //look for damage
    if (this.getGroundDamage(this.char.x) && dist < 5) {
        if (this.timeSinceLastDamage > 1000) {
            //this.char.hp --;
            this.timeSinceLastDamage = 0;
        }
    } 
    
    if ( dist > dY ) 
    {
        if(!this.char.falling)
        {
            this.char.falling = true;
            this.char.jumpV = 0;
            this.char.climbBy = null;
        }
    } 
    else if (groundHeight > this.char.y + 50) 
    {
        this.char.climbBy = groundHeight - this.char.y - 50;
        this.char.falling = false;
    } 
    else if(groundHeight < this.char.y + 50) 
    {
        this.char.climbBy = groundHeight - this.char.y - 50;
        this.char.falling = false;
    } 
    else 
    {
        this.char.falling = false;
        this.char.climbBy = null;
    }  
};

Engine.prototype.getGroundIntersect = function(x, yThresh)
{
    if(typeof(yThresh) == 'undefined') yThresh = 0;
    
    if( x < 0 ) return this.groundPolys[0].u[0].y;
    while( x > this.groundPolys[0].lastUpper.x)
    {
        var newPoly = this.groundPolys[0].extend(this.cG, this.distance, this.speed, this.gravity);
        if (newPoly) {
            for (var i=0; i < newPoly.length; i++)
                this.groundPolys.push(newPoly[i]);
        }
    }
    
    //find points around x value
    var l = null,
        r = null,
        m, b, d,
        current = null,
        curDist = Number.MAX_VALUE;
    
    var gp;
    findloop:
    for (var i = this.groundPolys.length-1; i >= 0; --i)
    {
        gp = this.groundPolys[i];
        for(var j = 1; j < gp.u.length; j++)
        {
            if (gp.u[j].x > x && gp.u[j-1].x < x ) 
            {
                l = gp.u[j-1];
                r = gp.u[j];
                
                m = (r.y - l.y) / (r.x - l.x);  
                b = l.y - m * l.x;
                yVal = m * x + b;
                
                if(yVal > yThresh)
                {
                    d = yVal - yThresh;
                    if( d < curDist )
                    {
                        curDist = d;
                        current = yVal;
                    }
                }
            }
        }
    }
    //console.clear();
    //console.log(current);
    return current || getWidth() * 0.5;

}

Engine.prototype.getGroundDamage = function(x)
{
    if( x < 0 ) return this.groundPolys[0].u[0].y;
    while( x > this.groundPolys[0].lastUpper.x)
    {
        var newPoly = this.groundPolys[0].extend(this.cG, this.distance, this.speed, this.gravity);
        if (newPoly) {
            for (var i=0; i < newPoly.length; i++)
                this.groundPolys.push(newPoly[i]);
        }
    }
    
    //find points around x value
    var l = null,
        r = null;
    
    var gp;
    findloop:
    for (var i = this.groundPolys.length-1; i >= 0; --i)
    {
        gp = this.groundPolys[i];
        for(var j = 1; j < gp.u.length; j++)
        {
            if (gp.u[j].x > x && gp.u[j-1].x < x ) 
            {
                l = gp.u[j-1];
                r = gp.u[j];
                break findloop;
            }
        }
    }
    
    if(l == null || r == null)
    {
        return false;
    }
    else if(r.damage && l.damage)
    {
        return true;
    }
    return false
}

Engine.prototype.drawUI = function(context) {
    context.save();
    context.font = "30px Arial";
    context.fillStyle = "#000";
    context.textAlign = "left";
    context.fillText(Math.round(this.distance) + "m", 300, 40);
    
    context.beginPath();
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
    context.restore();
    
    for (var i=0; i < this.char.hp; i++) {
        context.drawImage(this.imgHeart, getWidth() - ( 55 * (i + 1)), 0);
    }
};

Engine.prototype.drawHeart = function() {
    var ctxHeart = this.imgHeart.getContext('2d');
    
    ctxHeart.translate(this.imgHeart.width * 0.5, this.imgHeart.height * 0.5);
    ctxHeart.moveTo(0, 0);
    ctxHeart.beginPath();
    ctxHeart.lineTo(10, -10);
    ctxHeart.lineTo(20, 0);
    ctxHeart.lineTo(0, 20);
    ctxHeart.lineTo(-20, 0);
    ctxHeart.lineTo(-10, -10);
    ctxHeart.lineTo(0, 0);
    ctxHeart.closePath();
    ctxHeart.fillStyle = "hsl(" + this.char.hue + ", 90%, 60%)";
    ctxHeart.strokeStyle = "hsl(" + this.char.hue + ", 90%, 30%)";
    ctxHeart.lineWidth = 2;
    ctxHeart.fill();
    ctxHeart.stroke();
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