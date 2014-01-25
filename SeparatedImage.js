function SeparatedImage(w, h)
{
    //final composite image
    this.imgComp = document.createElement('canvas');
    this.ctxComp = this.imgComp.getContext('2d');
    
    //black and white image
    this.imgBW = document.createElement('canvas');
    //this.ctxBW = imgMain.getContext('2d');
    
    //canvas to blend on
    this.imgBlend = document.createElement('canvas');
    this.ctxBlend = this.imgBlend.getContext('2d');
    
    //separate components
    this.imgR = document.createElement('canvas');
    this.imgG = document.createElement('canvas');
    this.imgB = document.createElement('canvas');  
    
    //set sizes
    this.w = this.imgComp.width = this.imgBlend.width = this.imgR.width = this.imgG.width = this.imgB.width = this.imgBW.width =  w;
    this.h = this.imgComp.height = this.imgBlend.height = this.imgR.height = this.imgG.height = this.imgB.height = this.imgBW.height = h;
}

//passes back the drawing context for the requested canvas
//possible values are r, g, b, and bw
SeparatedImage.prototype.getCTX = function(color)
{
    switch(color)
    {
        case 'r':
            return this.imgR.getContext('2d');
        case 'g':
            return this.imgG.getContext('2d');
        case 'b':
            return this.imgB.getContext('2d');
        case 'bw':
            return this.imgBW.getContext('2d');
    }
}

//blends its r, g, and b components to the given percentages
//pass in values from 0 to 1
SeparatedImage.prototype.blend = function(r, g, b)
{
    //draw black and white to composite
    this.ctxComp.save();
    this.ctxComp.drawImage(this.imgBW, 0, 0, this.w, this.h);
    
    //blend r, g, b values
    this.ctxBlend.save();
    this.ctxBlend.clearRect(0, 0, this.imgBlend.width, this.imgBlend.height);
    
    this.ctxBlend.globalCompositeOperation = 'screen';
    this.ctxBlend.globalAlpha = r;
    this.ctxBlend.drawImage(this.imgR, 0, 0, this.w, this.h);
    this.ctxBlend.globalAlpha = g;
    this.ctxBlend.drawImage(this.imgG, 0, 0, this.w, this.h);
    this.ctxBlend.globalAlpha = b;
    this.ctxBlend.drawImage(this.imgB, 0, 0, this.w, this.h);
    this.ctxBlend.restore();
    
    //blend onto composite image
    this.ctxComp.globalCompositeOperation = 'color';
    this.ctxComp.drawImage(this.imgBlend, 0, 0, this.w, this.h);
    this.ctxComp.restore();
}

SeparatedImage.prototype.getImage = function()
{
    return this.imgComp;
}