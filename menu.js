var gameName,
    charName;

window.onload = function(){
    animate();
    
    window.addEventListener('keyup',function(){
        switchEntry();
    });
    
    //get display default game name
    switchEntry();
    
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

function loadNext(){
    var field = document.getElementById("textbox");
    if(field.classList.contains("title")){
        gameName = document.forms["textbox"]["entry"].value;
        document.forms["textbox"]["entry"].value = "Now our hero needs a name";
        $(field).removeClass("title");
        $(field).addClass("name");
        switchEntry();
    }else if(field.classList.contains("name")){
        charName = document.forms["textbox"]["entry"].value;
        
        //PASS gameName and charName to the game
        //------------------------
        window.location = "index.html";
    }
}

function switchEntry(){
    var title = document.forms["textbox"]["entry"].value;
    $("#title").empty();
    $("#title").append(title);
}