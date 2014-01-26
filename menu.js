var gameName,
    charName;

window.onload = function(){
    animate();
    
    window.addEventListener('keyup',function(e){
        if (e.keyCode == 13) {
            loadNext();
        }
        else
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
    if($("#textbox").hasClass("title")){
        gameName = $("#textbox").val();
        $("#textbox").val("Now our hero needs a name");
        $("#textbox").removeClass("title");
        $("#textbox").addClass("name");
        $("#textbox").select();
        switchEntry();
    }else if($("#textbox").hasClass("name")){
        charName = $("#textbox").val();
        
        //PASS gameName and charName to the game
        //------------------------
        window.location = "index.html";
    }
}

function switchEntry(){
    $("#title").empty();
    $("#title").append($("#textbox").val());
}