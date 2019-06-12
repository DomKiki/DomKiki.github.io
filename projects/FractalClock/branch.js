function Hand(p) {

    this.p1 = center;
    this.p2 = p;

    this.setPosition = function(p) {
        let len  = this.getDir().mag();
        let phi  = p * (TWO_PI / 60) - HALF_PI;
        this.p2  = createVector(this.p1.x + len * cos(phi), this.p1.y + len * sin(phi));
    }

    this.getDir = function() { return p5.Vector.sub(this.p2, this.p1); }

}