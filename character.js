//w (optional) -> the width of the character
//h (optional) -> the height of the character
var Character = function(w, h) {
    this.y = getHeight() /2;
    this.x = 100;
    
    if(typeof(w) == 'undefined') this.w = 100;
    if(typeof(h) == 'undefined') this.h = 100;
    
    this.jumpV = 1;
    this.falling = null;
    this.climbBy = null;
    
    this.imgBack = null;
    this.imgMain = null;
    this.imgFront = null;
};

Character.prototype.jump = function() {
    var d = new Date();
    this.falling = true;
    this.jumpV = 20;
};

Character.prototype.attack = function() {
    
};

// ?
Character.prototype.render = function(context) {
    
    context.save();
    context.beginPath();
    context.arc(this.x, this.y - this.h * 0.5, this.w * 0.5, 0, Math.twoPI, false);
    context.fillStyle = '#75F';
    context.fill();
    
    
    if(this.imgBack != null)
    {
    }
    if(this.imgMain != null)
    {
    }
    if(this.imgFront != null)
    {
    }
    
    context.restore();
};
