/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage,
    gameSpeed,
    currentState,
    ninja, //ninja 
    obstacles = [], //pipes
    backgroundLayer,
    ninjaLayer,
    obstaclesLayer,
    currentScore,
    highScore,
    gravity,
    playerJumpAcceleration,
    gameStates = {
        InGame: 1,
        HighScores: 2,
        Pause: 3,
        GameOver: 4,
    };

    initalize(400, 500);

    function Ninja(x, y) {
        this.x = x,
        this.y = y,
        this.jumpLength = 60,
        this.img = new Kinetic.Rect({
            x: this.x,
            y: this.y,
            width: 50,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        })
        this.jump = function () {
            this.y -= this.jumpLength;
            if (this.y  < 0) {
                this.y = 0;
            }

        }
        this.update = function () {

            if (this.y + this.img.height() < stage.height()) {
                this.y += 3;
            }

        }
    }

    var ninjaAnimation = new Kinetic.Animation(update, ninjaLayer);
    ninjaAnimation.start();
    document.addEventListener('click', function () {
        ninja.jump();
    });

    function initalize(width, height) {

        stage = new Kinetic.Stage({
            container: 'container',
            width: width,
            height: height,
        });

        ninjaLayer = new Kinetic.Layer();
        backgroundLayer = new Kinetic.Layer();

        ninja = new Ninja(75, 150);
        ninjaLayer.add(ninja.img);
        stage.add(ninjaLayer);
    }

    function update() {
        //obstacle update
        ninja.update();
        ninja.img.setY(ninja.y);

    }
}