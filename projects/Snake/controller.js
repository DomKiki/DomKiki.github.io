/******************************* Canvas *******************************/
var score = new p5(p5Score, 'scoreCanvas');
var game  = new p5(p5Game,  'gameCanvas');

function addScore() {

    // Adding points
    score.addScore(score.getLevel());
    // Next level
    if (score.getScore() >= score.getStep()) {
        // Variables
        score.nextLevel();
        game.addFrameRate(1);
        // More elements
        game.addFood();
        game.addPoison();
        game.addWall();
    }

}

function subScore() { score.addScore(-score.getLevel()); }

function subPortal() { score.addPortal(-1); }

function availablePortals() { return score.getPortals(); }