function Generator()
{
    this.perlin = new ClassicalNoise();
}

//generates a new character object with randomy generated sprites
//size -> character sprite width and height (must be no less than 10)
//enemy (optional) -> boolean of type, defaults to character
//hue (optional) -> value from 0 - 360 to define color of character
Generator.prototype.generateCharacter = function(size, enemy, hue)
{
    if( typeof(hue) == 'undefined' ) 
        hue = Math.random() * 360;
    else
        hue = Math.min( 360, Math.max( 0, hue ) );
    if( typeof(enemy) == 'undefined' ) enemy = false;
    
    //create charater
    var char = new Character(size, size);
    
    //create three levels of canvas
    var imgBack = document.createElement('canvas'),
        imgMain = document.createElement('canvas'),
        imgFront = document.createElement('canvas');
    var ctxBack = imgBack.getContext('2d'),
        ctxMain = imgMain.getContext('2d'),
        ctxFront = imgFront.getContext('2d');
    
    //set image sizes
    imgBack.width = imgMain.width = imgFront.width = size;
    imgBack.height = imgMain.height = imgFront.height = size;
    
    //set colors for all layers
    ctxBack.fillStyle = "hsl(" + hue + ", 90%, 40%)";
    ctxBack.strokeStyle = "hsl(" + hue + ", 90%, 60%)";
    ctxMain.fillStyle = "hsl(" + hue + ", 90%, 50%)";
    ctxMain.strokeStyle = "hsl(" + hue + ", 90%, 30%)"; 
    ctxFront.fillStyle = "hsl(" + hue + ", 90%, 60%)";
    ctxFront.strokeStyle = "hsl(" + hue + ", 90%, 20%)";
    
    /////////////////////////
    // generate main image //
    /////////////////////////
    
    var numPoints = Math.floor(5 + Math.random() * 25);
    var dA = Math.twoPI / numPoints,
        maxDist = size * 0.5,
        dist, x, y;
    
    ctxMain.beginPath();
    for(var i = 0; i < numPoints; ++i)
    {
        dist = 0.25 * maxDist + Math.random() * 0.75 * maxDist;
        x = size * 0.5 + Math.cos(-Math.PI + dA * i) * dist;
        y = size * 0.5 + Math.sin(-Math.PI + dA * i) * dist;
        if(i == 0)
            ctxMain.moveTo(x, y);
        else
            ctxMain.lineTo(x, y);
    }
    ctxMain.closePath();
    ctxMain.fill();
    ctxMain.stroke();
    
    //eyes
    ctxMain.fillStyle = 'white';
    
    var rad1 = size * 0.06 + Math.random() * size * 0.06,
        rad2 = size * 0.06 + Math.random() * size * 0.06,
        pos1X = size * 0.5 + Math.random() * size * 0.125,
        pos1Y = size * 0.25 + Math.random() * size * 0.125,
        pos2X = size * 0.75 + Math.random() * size * 0.125,
        pos2Y = size * 0.25 + Math.random() * size * 0.125,
        start1 = 0,
        end1 = Math.twoPI,
        start2 = 0,
        end2 = Math.twoPI;
    
    if(enemy)
    {
        pos1X = size - pos1X;
        pos2X = size - pos2X;
        start1 = -Math.PI * 0.5 + Math.random() * Math.PI * 0.25;
        end1 = -Math.PI + Math.random() * Math.PI * 0.25;
        start2 = -Math.PI * 0.25 + Math.random() * Math.PI * 0.25;
        end2 = -Math.PI * 0.75 + Math.random() * Math.PI * 0.25;
    }
    
    ctxMain.beginPath();
    ctxMain.arc( pos1X, pos1Y, rad1, start1, end1, false);
    ctxMain.closePath();
    ctxMain.fill();
    ctxMain.stroke();
    
    ctxMain.beginPath();
    ctxMain.arc( pos2X, pos2Y, rad2, start2, end2, false);
    ctxMain.closePath();
    ctxMain.fill();
    ctxMain.stroke();
    
    //pupils
    ctxMain.fillStyle = 'black';
    ctxMain.beginPath();
    
    ctxMain.arc(pos1X - rad1 * 0.25 + Math.random() * rad1 * 0.5, 
                pos1Y - rad1 * 0.25 + Math.random() * rad1 * 0.5, 
                rad1 * 0.125 + Math.random() * rad1 * 0.125, 
                0, 
                Math.twoPI, 
                false);
    ctxMain.arc(pos2X - rad2 * 0.25 + Math.random() * rad2 * 0.5, 
                pos2Y - rad2 * 0.25 + Math.random() * rad2 * 0.5, 
                rad2 * 0.125 + Math.random() * rad2 * 0.125, 
                0, 
                Math.twoPI, 
                false);
    ctxMain.fill();
    
    /////////////////////////
    // generate back image //
    /////////////////////////
    
    var handSize = size * 0.125 + Math.random() * size * 0.125;
    numPoints = Math.floor(5 + Math.random() * 10);
    dA = Math.twoPI / numPoints;
    maxDist = handSize * 0.5;
    
    var oX = size * 0.125,
        oY = size * 0.5;
    
    if(enemy)
        oX = size - oX;
    
    ctxMain.beginPath();
    for(var i = 0; i < numPoints; ++i)
    {
        dist = 0.5 * maxDist + Math.random() * 0.5 * maxDist;
        x = oX + Math.cos(-Math.PI + dA * i) * dist;
        y = oY + Math.sin(-Math.PI + dA * i) * dist;
        if(i == 0)
            ctxBack.moveTo(x, y);
        else
            ctxBack.lineTo(x, y);
    }
    ctxBack.closePath();
    ctxBack.fill();
    ctxBack.stroke();
    
    //////////////////////////
    // generate front image //
    //////////////////////////
    
    var handSize = size * 0.125 + Math.random() * size * 0.125;
    numPoints = Math.floor(5 + Math.random() * 10);
    dA = Math.twoPI / numPoints;
    maxDist = handSize * 0.5;
    
    var oX = size - size * 0.125,
        oY = size * 0.5;
    
    if(enemy)
        oX = size - oX;
    
    ctxMain.beginPath();
    for(var i = 0; i < numPoints; ++i)
    {
        dist = 0.5 * maxDist + Math.random() * 0.5 * maxDist;
        x = oX + Math.cos(-Math.PI + dA * i) * dist;
        y = oY + Math.sin(-Math.PI + dA * i) * dist;
        if(i == 0)
            ctxFront.moveTo(x, y);
        else
            ctxFront.lineTo(x, y);
    }
    ctxFront.closePath();
    ctxFront.fill();
    ctxFront.stroke();
    
    //set images on character
    char.imgBack = imgBack;
    char.imgMain = imgMain;
    char.imgFront = imgFront;
    
    return char;
}

