window.onload = function(){
    animate();
    
    window.addEventListener('keyup',function(){
        var title = document.forms["textbox"]["title"].value;
        $("#title").empty();
        $("#title").append(title);
    });
    
    //get display default game name
    var title = document.forms["textbox"]["title"].value;
    $("#title").empty();
    $("#title").append(title);
    
    //generate background image
    var generator = new Generator();
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var bgImage = generator.generateBackground(canvas.width, canvas.height, 30, 0, 0.05, 50, 150);
    ctx.drawImage(bgImage.getImage(),0,0);
}

window.onresize = function(){
    var generator = new Generator();
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var bgImage = generator.generateBackground(canvas.width, canvas.height, 30, 0, 0.05, 50, 150);
    ctx.drawImage(bgImage.getImage(),0,0);
}

function animate(){
    setInterval(function(){
        if($("#cursor").css("opacity") == 0)
            $("#cursor").css("opacity", 1);
        else if($("#cursor").css("opacity") == 1)
            $("#cursor").css("opacity", 0);
    }, 500);
}