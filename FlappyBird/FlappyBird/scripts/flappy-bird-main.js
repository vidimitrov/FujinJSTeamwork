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
    rockGround,
    ninjaImage,
    groundLevel = 70,
    groundLayer,
    groundImageObj,
    background,
    backgroundLayer,
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
    scoresLayer,
    startMenuLayer,
    currentResult,
    maxscoreRect,
    maxScore,
    animation,
    playTextRect,
    playText;

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
            case 15:
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
        rockGround.update();
        groundLayer.setX(rockGround.x);
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
                currentScore += 1;
                currentResult.setText(currentScore);
                scoresLayer.draw();
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
        if(currentState === gameStates.Menu){
            startMenuLayer.add(playTextRect);
            startMenuLayer.add(playText);
            stage.add(startMenuLayer);
        } else {
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
                console.log('high score ' + highScore);

                maxScore = new Kinetic.Text({
                    x: 0,
                    y: 60,
                    text: 'SCORES: ' + currentScore + '\n\nHIGH SCORES:' + highScore,
                    fontSize: 18,
                    fontFamily: 'Calibri',
                    fill: '#555',
                    width: 380,
                    padding: 20,
                    align: 'center'
                });

                maxscoreRect = new Kinetic.Rect({
                    x: 90,
                    y: 60,
                    stroke: '#555',
                    strokeWidth: 5,
                    fill: '#ddd',
                    width: 200,
                    height: maxScore.height(),
                    shadowColor: 'black',
                    shadowBlur: 10,
                    shadowOffset: { x: 10, y: 10 },
                    shadowOpacity: 0.2,
                    cornerRadius: 10
                });

                scoresLayer.add(maxscoreRect);
                scoresLayer.add(maxScore);
                //implement functionality

            }
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

        bottomObstacleHeight = stageHeight - (gapHeight + topObstacleHeight);

        topObstacle = new Obstacle(stage.width(), 0, 70, topObstacleHeight);
        bottomObstacle = new Obstacle(stage.width(), topObstacleHeight + gapHeight, 70, bottomObstacleHeight);
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
        scoresLayer = new Kinetic.Layer();
        startMenuLayer = new Kinetic.Layer();

        // Defining Images
        backgroundImageObj = new Image();
        groundImageObj = new Image();
        ninjaImage = new Image();

        // initiating Objects       
        background = new Background(backgroundX, backgroundY, 'imgs/cave_background.jpg', stageWidth * 2.3, stageHeight);
        rockGround = new RockGround(0, stageHeight - (groundLevel * 1.5), 'imgs/double_rock_ground.png', stageWidth * 2, groundLevel * 1.5, gameSpeed);
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
            var rockGroundImg = new Kinetic.Image({
                image: groundImageObj,
                x: rockGround.x,
                y: rockGround.y,
                width: rockGround.width,
                height: rockGround.height
            });

            groundLayer.add(rockGroundImg);
            stage.add(groundLayer);
        };

        groundImageObj.src = rockGround.imgSrc;
        ninjaLayer.add(ninja.img);
        stage.add(ninjaLayer);

        //scores layer below!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        currentResult = new Kinetic.Text({
            x: stage.width() / 2,
            y: 15,
            text: currentScore,
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'white'
        });

        currentResult.offsetX(currentResult.width() / 2);

        scoresLayer.add(currentResult);
        stage.add(scoresLayer);
        
        playText = new Kinetic.Text({
            x: 145,
            y: 190,
            text: 'Play',
            fontSize: 21,
            fontFamily: 'Calibri',
            stroke: '#0C5EC5',
            fill: '#555',
            width: 110,
            padding: 30,
            align: 'center'
        });

        playTextRect = new Kinetic.Rect({
            x: 150,
            y: 200,
            stroke: '#555',
            strokeWidth: 5,
            fill: 'rgba(0, 0, 0, 0.8)',
            width: 100,
            height: 60,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 10, y: 10 },
            shadowOpacity: 0.2,
            cornerRadius: 10
        });

        playText.on('mouseover', function () {
            this.stroke('#00FA9A');
            playText.setFontStyle('italic');
            playText.setFontSize(23);
            playTextRect.setStroke('#00FA9A');
            playTextRect.setShadowColor('cyan');
            $('.button-hover-audio')[0].play();
        });

        playText.on('mouseout', function () {
            this.stroke('blue');
            playText.setFontStyle('normal');
            playText.setFontSize(20);
            playTextRect.setStroke('#555');
            playTextRect.setShadowColor('black');
        });

        playText.on('click', function () {
            currentState = gameStates.InGame;
            startMenuLayer.remove(playTextRect);
            startMenuLayer.remove(playText);
            $('.button-click-audio')[0].play();
            $('.during-play-audio')[0].play();
        });

        var logo = new Image();

        logo.onload = function () {
            var logoImg = new Kinetic.Image({
                image: logo,
                x: 80,
                y: 100,
                width: 240,
                height: 71
            });

            startMenuLayer.add(logoImg);
        };

        logo.src = 'imgs/flappy_ninja_logo.gif';
        
        stage.add(startMenuLayer);
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

    function RockGround(x, y, imageSource, width, height, speed) {
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

    function Obstacle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        //rect
        this.img = new Kinetic.Rect({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fillLinearGradientStartPoint: { x: -50, y: -50 },
            fillLinearGradientEndPoint: { x: 100, y: 100 },
            fillLinearGradientColorStops: [0, 'white', 1, 'black'],
            stroke: 'grey',
            cornerRadius: 5,
            opacity: 0.75
        });

        this.update = function () {
            this.x -= gameSpeed; // magic number here
        };
    }


    function playCrashSound() {
        $('.during-play-audio')[0].pause();

        $('.crash-audio')[0].play();
         $('.agony-audio')[0].play();
        setTimeout(function () {
            $('.crash-audio')[0].pause();
        }, 550);
    }

    function initializeSound() {
        var buttonClickAudio = $('<audio type="audio/mpeg"></audio>').addClass('button-click-audio').attr('src', 'sounds/button-clicked.mp3');
        $('body').append(buttonClickAudio);

        var buttonHoverAudio = $('<audio type="audio/mpeg"></audio>').addClass('button-hover-audio').attr('src', 'sounds/button-hover.mp3');
        $('body').append(buttonHoverAudio);

        //add mouse click sound panel
        var MouseClickAudio = $('<audio type="audio/mpeg"></audio>').addClass('mouse-click-audio').attr('src', 'sounds/mouse_click.mp3');
        $('body').append(MouseClickAudio);        

        var agonyAudio = $('<audio type="audio/mpeg"></audio>').addClass('agony-audio').attr('src', 'sounds/agony.wav');
        $('body').append(agonyAudio);

        //add crush sound panel
        var crushAudio = $('<audio type="audio/mpeg"></audio>').addClass('crash-audio').attr('src', 'sounds/crash.mp3');
        $('body').append(crushAudio);

        //add duringplay panel
        var duringPlayAudio = $('<audio type="audio/mpeg"></audio>').addClass('during-play-audio').attr('src', 'sounds/during_play.mp3');
        duringPlayAudio.attr('loop', 'loop');
        $('body').append(duringPlayAudio);
        
        $(document).on('click', function () {
            if (currentState === gameStates.InGame) {
                $('.mouse-click-audio')[0].play();
            }
        });
    }

    function startGame() {
        loadHighScore();
        currentState = gameStates.Menu;
        ninjaHeight = ninjaWidth = (stageHeight / 8);

        initializeKineticObjects();
        initializeSound();

        animation = new Kinetic.Animation(update, stage); //set time
        animation.start();

        //attach events
        $(document).on('click', function () {
            //if(currentState === gameStates.Menu){
            //    currentState = gameStates.InGame;
            //    startMenuLayer.remove(playTextRect);
            //    startMenuLayer.remove(playText);
            //    //stage.remove(startMenuLayer);
            //}
            if (currentState === gameStates.InGame) {
                ninja.jump();
            }
            if(currentState === gameStates.GameOver){
                console.log('restarting...');
                //Reset all the variables and start the game again
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