/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage, 
    gameSpeed,
    currentState,
    currentPlayer, //ninja 
    obstacles = [], //pipes
    background,
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

    Initalize(400, 500);    

    function Initalize(width, height) {

        stage = new Kinetic.Stage({ 
            container: 'container',
            width: width,
            height: height
        });
        var ninjaLayer = new Kinetic.Layer();
        stage.add(ninjaLayer);        
    }

}