//generates and returns a seperated image using perlin noise
//w -> width
//h -> height
//blockSize -> number of screen pixels per color block
//widthOffset (optional) -> use to offset noise x values by factor of width
//noise detail (optional) -> smaller is smoother noise
Generator.prototype.generateBackground = function (w, h, blockSize, widthOffset, noiseDetail)
{
    if( typeof(noiseDetail) == 'undefined' ) noiseDetail = 0.05;
    if( typeof(widthOffset) == 'undefined' ) widthOffset = 0;
    img = new SeparatedImage(w, h);
    
    //get drawing contexts for each image
    var ctxBW = img.getCTX('bw'),
        ctxR = img.getCTX('r'),
        ctxG = img.getCTX('g'),
        ctxB = img.getCTX('b');
        
    
    //create empty image data for images
    var dataBW = ctxBW.createImageData( w, h ),
        dataR = ctxR.createImageData( w, h ),
        dataG = ctxG.createImageData( w, h ),
        dataB = ctxB.createImageData( w, h );
    
    //fill image datas with noise
    var pixel, byte, r, g, b;
    for(var pY = 0; pY < h; pY += blockSize)
    {
        for(var pX = 0; pX < w; pX += blockSize)
        {
            r = 150 + 75 * this.getNoise( (widthOffset * w + pX) * noiseDetail, pY * noiseDetail );
            g = 100 + 75 * this.getNoise( (1000 + widthOffset * w + pX) * noiseDetail, pY * noiseDetail );
            b = 150 + 75 * this.getNoise( (2000 + widthOffset * w + pX) * noiseDetail, pY * noiseDetail );
            
            //do pixelsize x pixelsize
            for(var oY = 0; oY < blockSize; oY++)
            {
                for(var oX = 0; oX < blockSize; oX++)
                {
                    var nX = Math.min( pX + oX, w - 1 );
                    var nY = Math.min( pY + oY, h -1 );
                    
                    pixel = nY * w + nX;
                    byte = pixel * 4;
                    
                    dataR.data[byte]     = r;
                    dataG.data[byte+1]   = g;
                    dataB.data[byte+2]   = b;
                    
                    //greyscale
                    dataBW.data[byte] = dataBW.data[byte + 1] = dataBW.data[byte + 2] = (r+g+b)/3;
                    
                    //alpha
                    dataBW.data[byte+3]  = dataR.data[byte+3]   = dataG.data[byte+3] = dataB.data[byte+3] = 255;

                }
            }
        }
    }
    
    //set images
    ctxBW.putImageData(dataBW, 0, 0);
    ctxR.putImageData(dataR, 0, 0);
    ctxG.putImageData(dataG, 0, 0);
    ctxB.putImageData(dataB, 0, 0);
    
    //return separated image
    img.blend(1, 1, 1);
    return img;
}

//to access perlin noise generator
// y and z are optional
Generator.prototype.getNoise = function(x, y, z)
{
    if(typeof(x) != 'undefined')
    {
        if(typeof(y) != 'undefined')
        {
            if(typeof(z) != 'undefined')
            {
                return this.perlin.noise(x, y, z);
            }
            return this.perlin.noise(x, y, 0);
        }
        return this.perlin.noise(x, 0, 0);
    }
}

