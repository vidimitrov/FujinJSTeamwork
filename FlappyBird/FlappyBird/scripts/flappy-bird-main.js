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
    minPipeHeight,
    maxPipeHeight,
    gapHeight,
    frames = 1;

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

        minPipeHeight = stage.height() / 4;
        maxPipeHeight = stage.height() * 3 / 4;
        gapHeight = ninja.img.height() * 2;


        // Ground
        groundLayer = new Kinetic.Layer();

        var groundImageObj = new Image();
        groundImageObj.onload = function () {
            var grassImg = new Kinetic.Image({
                image: groundImageObj,
                x: 0,
                y: stageHeight - groundLevel,
                width: stageWidth,
                height: groundLevel

            });
            groundLayer.add(grassImg);
            stage.add(groundLayer);
        }
        groundImageObj.src = 'imgs/grass.png';

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
            //if (obstacles[i].x + obstacles[i].width < 0) {
            //    obstacles = obstacles.splice(i, 0);
            //    i--;
            //    len--;
            //}
        }
        frames++;
        console.log(obstacles.length)
        if (frames === 100) { //TODO animation frame speed


            var currentObstacles = generateObstacles(maxPipeHeight, minPipeHeight, gapHeight);
            for (i = 0; i < currentObstacles.length; i++) {
                obstacles.push(currentObstacles[i]);
            }
            obstaclesLayer.add(currentObstacles[0].img);
            obstaclesLayer.add(currentObstacles[1].img);
            console.log(obstaclesLayer);
            stage.add(obstaclesLayer);
            frames = 1;
        }
    }


    function generateObstacles(maxPipeHeight, minPipeHeight, gapHeight) {
        var obstacleHeight = Math.max(minPipeHeight, (Math.random() * maxPipeHeight)) | 0, //TODO new formula
            currentObstacles = [],
            bottomObstacle,
            topObstacle,
            bottomObstacleHeight;

        topObstacle = new Obstacle(stage.width(), 0, 100, obstacleHeight);
        bottomObstacleHeight = stage.height() - topObstacle.height - gapHeight - groundLevel; //TODO formula
        bottomObstacle = new Obstacle(stage.width(), topObstacle.height + gapHeight, 100, bottomObstacleHeight);

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
            tension: 3,
            width: this.width,
            height: this.height,
            fill: 'yellowgreen'
        });
        this.update = function () {
            this.x -= 5;
        }
    }

}