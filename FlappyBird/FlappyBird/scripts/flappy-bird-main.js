/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage,
    stageWidth = 400,
    stageHeight =  500,
    gameSpeed,
    currentState,
    ninja, //ninja 
    obstacles = [], //pipes
    groundLayer,
    ninjaLayer,
    obstaclesLayer,
    currentScore,
    highScore,
    gravity = 4,
    playerJumpAcceleration = 100,
    gameStates = {
        InGame: 1,
        HighScores: 2,
        Pause: 3,
        GameOver: 4,
    };

    initalize(stageWidth, stageHeight);

    function Ninja(x, y, img) {
        this.x = x,
        this.y = y,
        this.jumpLength = playerJumpAcceleration, //refactor
        this.img = new Kinetic.Image({ //refactor!!
            x: 0,
            y: 0,
            image: img,
            width: 106,
            height: 118
        })
        this.jump = function () {
            this.y -= this.jumpLength;
            if (this.y < 0) {
                this.y = 0;
            }

        }
        this.update = function () {

            if (this.y + this.img.height() + 70 < stage.height()) {
                this.y += gravity;
            }
        }
    }

    var ninjaAnimation = new Kinetic.Animation(update, ninjaLayer); //set time
    ninjaAnimation.start();


    function initalize(width, height) {

        stage = new Kinetic.Stage({
            container: 'container',
            width: width,
            height: height,
        });

        ninjaLayer = new Kinetic.Layer();
        groundLayer = new Kinetic.Layer();


        var imageObj = new Image();   //refactor
        imageObj.src = 'imgs/ninja.png';
        ninja = new Ninja(75, 150, imageObj);
        ninjaLayer.add(ninja.img);
        stage.add(ninjaLayer);


        document.addEventListener('click', function () {
            ninja.jump();
        });
    }

    function update() {
        //obstacle update
        ninja.update();
        ninja.img.setY(ninja.y); //refactor

    }
}