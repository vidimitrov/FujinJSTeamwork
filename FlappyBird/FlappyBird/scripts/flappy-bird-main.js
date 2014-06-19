/// <reference path="raphael-min.js" />
/// <reference path="jquery.js" />
/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var STAGE,
    ninjaPosition = 0,
    STAGE_WIDTH = 400,
    STAGE_HEIGHT = 500,
    GAME_SPEED = 3,
    NINJA_START_POS_X = 25,
    NINJA_START_POS_y = 150,
    GRAVITY = 0,
    PLAYER_JUMP_ACCELERATION = 6,
    GAME_STATES = {
        InGame: 1,
        Menu: 2,
        Pause: 3,
        GameOver: 4
    },
    MIN_OBSTACLE_HEIGHT = 15,
    BACKGROUND_X = 0,
    BACKGROUND_Y = 0,
    GROUND_LEVEL = 70,
    ninjaHeight,
    ninjaWidth,
    currentState,
    ninja,
    obstacles = [],
    rockGround,
    ninjaImage,
    groundLayer,
    groundImageObj,
    background,
    backgroundLayer,
    backgroundImageObj,
    ninjaLayer,
    obstaclesLayer,
    currentScore,
    highScore,
    gapHeight,
    frames,
    totalObstacleHeight,
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
        ninja.img.setY(ninja.y);

        //animate ninja!!!
        ninjaPosition += 0.5;
        switch (ninjaPosition) {
            case 3:
                ninjaImage.src = 'imgs/ninja1.png';
                break;
            case 6:
                ninjaImage.src = 'imgs/ninja2.png';
                break;
            case 9:
                ninjaImage.src = 'imgs/ninja3.png';
                break;
            case 12:
                ninjaImage.src = 'imgs/ninja4.png';
                break;
            case 15:
                ninjaImage.src = 'imgs/ninja5.png';
                break;
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
            var obstacleMiddle = (currentObstacle.x + currentObstacle.width / 2),
                ninjaRightmostPoint = ninja.x + ninja.width;

            //scores when the rightmost part of the ninja reaches the middle of the obstacle
            if (i % 2 === 0 && obstacleMiddle - (GAME_SPEED / 2) <= ninjaRightmostPoint
                && obstacleMiddle + (GAME_SPEED / 2) >= ninjaRightmostPoint) {
                currentScore += 1;
                currentResult.setText(currentScore);
            }
        }
        frames++;
        //obstacle generation
        if (frames === GAME_SPEED * 30) {

            var currentObstacles = generateObstacles(totalObstacleHeight, gapHeight, MIN_OBSTACLE_HEIGHT);
            for (i = 0; i < currentObstacles.length; i++) {
                obstacles.push(currentObstacles[i]);
            }

            obstaclesLayer.add(currentObstacles[0].img);
            obstaclesLayer.add(currentObstacles[1].img);
            STAGE.add(obstaclesLayer);
            obstaclesLayer.setZIndex(1);
            frames = 1;
        }
    }

    //single update function
    function update() {
        if (currentState === GAME_STATES.Menu) {
            startMenuLayer.add(playTextRect);
            startMenuLayer.add(playText);
            STAGE.add(startMenuLayer);
        }
        else {
            updateBackground();
            updateObstacles();
            updateGround();
            updateNinja();

            if (hasCrashed(ninja) && currentState === GAME_STATES.InGame) {
                currentState = GAME_STATES.GameOver;
                animation.stop();
                playCrashSound();
            }

            if (currentState === GAME_STATES.GameOver) {
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

                playText = new Kinetic.Text({
                    x: 145,
                    y: 190,
                    text: 'Reset',
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
                    fill: '#ddd',
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
                });

                playText.on('mouseout', function () {
                    this.stroke('blue');
                    playText.setFontStyle('normal');
                    playText.setFontSize(20);
                    playTextRect.setStroke('#555');
                });

                playText.on('click', function () {
                    
                    currentScore = 0;
                    currentResult.setText(currentScore);
                    STAGE.clear();
                    obstacles = [];
                    startGame();
                    currentState = GAME_STATES.InGame;
                    startMenuLayer.remove(playTextRect);
                    startMenuLayer.remove(playText);
                });

                scoresLayer.add(maxscoreRect);
                scoresLayer.add(playTextRect);
                scoresLayer.add(playText);
                scoresLayer.add(maxScore);
            }
        }
    }

    function hasCrashed(ninja) {
        if (ninja.y + ninja.height >= STAGE_HEIGHT - GROUND_LEVEL) {
            return true;
        }

        for (var i = 0; i < obstacles.length; i++) {

            var currentObstacle = obstacles[i];
            var ninjaLeftPoint = ninja.x,
                ninjaRightPoint = ninja.x + (ninja.width * 0.7),
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

        if (topObstacleHeight < MIN_OBSTACLE_HEIGHT) {
            topObstacleHeight = MIN_OBSTACLE_HEIGHT;
        }
        else if (topObstacleHeight > topObstacleHeight - MIN_OBSTACLE_HEIGHT) {
            topObstacleHeight = topObstacleHeight - MIN_OBSTACLE_HEIGHT;
        }

        bottomObstacleHeight = STAGE_HEIGHT - (gapHeight + topObstacleHeight);

        topObstacle = new Obstacle(STAGE.width(), 0, 70, topObstacleHeight);
        bottomObstacle = new Obstacle(STAGE.width(), topObstacleHeight + gapHeight, 70, bottomObstacleHeight);

        currentObstacles.push(topObstacle);
        currentObstacles.push(bottomObstacle);

        return currentObstacles;
    }

    function togglePause() {
        if (currentState === GAME_STATES.InGame) {
            currentState = GAME_STATES.Pause;
            animation.stop();
            $('.during-play-audio')[0].pause();
        } else if (currentState === GAME_STATES.Pause) {
            currentState = GAME_STATES.InGame;
            animation.start();
            $('.during-play-audio')[0].play();
        }
    }

    function initializeKineticObjects() {
        // Defining Stage
        STAGE = new Kinetic.Stage({
            container: 'container',
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
        });

        // defining obsticle sizes
        gapHeight = ninjaHeight * 2.5;
        totalObstacleHeight = STAGE.height() - GROUND_LEVEL - gapHeight;

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
        background = new Background(BACKGROUND_X, BACKGROUND_Y, 'imgs/cave_background.jpg', STAGE_WIDTH * 2.3, STAGE_HEIGHT);
        rockGround = new RockGround(0, STAGE_HEIGHT - (GROUND_LEVEL * 1.5), 'imgs/double_rock_ground.png', STAGE_WIDTH * 2, GROUND_LEVEL * 1.5, GAME_SPEED);
        ninja = new Ninja(NINJA_START_POS_X, NINJA_START_POS_y, ninjaImage, ninjaWidth, ninjaHeight, PLAYER_JUMP_ACCELERATION);

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
            STAGE.add(backgroundLayer);
            backgroundLayer.setZIndex(0);
        };

        // bottom layer
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
            STAGE.add(groundLayer);
        };

        groundImageObj.src = rockGround.imgSrc;
        ninjaLayer.add(ninja.img);
        STAGE.add(ninjaLayer);

        currentResult = new Kinetic.Text({
            x: STAGE.width() / 2,
            y: 15,
            text: currentScore,
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'white'
        });

        currentResult.offsetX(currentResult.width() / 2);
        scoresLayer.add(currentResult);
        STAGE.add(scoresLayer);
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
            GRAVITY = -this.jumpSize;
        };

        this.update = function () {
            if (this.y + this.height + GROUND_LEVEL < STAGE.height()) {
                this.y += GRAVITY;
                GRAVITY += 0.3;
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
            if (this.x <= (-STAGE_WIDTH)) {
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
            if (this.x <= (-STAGE_WIDTH)) {
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
            this.x -= GAME_SPEED;
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
        var buttonClickAudio = $('<audio type="audio/mpeg"></audio>').addClass('button-click-audio').attr('src', 'sounds/button-clicked.wav');
        $('body').append(buttonClickAudio);

        var buttonHoverAudio = $('<audio type="audio/mpeg"></audio>').addClass('button-hover-audio').attr('src', 'sounds/button-hover.wav');
        $('body').append(buttonHoverAudio);

        //add mouse click sound panel
        var MouseClickAudio = $('<audio type="audio/mpeg"></audio>').addClass('mouse-click-audio').attr('src', 'sounds/mouse_click.wav');
        $('body').append(MouseClickAudio);

        var agonyAudio = $('<audio type="audio/mpeg"></audio>').addClass('agony-audio').attr('src', 'sounds/agony.wav');
        $('body').append(agonyAudio);

        //add crush sound panel
        var crushAudio = $('<audio type="audio/mpeg"></audio>').addClass('crash-audio').attr('src', 'sounds/crash.wav');
        $('body').append(crushAudio);

        //add duringplay panel
        var duringPlayAudio = $('<audio type="audio/mpeg"></audio>').addClass('during-play-audio').attr('src', 'sounds/during_play.wav');
        duringPlayAudio.attr('loop', 'loop');
        $('body').append(duringPlayAudio);

        $(document).on('click', function () {
            if (currentState === GAME_STATES.InGame) {
                $('.mouse-click-audio')[0].play();
            }
        });
    }

    function initializeSvgObjects() {
        var paper = Raphael('svg', STAGE_WIDTH, STAGE_HEIGHT);

        var playButton = paper.rect(150, 200, 100, 60, 10),
            playButtonText = paper.text(200, 230, 'Play'),
            logoImage = paper.image('imgs/flappy_ninja_logo.gif', 80, 100, 240, 71);
        playButton.attr({
            stroke: '#555',
            'stroke-width': 5,
            fill: '#ddd',
        });
        playButtonText.attr({
            'font-size': 21,
            'font-family': 'Calibri',
            stroke: '#555',
            fill: '#ddd',
        });

        var playButtonSet = paper.set().push(playButton, playButtonText);
        playButtonSet.mouseover(function () {
            playButtonSet.attr({
                stroke: '#00FA9A',
                'font-style': 'italic',
                'font-size': 23,
            });
            $('.button-hover-audio')[0].play();
        });
        playButtonSet.mouseout(function () {
            playButtonSet.attr({
                stroke: '#555',
                'font-style': 'normal',
                'font-size': 21,
            })
        });
        playButtonSet.click(function () {
            currentState = GAME_STATES.InGame;
            paper.remove();
            $('.button-click-audio')[0].play();
            $('.during-play-audio')[0].play();
            animation.start();
        })

    }
    function startGame() {

        loadHighScore();
        currentScore = 0;
        frames = 0;
        currentState = GAME_STATES.Menu;
        ninjaHeight = ninjaWidth = (STAGE_HEIGHT / 8);

        initializeSvgObjects();
        initializeKineticObjects();
        initializeSound();

        animation = new Kinetic.Animation(update, STAGE);

        $(document).on('click', function () {
            if (currentState === GAME_STATES.InGame) {
                ninja.jump();
            }
            if (currentState === GAME_STATES.GameOver) {
             
            }
        });
        //pause event 
        $(document).on('keydown', function (ev) {
            if (ev.keyCode === 80) {
                togglePause();
                STAGE.clear();
            }
        });
    }
    startGame();
};