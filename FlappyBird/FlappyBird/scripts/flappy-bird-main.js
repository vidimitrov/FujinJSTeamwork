/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage,
    ninjaPosition = 0,
    stageWidth = 400,
    stageHeight = 500,
    gameSpeed = 1,
    ninjaStartPosX = 25,
    ninjaStartPosY = 150,
    ninjaHeight = 85,
    ninjaWidth = 85,
    currentState,
    ninja, //ninja 
    obstacles = [], //pipes
    grass,
    ninjaImage,
    groundLevel = 70,
    groundLayer,
    groundImageObj,
    ninjaLayer,
    obstaclesLayer,
    currentScore,
    highScore,
    gravity = 0,
    playerJumpAcceleration = 5,
    gameStates = {
        InGame: 1,
        HighScores: 2,
        Pause: 3,
        GameOver: 4,
    },
    gapHeight,
    frames = 1,
    totalObstacleHeight,
    minObstacleHeight = 15,
    animation;



    initalize(stageWidth, stageHeight);
    initializeSound();
    animation = new Kinetic.Animation(update, stage); //set time
    animation.start();



    function initalize(width, height) {
        currentState = gameStates.InGame;
        // Defining Stage
        stage = new Kinetic.Stage({
            container: 'container',
            width: width,
            height: height,
        });

        // defining obsticle sizes
        gapHeight = ninjaHeight * 2;
        totalObstacleHeight = stage.height() - groundLevel - gapHeight;

        // Defininf Layers
        ninjaLayer = new Kinetic.Layer();
        obstaclesLayer = new Kinetic.Layer();
        groundLayer = new Kinetic.Layer();

        // Defining Images
        ninjaImage = new Image();
        //ninjaImage.src = 'imgs/ninja.png';
        groundImageObj = new Image();

        // initiating Objects       
        ninja = new Ninja(ninjaStartPosX, ninjaStartPosY, ninjaImage, ninjaWidth, ninjaHeight, playerJumpAcceleration);
        grass = new Grass(0, stageHeight - (groundLevel * 2.2), 'imgs/grass.png', stageWidth * 2, groundLevel * 2.2, gameSpeed * 5)

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

        //events
        $(document).on('click', function () {
            ninja.jump();
        });
        //pause func 
        $(document).on('keydown', function (ev) { 
            if (ev.keyCode === 80) {
                togglePause();
            }
        });

    }
    //single update function
    function update() {

        updateObstacles();
        updateGround();
        updateNinja();

        if (hasCrashed(ninja) && currentState === gameStates.InGame) {   // Refactor
            currentState = gameStates.GameOver;
            animation.stop();
            playCrashSound();
        }

        if (currentState === gameStates.GameOver) {
            //implement functionality

        }
        if (currentState === gameStates.HighScores) {
            //implement functionality
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
            case 3: ninjaImage.src = 'imgs/ninja1.png'; break;
                //case 4:
                //case 5: 
            case 6: ninjaImage.src = 'imgs/ninja2.png'; break;
                //case 7:
                //case 8:
            case 9: ninjaImage.src = 'imgs/ninja3.png'; break;
                //case 10:
                //case 11:
            case 12: ninjaImage.src = 'imgs/ninja4.png'; break;
                //case 13:
                //case 14:
            case 16: ninjaImage.src = 'imgs/ninja5.png'; break;
                //case 16:
                //case 17:
            case 18: ninjaImage.src = 'imgs/ninja6.png'; break;
            default: if (ninjaPosition > 18) ninjaPosition = 0; break;
        }
    }

    function updateGround() {
        //ground update
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
        }

        frames++;
        if (frames === 300) { //TODO animation frame speed // magic number here!!!

            var currentObstacles = generateObstacles(totalObstacleHeight, gapHeight, minObstacleHeight);
            for (i = 0; i < currentObstacles.length; i++) {
                obstacles.push(currentObstacles[i]);
            }
            obstaclesLayer.add(currentObstacles[0].img);
            obstaclesLayer.add(currentObstacles[1].img);
            stage.add(obstaclesLayer);
            obstaclesLayer.moveToBottom();
            frames = 1;
        }
    }

    function hasCrashed(ninja) {
        if (ninja.y + ninja.height >= stageHeight - groundLevel) {
            return true;
        }

        for (var i = 0; i < obstacles.length; i++) {

            var currentObstacle = obstacles[i];
            // console.log('ninja x: ' + ninja.x + ' y: ' + ninja.y + ' width: ' + ninja.width + ' height: ' + ninja.height);

            if (ninja.x >= currentObstacle.x && ninja.x <= currentObstacle.x + currentObstacle.width || ninja.x + ninja.width >= currentObstacle.x && ninja.x + ninja.width <= currentObstacle.x + currentObstacle.width) {

                if (ninja.y >= currentObstacle.y && ninja.y <= currentObstacle.y + currentObstacle.height || ninja.y + ninja.height >= currentObstacle.y && ninja.y + ninja.height <= currentObstacle.y + currentObstacle.height) {
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

        topObstacle = new Obstacle(stage.width(), 0, 100, topObstacleHeight);
        bottomObstacle = new Obstacle(stage.width(), topObstacleHeight + gapHeight, 100, bottomObstacleHeight);

        currentObstacles.push(topObstacle);
        currentObstacles.push(bottomObstacle);

        return currentObstacles;
    }

    function togglePause() {
        if (currentState === gameStates.InGame) {
            currentState = gameStates.Pause;
            animation.stop();
            $('.during-play-audio')[0].pause();
        }
        else if (currentState === gameStates.Pause) {
            currentState = gameStates.InGame;
            animation.start();
            $('.during-play-audio')[0].play();
        }
    }

    function Ninja(x, y, img, width, height, jumpAcceleration) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.jumpSize = jumpAcceleration,
        this.rotationAngle = 0,
        this.img = new Kinetic.Image({
            x: this.x,
            y: this.y,
            image: img,
            width: width,
            height: height,
            fill: 'pink'
        }).rotateDeg(this.rotationAngle);

        this.jump = function () {
            if (gravity > 0) {
                console.log(gravity);
                gravity -= this.jumpSize;
            }
            else {
                gravity = -this.jumpSize;
                console.log('gravity minimum')
            }


            if (this.y < 0) {
                this.y = 0;
            }
        }
        this.update = function () {

            if (this.y + this.img.height() + groundLevel < stage.height()) {
                this.y += gravity;
                gravity += 0.1;
            }
        }
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
            this.x -= gameSpeed * 3; // magic number here
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
                this.x = -1;
            }
            this.x -= this.speed;
        }
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
        })
    }
}