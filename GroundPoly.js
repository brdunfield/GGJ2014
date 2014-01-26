function GroundPoly(isPlatform)
{
    this.upper = this.u = [];
    this.lower = this.l = [];
    
    if(isPlatform)
    {
    }
    else
    {
        this.lastUpper = point(0, getHeight() * 0.5, false);
        this.lastLower = point(0, getHeight() * 2, false);
        this.upper.push(this.lastUpper);
        this.lower.push(this.lastLower);
    }
    
    this.isPlatform = isPlatform;
}

GroundPoly.prototype.extend = function()
{
    if(this.isPlatform)
    {
        
    }
    else
    {
        this.lastUpper = point(this.lastUpper.x + 50, this.lastUpper.y + Math.random() * 100 - 50, false);
        this.lastLower = point(this.lastLower.x + 50, getHeight() * 2, false);
        this.upper.push( this.lastUpper );
        this.lower.push( this.lastLower );
        
    }
}
            
function point(x, y, damage)
{
    return {
        x: x,
        y: y,
        damage: damage};
}