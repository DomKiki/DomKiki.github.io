class Boid {
	
	constructor(x, y, fov=50, col=100) {
		
		this.pos = createVector(x,y);
		this.vel  = p5.Vector.random2D().setMag(random(3, 5));
		this.acc  = createVector();
		
		this.maxA = 0.1;
		this.maxV = 5;
		
		this.fov  = fov;
		this.col  = col;
		
		this.size = 12;
		
	}
	
	// Alignment  : Steering towards the average velocity*
	// Cohesion   : Steering towards the average position*
	// Separation : Steering away from the average position* with proportionally inversed magnitude
	// *in the neighbourhood (or fov)
	ACS(flock) {
				
		var ali = createVector(), 
			coh = createVector(),
			sep = createVector(),
			cpt = 0, 
			d;
			
		for (var b of flock) {
			d = b.pos.dist(this.pos);
			if ((b != null) && (d != 0) && (d <= this.fov)) {
				ali.add(b.vel);
				coh.add(b.pos);
				sep.add(p5.Vector.sub(this.pos, b.pos).div(d));
				cpt++;
			}
		}
		
		if (cpt > 0) {
			ali.div(cpt).setMag(this.maxV).sub(this.vel).limit(this.maxA);
			coh.div(cpt).sub(this.pos).setMag(this.maxV).sub(this.vel).limit(this.maxA);
			sep.div(cpt).setMag(this.maxV).sub(this.vel).limit(this.maxA);
		}
		
		// Apply all vectors to acceleration
		this.acc.add(ali.mult(sldAli.value()));
		this.acc.add(coh.mult(sldCoh.value()));
		this.acc.add(sep.mult(sldSep.value()));
		
	}
	
	avoid(obs, display=false) {
		
		// Find closest wall vertexs
		var closest = 100000;
		var closestPoint;
		var p;
		var wall;
		for (var i = 0; i < obs.length; i++) {
			p = obs[i].pointOnClosestVertex(this.pos, this.fov);
			if (typeof p !== "undefined")
				if (p.distance < closest) {
					closest      = p.distance;
					closestPoint = p.point;
				}
		}
			
		// Just like separation
		if (typeof closestPoint !== "undefined") {
			if (display) {
				strokeWeight(6);
				stroke(255,0,0);
				point(closestPoint.x, closestPoint.y);
			}
			var counter = p5.Vector.sub(this.pos, closestPoint).div(closest).div(2);
			this.acc.add(counter);
		}
		
	}
	
	// Wrap world on itself
	bound() {
		this.pos.x = (this.pos.x + width)  % width;
		this.pos.y = (this.pos.y + height) % height;
	}
	
	update() {

		// Bounded Position and Velocity
		this.pos.add(this.vel);
		this.bound();

		this.vel.add(this.acc);
		this.vel.limit(this.maxV);
		
		// Reset acceleration
		this.acc = createVector();
		
	}
	
	display(options) {
		
		// Boid
		strokeWeight(this.size);
		stroke(this.col);
		point(this.pos.x, this.pos.y);
		
		strokeWeight(1);
		stroke(255);
		
		// Fov
		if (options.fov)
			ellipse(this.pos.x, this.pos.y, 2 * this.fov);
		
		// Velocity
		if (options.vel) {
			
			var fac = 10,
				dst = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, fac)),
				d   = dst.dist(this.pos),
				r   = map(d, this.maxV * fac, 0, 0, 255),
				g   = map(d, 0, this.maxV * fac, 0, 255);
				
			stroke(r,g,120);
			line(this.pos.x, this.pos.y, dst.x, dst.y);
			noStroke();
			
		}
	}
	
	setMaxA(a) { this.maxA = a; }
	setMaxV(v) { this.maxV = v; }

}