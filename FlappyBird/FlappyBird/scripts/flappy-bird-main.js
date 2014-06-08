/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage,
    stageWidth = 400,
    stageHeight = 500,
    gameSpeed = 1,
    ninjaHeight = 100,
    currentState,
    ninja, //ninja 
    obstacles = [], //pipes
    grass,
    groundLevel = 70,
    groundLayer,
    groundImageObj,
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

    var groundAnimation = new Kinetic.Animation(groundUpdate, groundLayer);
    groundAnimation.start();

    function initalize(width, height) {
        // Defining Stage
        stage = new Kinetic.Stage({
            container: 'container',
            width: width,
            height: height,
        });

        // defining obsticle sizes
        gapHeight = ninjaHeight * 2;
        var clearField = stage.height() - groundLevel;
        minPipeHeight = (clearField - gapHeight) / 4;
        maxPipeHeight = (clearField - gapHeight) * 3 / 4;

        // Defininf Layers
        ninjaLayer = new Kinetic.Layer();
        obstaclesLayer = new Kinetic.Layer();
        groundLayer = new Kinetic.Layer();

        // Defining Images
        var ninjaImage = new Image();
        ninjaImage.src = 'imgs/ninja.png';
        groundImageObj = new Image();

        // initiating Objects
        ninja = new Ninja(75, 150, ninjaImage, 100, ninjaHeight, playerJumpAcceleration);
        grass = new Grass(0, stageHeight - (groundLevel * 1.5) , 'imgs/grass.png', stageWidth * 2, groundLevel * 1.5, gameSpeed * 5)

        // Drawing Layers
        ninjaLayer.add(ninja.img);
        stage.add(ninjaLayer);

        groundImageObj.onload = function () {
            var grassImg = new Kinetic.Image({
                image: groundImageObj,
                x: grass.x,
                y: grass.y,
                width: grass.width,
                height: grass.height
            });
            groundLayer.add(grassImg);
            stage.add(groundLayer);
        }
        groundImageObj.src = grass.imgSrc;

        ////// end of drawing layers
        

        document.addEventListener('click', function () {
            ninja.jump();
        });
    }

    function groundUpdate() {
        //ground update
        grass.update();
        groundLayer.setX(grass.x);
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
            obstaclesLayer.moveToBottom();
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
            this.x -= gameSpeed * 5;
        }
    }

    function Grass(x, y, imageSource, width, height, speed) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.speed = speed,
        this.imgSrc = imageSource;


        this.update = function () {
            if (this.x <= (-stageWidth)) {
                this.x += stageWidth;
            }
            this.x -= this.speed;
        }
    }
}