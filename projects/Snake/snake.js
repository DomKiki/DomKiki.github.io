class Snake {

    constructor(pos, dir) {

        this.body = [];
        this.body.push(pos);
        this.dir  = dir;

    }

    update(w,h) {
        
        let head = this.getHead();
        this.body.shift();
        head.add(this.dir);
        head.x = (head.x + w) % w;
        head.y = (head.y + h) % h;
        this.body.push(head);
    }

    warp(pos) {
        this.body.shift();
        this.body.push(pos.copy());
    }
    
    show(p) {
        p.fill(0, 102, 0);      
        for (var b of this.body)
            p.rect(b.x, b.y, 1, 1);
    }

    touches(obj) { 
        let head = this.getHead();
        return ((head.x == obj.x) && (head.y == obj.y)); 
    }

    touchesWall(wall) {
        let head = this.getHead();
        return ((head.x >= wall.pos.x) && (head.x < (wall.pos.x + wall.size.x)) 
             && (head.y >= wall.pos.y) && (head.y < (wall.pos.y + wall.size.y)));
    }

    eat(obj, growth=true) {
        for (var i = 0; i < obj.length; i++)
            if (this.touches(obj[i].pos)) {
                if (growth) this.grow();
                else        this.shrink();
                return i;
            }
        return -1;
    }

    grow() {
        this.body.push(this.getHead());
        this.len++;
    }

    shrink() { if (this.body.length > 1) this.body.shift(); }

    gameOver(walls) {
        let head = this.getHead();
        // Head can't touch the walls
        var cpt = 0;
        for (var wall of walls)
            if (this.touchesWall(wall))
                return true;
        // Head can't touch the tail
        for (var i = 0; i < (this.body.length - 1); i++)
            if (this.touches(this.body[i]))
                return true;
        return false;
    }

    /******************** Getters / Setters ********************/

    getHead() { return this.body[this.body.length - 1].copy(); }

    setDirection(d) { this.dir = d; }

}