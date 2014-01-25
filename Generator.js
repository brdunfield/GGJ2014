function Generator()
{
    this.perlin = new ClassicalNoise();
}

//generates and returns a seperated image using perlin noise
//w -> width
//h -> height
//blockSize -> number of screen pixels per color block
//noise detail (optional) -> smaller is smoother noise
Generator.prototype.generateBackground = function (w, h, blockSize, noiseDetail)
{
    if( typeof(noiseDetail) == 'undefined' ) noiseDetail = 0.05;
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
            r = 75 + 150 * this.perlin.noise( pX * 0.01, pY * 0.01 );
            g = 75 + 150 * this.perlin.noise( pX * 0.01 + 1000, pY * 0.01 + 1000 );
            b = 75 + 150 * this.perlin.noise( pX * 0.01 + 2000, pY * 0.01 + 2000 );
            
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

