//w (optional) -> the width of the character
//h (optional) -> the height of the character
var Character = function(w, h, hue) {
    this.y = getHeight() /2;
    this.x = 100;
    
    this.hp = 5;
    
    if(typeof(w) == 'undefined') 
        this.w = 100;
    else 
        this.w = w;
    if(typeof(h) == 'undefined') 
        this.h = 100;
    else 
        this.h = h;
    
    this.hue = hue;
    
    this.jumpV = 1;
    this.falling = null;
    this.climbBy = null;
    
    //for images
    this.imgBack = null;
    this.imgMain = null;
    this.imgFront = null;
    
    //for animationd
    this.offsetBack = 0.5;
    this.offsetFront = 0.5;
    this.offsetMain = 0.5;
    this.seed = Math.random() * 10000;
    
    //for attack and defense
    this.isDefending = false;
    this.projectiles = [];
    this.shields = [];
    
    this.hit = false;
    this.swing = false;
    this.swingCount = 0;
    this.opacity = 1;
};

Character.prototype.jump = function() {
    var d = new Date();
    this.falling = true;
    this.jumpV = 25;
};

Character.prototype.attack = function(context) {
    if(this.projectiles.length < 5){
        this.projectiles.push(new particleEmitter(context, "rect",[this.x,this.y], [25,0], [5,5], "#F00", [4,4], 20, 5));
    }
};

Character.prototype.update = function(totalMS, generator, enemies, context)
{
    this.offsetBack = generator.getNoise( totalMS / 2000 );
    this.offsetFront = generator.getNoise( (totalMS + 50000) / 2100 );
    this.offsetMain = generator.getNoise( (totalMS + 50000) / 2100 );
    
    if(this.isDefending && this.shields.length < 5)
    {
        this.shields.push(new particleEmitter(context, "ellipse", [this.x,this.y], [0,0], [5,5], "#00F", [80,80], 20, 5));
    }
    
    //check for collisions with enemies
    if(typeof(enemies) != 'undefined')
    {
        //check projectile collisions
        for(var i = this.projectiles.length - 1; i >= 0 ; --i)
        {
            if(enemies.checkProjectile(this.projectiles[i].position[0], this.projectiles[i].position[1]))
            {
                this.projectiles.splice(i, 1);
                //score += 1000000;
            }
        }
        //check my collision
        if( enemies.checkProjectile(this.x + this.w * 0.5, this.y))
        {
            if(this.shields.length == 0)
                this.takeDamage(1);
        }
    }
}
Character.prototype.animateOpacity = function(){
    if(this.opacity > 0){
        this.opacity -= 0.1;
    } else {
        this.opacity = 1;
        this.hit = false;
    }
};

Character.prototype.takeDamage = function(damage){
    this.hp -= damage;
    this.hit = true;
};

// ?
Character.prototype.render = function(context) {
    if(this.hit)
        this.animateOpacity();
    
    context.save();
    context.translate(this.x - this.w * 0.5, this.y - this.h * 0.5 - this.h * 0.2 * this.offsetMain);
    if(this.imgBack != null)
    {
        context.save();
        context.globalAlpha = this.opacity;
        context.drawImage(this.imgBack, 0, this.h * 0.1 + this.h * 0.5 * this.offsetBack);
        context.restore();
    }
    if(this.imgMain != null)
    {
        context.save();
        context.globalAlpha = this.opacity;
        context.drawImage(this.imgMain, 0, 0);
        context.restore();
    }
    else
    {
        //default draw
        context.beginPath();
        context.arc(this.x, this.y - this.h * 0.5, this.w * 0.5, 0, Math.twoPI, false);
        context.fillStyle = '#75F';
        context.fill();
    }    
    if(this.imgFront != null)
    {
        context.save();
        context.globalAlpha = this.opacity;
        context.drawImage(this.imgFront, 0, this.h * 0.25 + this.h * 0.25 * this.offsetFront);
        context.restore();
    }
    
    context.restore();
};
