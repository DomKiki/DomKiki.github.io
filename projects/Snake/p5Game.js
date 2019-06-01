var p5Game = function(p) {

    const COLOR_FOOD   = "#0066ff",
          COLOR_POISON = "#990000";

    var framerate = 10,
        movable   = false,
        warped    = false;

    var nbFood   = 3,
        nbPoison = 1,
        nbWalls  = 5;

    var snake,
        food    = [],
        poison  = [],
        walls   = [],
        portals = [], tmpPortal = null;
    
    var w, h, 
        res  = 10;

    /******************************** p5 **********************************/

    p.setup = function() {

        p.createCanvas(400,400);
        p.frameRate(framerate);
        p.noStroke();

        w = p.floor(p.width / res),
        h = p.floor(p.height / res);
        let pos = p.createVector(p.floor(w / 2), p.floor(h / 2));
        let dir = p.createVector(1,0);

        snake = new Snake(pos, dir);
        
        p.addElements();

    }

    p.draw = function() {

        p.background(255);
        p.scale(res);
        
        p.checkElements();
        
        // Warp if touching a portal
        if (!warped) {
            for (let pt of portals)
            for (let i = 0; i < 2; i++)
            if (snake.touches(pt[i])) {
                snake.warp(pt[(i+1) % 2]);
                warped = true;
                break;
            }
        }
        else
        warped = false;
        
        // Else just apply direction
        if (!warped)
        snake.update(w,h);
        
        // Display
        p.showElements();
        
        // Reset flags
        movable = true;
        
        if (snake.gameOver(walls)) {
            console.log("Game Over");
            p.noLoop();
        }
        
    }
    
    p.keyPressed = function(event) {
        
        // Avoid moving multiple times per frame
        if (movable) {

            let d    = p.createVector(0,0),
                s    = snake.dir,
                move = true;
            switch (p.keyCode) {

                case p.LEFT_ARROW:
                    d.x = (s.x != 1) ? -1 : s.x;
                    break;
                case p.RIGHT_ARROW:
                    d.x = (s.x != -1) ? 1 : s.x;
                    break;
                case p.UP_ARROW:
                    d.y = (s.y != 1) ? -1 : s.y;
                    break;
                case p.DOWN_ARROW:
                    d.y = (s.y != -1) ? 1 : s.y;
                    break;
                case 32:
                    if (availablePortals() > 0) {
                        p.placePortal(snake.pos);
                        move = false;
                    }
                    break;

                default:
                    return;
            }

            if (move) {
                event.preventDefault();
                snake.setDirection(d);
                movable = false;
            }
        }
    }


    /***************************** Random *****************************/

    p.randomPosition = function() { return p.createVector(p.floor(p.random(1, w-1)), p.floor(p.random(1, h-1))); }

    p.randomColor = function(arr=null) {
        if (arr == null) {
            let r = 0,
                g = 0,
                b = 0,
                c,
                dup = true;
            
            while (dup) {
                r = p.floor(p.random(255));
                g = p.floor(p.random(255));
                b = p.floor(p.random(255));
                c = p.color(r,g,b);
                dup = false;
                for (var w of walls)
                    if (p.equalColors(w.col, c)) {
                        dup = true;
                        break;
                    }
            }
            return c;
        }
        else
            return p.color(arr[p.floor(p.random(arr.length))]);
    }

    p.checkFood = function() {
        var f = snake.eat(food);
        if (f >= 0) {
            food.splice(f, 1);
            p.addFood();
            addScore();
        }
    }

    p.checkPoison = function() {
        var ps = snake.eat(poison, false);
        if (ps >= 0) {
            poison.splice(ps, 1);
            p.addPoison();
            subScore();
        }
    }

    p.checkElements = function() {
        p.checkFood();
        p.checkPoison();
    }

    /***************************** Display ********************************/

    p.showWalls = function() {
        let cpt = 0;
        for (let w of walls) { 
            p.fill(0);
            p.rect(w.pos.x, w.pos.y, w.size.x, w.size.y);
        }
    }

    p.show = function(arr) {
        for (let el of arr) {
            p.fill(el.col);
            p.rect(el.pos.x, el.pos.y, 1, 1);
        }
    }

    p.showPortals = function() {
        for (let pt of portals)
            for (let i = 0; i < pt.length - 1; i++) {
                p.fill(pt[pt.length - 1]);
                p.rect(pt[i].x, pt[i].y, 1, 1);
            }
        if (tmpPortal != null) {
            p.fill(120);
            p.rect(tmpPortal.x, tmpPortal.y, 1, 1);
        }
    }

    p.showElements = function() {
        p.show(food);
        p.show(poison);
        snake.show(p);
        p.showPortals();
        p.showWalls();
    }

    /******************************* Arrays *******************************/

    p.addFood = function() { food.push({ pos: p.randomPosition(), col: p.color(COLOR_FOOD) }); }

    p.addPoison = function() { poison.push({ pos: p.randomPosition(), col: p.color(COLOR_POISON) }); }

    p.addWall = function(s) {

        let pos  = p.randomPosition();
        let size = p.createVector(p.floor(p.random(5,s)), p.floor(p.random(1,s)));
        let col  = p.randomColor();

        let r    = p.floor(p.random(4));
        switch (r) {
            case 0:
                pos.x  = 0;
                size.x = 1;
                break;
            case 1:
                pos.y  = 0;
                size.y = 1;
                break;
            case 2:
                pos.x  = w -  1;
                size.x = 1;
                break;
            case 3:
                pos.y  = h - 1;
                size.y = 1;
                break;
        }

        walls.push({ pos, size, col }); 
    }

    p.placePortal = function(pos) {
        if (tmpPortal == null)
            tmpPortal = snake.getHead();
        else {

            // Color
            let c,
                dup = true;
            while (dup) {
                dup = false;
                c   = p.randomColor();
                for (let col of [COLOR_FOOD, COLOR_POISON])
                    if (p.equalColors(c, col)) {
                        dup = true;
                        continue;
                    }
                for (let pt of portals)
                    if (p.equalColors(c, pt[pt.length - 1])) {
                        dup = true;
                        continue;
                    }
            }

            portals.push([tmpPortal.copy(), snake.getHead(), c]);
            tmpPortal = null;
            subPortal();
        }        
    }

    p.addElements = function() {
        for (var i = 0; i < nbFood;   i++) p.addFood();
        for (var i = 0; i < nbPoison; i++) p.addPoison();
        for (var i = 0; i < nbWalls;  i++) p.addWall(20);
    }

    /******************************** Update ******************************/

    p.setFrameRate = function(f) { framerate =  f; p.frameRate(framerate); }
    p.getFrameRate = function()  { return framerate; }
    p.addFrameRate = function(f) { framerate += f; p.frameRate(framerate); }

    /******************************* Misc *********************************/

    p.equalColors = function(a,b) { return ((p.red(a)   == p.red(b)) 
                                         && (p.green(a) == p.green(b))
                                         && (p.blue(a)  == p.blue(b))); }

}