var p5Score = function(p) {

    let level   = 1,
        score   = 0, step,
        portals = 0;

    let boxHeight = 28;

    p.setup = function() {

        p.createCanvas(400, 100);
        p.updateStep();

    }

    p.draw = function() {

        p.background(255);
        p.showScore();
        
    }

    /************************** Display ************************/

    p.showNextLevelBar = function() {

        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();

        let barX = 80,  barY = 43,
            barW = 100, barH = 15;
        p.rect(barX, barY, barW, barH);

        let progX = p.map(score, 0, step, 0, barW);
        p.noStroke();
        p.fill(0,255,0);
        p.rect(barX + 1, barY + 1, progX, barH - 2);

    }

    p.showScore = function() {

        p.noStroke();
        p.fill(0);
        p.textSize(15);
        p.textAlign(p.CENTER, p.CENTER);

        // Labels
        let labels = ["Level", "Next", "Portals"],
            cpt    = 0;
        for (var l of labels)
            p.text(l, 10, 10 + (boxHeight * cpt++), 60, boxHeight);
        
        // Values
        p.textSize(20);
        p.text(level,  65, 10, 50, boxHeight);
        p.showNextLevelBar();
        p.fill(p.color("#5014c8"));
        p.stroke(0);
        p.strokeWeight(1);
        for (let i = 0; i < portals; i++)
            p.rect(80 + i * 25, 70, 20, 20);

    }

    /******************** Getters / Setters ********************/
    
    p.getLevel   = function() { return level;   }
    p.getScore   = function() { return score;   }
    p.getStep    = function() { return step;    }
    p.getPortals = function() { return portals; }
    
    /************************** Update *************************/

    p.updateStep = function() { step = p.pow(3, level) / level; }

    p.nextLevel = function() { 
        level++;
        if ((level % 5) == 0)
            portals++;
        score = 0;
        p.updateStep();
    }

    p.addScore  = function(s) { score   += s; if (score   < 0) score   = 0; }
    p.addPortal = function(p) { portals += p; if (portals < 0) portals = 0; }

}