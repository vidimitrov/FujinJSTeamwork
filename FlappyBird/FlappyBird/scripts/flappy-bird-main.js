/// <reference path="jquery.js" />
/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage,
    ninjaPosition = 0,
    stageWidth = 400,
    stageHeight = 500,
    gameSpeed = 3,
    ninjaStartPosX = 25,
    ninjaStartPosY = 150,
    ninjaHeight,
    ninjaWidth,
    currentState,
    ninja, //ninja 
    obstacles = [], //pipes
    grass,
    ninjaImage,
    groundLevel = 70,
    groundLayer,
    groundImageObj,
    backgroundLevel = 120,
    backgroundImageObj,
    backgroundX = 0,
    backgroundY = 0,
    ninjaLayer,
    obstaclesLayer,
    currentScore = 0,
    highScore,
    gravity = 0,
    playerJumpAcceleration = 5,
    gameStates = {
        InGame: 1,
        Menu: 2,
        Pause: 3,
        GameOver: 4
    },
    gapHeight,
    frames = 1,
    totalObstacleHeight,
    minObstacleHeight = 15,
    animation;

    function loadHighScore() {
        if (localStorage['score']) {
            highScore = parseInt(localStorage['score']);
        }
        else {
            highScore = 0;
        }
    }
    function updateHighScore() {
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage['score'] = highScore;
        }
    }

    function updateNinja() {
        ninja.update();
        ninja.img.setY(ninja.y); //refactor

        //Attempt to animate ninja!!!
        ninjaPosition += 0.5;
        switch (ninjaPosition) {
            //case 1:
            //case 2: 
            case 3:
                ninjaImage.src = 'imgs/ninja1.png';
                break;
                //case 4:
                //case 5: 
            case 6:
                ninjaImage.src = 'imgs/ninja2.png';
                break;
                //case 7:
                //case 8:
            case 9:
                ninjaImage.src = 'imgs/ninja3.png';
                break;
                //case 10:
                //case 11:
            case 12:
                ninjaImage.src = 'imgs/ninja4.png';
                break;
                //case 13:
                //case 14:
            case 16:
                ninjaImage.src = 'imgs/ninja5.png';
                break;
                //case 16:
                //case 17:
            case 18:
                ninjaImage.src = 'imgs/ninja6.png';
                break;
            default:
                if (ninjaPosition > 18)
                    ninjaPosition = 0;
                break;
        }
    }

    function updateBackground() {
        background.update();
        backgroundLayer.setX(background.x);
    }

    function updateGround() {
        grass.update();
        groundLayer.setX(grass.x);
    }

    function updateObstacles() {
        for (var i = 0, len = obstacles.length; i < len; i++) {
            var currentObstacle = obstacles[i];
            currentObstacle.update();
            currentObstacle.img.setX(currentObstacle.x);

            if (currentObstacle.x + currentObstacle.width < 0) {
                obstacles.splice(i, 1);
                i--;
                len--;
            }

            //scores when the rightmost part of the ninja reaches the middle of the obstacle
            if (i % 2 === 0 && (currentObstacle.x + currentObstacle.width / 2) - (gameSpeed / 2) <= ninja.x + ninja.width && (currentObstacle.x + currentObstacle.width / 2) + (gameSpeed / 2) >= ninja.x + ninja.width) {
                currentScore++;
                console.log('score: ' + currentScore);
            }
        }

        frames++;

        if (frames === gameSpeed * 30) { //TODO animation frame speed // magic number here!!!

            var currentObstacles = generateObstacles(totalObstacleHeight, gapHeight, minObstacleHeight);
            for (i = 0; i < currentObstacles.length; i++) {
                obstacles.push(currentObstacles[i]);
            }

            obstaclesLayer.add(currentObstacles[0].img);
            obstaclesLayer.add(currentObstacles[1].img);
            stage.add(obstaclesLayer);
            obstaclesLayer.setZIndex(1);
            obstaclesLayer.draw();
            //obstaclesLayer.moveToBottom();
            frames = 1;
        }
    }

    //single update function
    function update() {
        updateBackground();
        updateObstacles();
        updateGround();
        updateNinja();

        if (hasCrashed(ninja) && currentState === gameStates.InGame) {
            currentState = gameStates.GameOver;
            animation.stop();
            playCrashSound();
        }

        if (currentState === gameStates.GameOver) {
            updateHighScore();
            console.log('high score '+ highScore);
            //implement functionality

        }

    }

    function hasCrashed(ninja) {
        if (ninja.y + ninja.height >= stageHeight - groundLevel) {
            return true;
        }

        for (var i = 0; i < obstacles.length; i++) {

            var currentObstacle = obstacles[i];
            // console.log('ninja x: ' + ninja.x + ' y: ' + ninja.y + ' width: ' + ninja.width + ' height: ' + ninja.height);
            var ninjaLeftPoint = ninja.x,
                ninjaRightPoint = ninja.x + (ninja.width * 0.6),
                ninjaTopPoint = ninja.y + (ninja.y * 0.2),
                ninjaBottom = ninja.y + ninja.height;

            if (ninjaLeftPoint >= currentObstacle.x && ninjaLeftPoint <= currentObstacle.x + currentObstacle.width || ninjaRightPoint >= currentObstacle.x && ninjaRightPoint <= currentObstacle.x + currentObstacle.width) {

                if (ninjaTopPoint >= currentObstacle.y && ninjaTopPoint <= currentObstacle.y + currentObstacle.height || ninjaBottom >= currentObstacle.y && ninjaBottom <= currentObstacle.y + currentObstacle.height) {
                    return true;
                }
            }
        }

        return false;
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
        var obstacleImage = new Image();
        obstacleImage.src = 'imgs/obstacle.gif';

        topObstacle = new Obstacle(stage.width(), 0, 70, topObstacleHeight, obstacleImage);
        bottomObstacle = new Obstacle(stage.width(), topObstacleHeight + gapHeight, 70, bottomObstacleHeight, obstacleImage);
        bottomObstacle

        currentObstacles.push(topObstacle);
        currentObstacles.push(bottomObstacle);

        return currentObstacles;
    }

    function togglePause() {
        if (currentState === gameStates.InGame) {
            currentState = gameStates.Pause;
            animation.stop();
            $('.during-play-audio')[0].pause();
        } else if (currentState === gameStates.Pause) {
            currentState = gameStates.InGame;
            animation.start();
            $('.during-play-audio')[0].play();
        }
    }

    function initializeKineticObjects() {
        // Defining Stage
        stage = new Kinetic.Stage({
            container: 'container',
            width: stageWidth,
            height: stageHeight,
        });

        // defining obsticle sizes
        gapHeight = ninjaHeight * 2.5;
        totalObstacleHeight = stage.height() - groundLevel - gapHeight;

        // Defining Layers
        backgroundLayer = new Kinetic.Layer();
        groundLayer = new Kinetic.Layer();
        obstaclesLayer = new Kinetic.Layer();
        ninjaLayer = new Kinetic.Layer();

        // Defining Images
        backgroundImageObj = new Image();
        groundImageObj = new Image();
        ninjaImage = new Image();

        // initiating Objects       
        background = new Background(backgroundX, backgroundY, 'imgs/background.png', stageWidth * 2.3, stageHeight * 0.9);
        grass = new Grass(0, stageHeight - (groundLevel * 2.2), 'imgs/grass.png', stageWidth * 2, groundLevel * 2.2, gameSpeed);
        ninja = new Ninja(ninjaStartPosX, ninjaStartPosY, ninjaImage, ninjaWidth, ninjaHeight, playerJumpAcceleration);

        // Drawing Layers
        backgroundImageObj.onload = function () {
            var backgroundImg = new Kinetic.Image({
                image: backgroundImageObj,
                x: background.x,
                y: background.y,
                width: background.width,
                height: background.height
            });

            backgroundLayer.add(backgroundImg);
            stage.add(backgroundLayer);
            backgroundLayer.setZIndex(0);
        };

        backgroundImageObj.src = background.imgSrc;

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
        };

        groundImageObj.src = grass.imgSrc;
        ninjaLayer.add(ninja.img);
        stage.add(ninjaLayer);
    }

    function Ninja(x, y, img, width, height, jumpAcceleration) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.jumpSize = jumpAcceleration,
        this.rotationAngle = 30,
        this.img = new Kinetic.Image({
            x: this.x,
            y: this.y,
            image: img,
            width: width,
            height: height,
            //fill: 'pink'
        }).rotateDeg(this.rotationAngle);

        this.jump = function () {
            gravity = -this.jumpSize;
        };

        this.update = function () {
            if (this.y + this.height + groundLevel < stage.height()) {
                this.y += gravity;
                gravity += 0.2;
            }

            if (this.y < 0) {
                this.y = 0;
            }
        };
    }

    function Background(x, y, imageSource, width, height) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.imgSrc = imageSource;

        this.update = function () {
            if (this.x <= (-stageWidth)) {
                this.x = -1;
            }
            this.x -= 0.1;
        };
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
                this.x = -1;
            }
            this.x -= this.speed;
        };
    }

    function Obstacle(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        console.log(image.height);
        this.img = new Kinetic.Image({
            x: this.x,
            y: this.y,
            image: image,
            width: this.width,
            height: this.height,
            fill: 'yellow',
            crop: {
                x: 300,
                y: image.height - this.height * 2,
                width: 100,
                height: this.height * 2
            }

        });

        this.update = function () {
            this.x -= gameSpeed; // magic number here
        };
    }


    function playCrashSound() {
        $('.during-play-audio')[0].pause();

        $('.crash-audio')[0].play();
        setTimeout(function () {
            $('.crash-audio')[0].pause();
        }, 550);
    }

    function initializeSound() {
        //add mouse click sound panel
        var MouseClickAudio = $('<audio type="audio/mpeg"></audio>').addClass('mouse-click-audio').attr('src', 'sounds/mouse_click.mp3');
        $('body').append(MouseClickAudio);

        //add crush sound panel
        var crushAudio = $('<audio type="audio/mpeg"></audio>').addClass('crash-audio').attr('src', 'sounds/crash.mp3');
        $('body').append(crushAudio);

        //add duringplay panel
        var duringPlayAudio = $('<audio type="audio/mpeg"></audio>').addClass('during-play-audio').attr('src', 'sounds/during_play.mp3');
        duringPlayAudio.attr('loop', 'loop');
        $('body').append(duringPlayAudio);

        $('.during-play-audio')[0].play();

        $(document).on('click', function () {
            if (currentState === gameStates.InGame) {
                $('.mouse-click-audio')[0].play();
            }
        });
    }

    function startGame() {
        loadHighScore();
        currentState = gameStates.InGame;
        ninjaHeight = ninjaWidth = (stageHeight / 8);

        initializeKineticObjects();
        initializeSound();

        animation = new Kinetic.Animation(update, stage); //set time
        animation.start();

        //attach events
        $(document).on('click', function () {
            if (currentState === gameStates.InGame) {
                ninja.jump();
            }
        });
        //pause event 
        $(document).on('keydown', function (ev) {
            if (ev.keyCode === 80) {
                togglePause();
            }
        });
    }

    startGame();
};