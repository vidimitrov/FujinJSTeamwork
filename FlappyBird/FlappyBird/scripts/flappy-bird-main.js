/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage,
    stageWidth = 400,
    stageHeight = 500,
    gameSpeed,
    currentState,
    ninja, //ninja 
    obstacles = [], //pipes
    groundLevel = 70,
    groundLayer,
    ninjaLayer,
    obstaclesLayer,
    currentScore,
    highScore,
    gravity = 1,
    playerJumpAcceleration = 100,
    gameStates = {
        InGame: 1,
        HighScores: 2,
        Pause: 3,
        GameOver: 4,
    },
    gapHeight,
    frames = 1,
    totalObstacleHeight,
    minObstacleHeight = 15;

    initalize(stageWidth, stageHeight);

    function Ninja(x, y, img, width, height, jumpAcceleration) {
        this.x = x,
        this.y = y,
        this.jumpSize = jumpAcceleration,
        this.rotationAngle = 60,
        this.img = new Kinetic.Image({
            x: this.x,
            y: this.y,
            image: img,
            width: width,
            height: height
        }).rotateDeg(this.rotationAngle);

        this.jump = function () {
            this.y -= this.jumpSize;
            if (this.y < 0) {
                this.y = 0;
            }
        }
        this.update = function () {

            if (this.y + this.img.height() + groundLevel < stage.height()) {
                this.y += gravity;
            }
        }
    }

    var ninjaAnimation = new Kinetic.Animation(update, ninjaLayer); //set time
    ninjaAnimation.start();

    var obstacleAnimation = new Kinetic.Animation(updateObstacles, obstaclesLayer);
    obstacleAnimation.start();


    function initalize(width, height) {

        stage = new Kinetic.Stage({
            container: 'container',
            width: width,
            height: height,
        });

        ninjaLayer = new Kinetic.Layer();
        obstaclesLayer = new Kinetic.Layer();
        groundLayer = new Kinetic.Layer();

        var ninjaImage = new Image();
        ninjaImage.src = 'imgs/ninja.png';
        ninja = new Ninja(75, 150, ninjaImage, 100, 100, playerJumpAcceleration);
        ninjaLayer.add(ninja.img);
        stage.add(ninjaLayer);
        gapHeight = ninja.img.height() * 1.5;
        totalObstacleHeight = stage.height() - groundLevel - gapHeight;


        var groundImage = new Image();
        groundImage.src = 'imgs/ninja.png';

        var grassKinetic = new Kinetic.Image({
            x: 100,
            y: 100,
            image: ninjaImage,
            width: 100,
            height: 100
        });

       
        groundLayer.add(grassKinetic);
        stage.add(groundLayer);
        document.addEventListener('click', function () {
            ninja.jump();
        });
    }

    function update() {
        //obstacle update
        ninja.update();
        ninja.img.setY(ninja.y); //refactor
    }

    function updateObstacles() {

        for (var i = 0, len = obstacles.length; i < len; i++) {
            obstacles[i].update();
            obstacles[i].img.setX(obstacles[i].x);      //TODO remove obstacles
        }
        frames++;
        if (frames === 100) { //TODO animation frame speed

            var currentObstacles = generateObstacles(totalObstacleHeight, gapHeight, minObstacleHeight);
            for (i = 0; i < currentObstacles.length; i++) {
                obstacles.push(currentObstacles[i]);
            }
            obstaclesLayer.add(currentObstacles[0].img);
            obstaclesLayer.add(currentObstacles[1].img);
            stage.add(obstaclesLayer);
            frames = 1;
        }
    }


    function generateObstacles(totalObstacleHeight, gapHeight, minObstacleHeight) { // should work properly now
        var topObstacleHeight,
            bottomObstacleHeight,
            currentObstacles = [],
            bottomObstacle,
            topObstacle;

        topObstacleHeight = (totalObstacleHeight) * Math.random() | 0;

        if (topObstacleHeight < minObstacleHeight) {
            topObstacleHeight = minObstacleHeight;
        }
        else if (topObstacleHeight > topObstacleHeight - minObstacleHeight) {
            topObstacleHeight = topObstacleHeight - minObstacleHeight;
        }

        bottomObstacleHeight = totalObstacleHeight - topObstacleHeight;

        topObstacle = new Obstacle(stage.width(), 0, 100, topObstacleHeight);
        bottomObstacle = new Obstacle(stage.width(), topObstacleHeight + gapHeight, 100, bottomObstacleHeight);

        currentObstacles.push(topObstacle);
        currentObstacles.push(bottomObstacle);

        return currentObstacles;
    }

    function Obstacle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Kinetic.Rect({ //TODO add Image
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: 'yellowgreen'
        });
        this.update = function () {
            this.x -= 5;
        }
    }

}