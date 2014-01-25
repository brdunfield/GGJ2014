function Enemies()
{
    this.list = [];
}

//create new enemy
//x -> x position of enemy, will default to just off screen
//y -> center y position for new enemy
//generator -> instance of generator class
Enemies.prototype.spawn = function(x, y, generator)
{
    var e = generator.generateCharacter(100, true);
    e.x = x;
    e.y = y;
    
    this.list.push(e);
}

//update all enemies
//deltaX -> world scroll amount for this step
//totalMS -> total program running time in milliseconds
//generator -> instance of generator class
Enemies.prototype.update = function(totalMS, generator)
{
    var e;
    for(var i = this.list.length-1; i >= 0; --i)
    {
        e = this.list[i];
        
        if(e.x < -e.w)
        {
            this.list.splice(i, 1);
            continue;
        }
        
        e.update(totalMS + e.seed, generator);
    }
}

//draw all enemies
//context -> pointer to draw context
Enemies.prototype.render = function(context)
{
    for(i in this.list)
    {
        this.list[i].render(context);
    }
}

Enemies.prototype.checkProjectile = function(x, y)
{
    var e;
    for(var i = this.list.length-1; i >= 0; --i)
    {
        e = this.list[i];
        
        if(e.x - e.w * 0.5 < x
           && e.x + e.w * 0.5 > x
           && e.y - e.h * 0.5 < y
           && e.y + e.h * 0.5 > y)
        {
            this.list.splice(i, 1);
        }
    }
}

//translate all enemies by given value
Enemies.prototype.translate = function(x, y)
{
    for(i in this.list)
    {
        this.list[i].x += x;
        this.list[i].y += y;
    }
}