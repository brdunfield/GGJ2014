function GroundPoly(isPlatform, startPt, width)
{
    this.upper = this.u = [];
    this.lower = this.l = [];
    
    if(isPlatform)
    {
        this.isPlatform = true;
        this.isClosed = true;
        this.upper.push(startPt);
        this.upper.push(point(startPt.x + width, startPt.y, false));
        this.lower.push(point(startPt.x, startPt.y + 50, false));
        this.lower.push(point(startPt.x + width, startPt.y + 50, false));
        
        this.lastUpper = this.upper[this.upper.length -1];
        this.lastLower = this.lower[this.lower.length -1];
    }
    else
    {
        if (!startPt) {
            this.lastUpper = point(getWidth() - 100, getHeight() * 0.5, false);
            this.lastLower = point(getWidth() - 100, getHeight()*2, false);
            
            this.upper.push(point(0, getHeight() * 0.5, false));
            this.upper.push(point(getWidth() - 100, getHeight()*0.5, false))
                            
            this.lower.push(point(0, getHeight() * 0.5, false));
            this.lower.push(point(getWidth(), getHeight()*2, false));
        }
    }
    
    this.isPlatform = isPlatform;
}

GroundPoly.prototype.extend = function(cG, dist, speed, gravity)
{
    if(this.isPlatform)
    {
        return null;
    }
    else
    {
        var newChunk = cG.generateChunk(this.lastUpper, 0, 0, 0, dist, speed, gravity);
        for (var i =0; i < newChunk.upper.length; i++) {
            this.upper.push(newChunk.upper[i]);
        }
        for (var j =0; j < newChunk.lower.length; j++) {
            this.lower.push(newChunk.lower[j]);
        }
        this.lastUpper = newChunk.upper[newChunk.upper.length-1];
        this.lastLower = newChunk.lower[newChunk.lower.length-1];;
        
        if (newChunk.platform) {
            return newChunk.platform;
        }
        return null;
    }
}
            
function point(x, y, damage)
{
    return {
        x: x,
        y: y,
        damage: damage};
}