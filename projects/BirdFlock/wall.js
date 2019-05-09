class Wall {

	constructor(points, c) {
		this.points  = points;
		this.col     = c;
		this.factors = [];
		for (var i = 0; i < points.length; i++) {
			var r = this.extractFactors(points[i], points[(i+1) % points.length]);
			this.factors[i] = { A: r[0], B: r[1], C: r[2] };
		}
	}
	
	extractFactors(p1, p2) {
		var A = p1.y - p2.y;
		var B = p2.x - p1.x;
		var C = (p1.x * p2.y) - (p2.x * p1.y);
		return [A, B, C];
	}
	
	display() {
		fill(this.col);
		beginShape();
		for (var p = 0; p < this.points.length; p++)
			vertex(this.points[p].x, this.points[p].y);
		endShape(CLOSE);
	}
	
	displayLines() {
		stroke(255,255,255,100);
		var a, b, c;
		for (var f = 0; f < this.factors.length; f++) {
			a = this.factors[f].A,
			b = this.factors[f].B,
			c = this.factors[f].C;
			beginShape();
			for (var x = 0; x < width; x++) {
				// Ax + By + C = 0
				// By = -Ax - C
				// y = (-Ax - C) / B
				var y = (-a * x - c) / b;
				vertex(x,y);
			}
			endShape();
		}
	}
	
	closestPointOnLine(p, i) {
		var a = this.factors[i].A,
			b = this.factors[i].B,
			c = this.factors[i].C;
		var a2b2 = (pow(a,2) + pow(b,2));
		var x = ((pow(b,2) * p.x) - a * ((b * p.y) + c)) / a2b2;
		var y = ((pow(a,2) * p.y) - b * ((a * p.x) + c)) / a2b2;
		return createVector(x,y);
	}
	
	extractRatioOnLine(point, pIndex) {
		var p     = this.points[pIndex],
		    a     = this.factors[pIndex].A,
			b     = this.factors[pIndex].B,
			c     = this.factors[pIndex].C;
		var a2b2  = pow(a,2) + pow(b,2);
		return (a * (p.y - point.y) + b * (point.x - p.x)) / a2b2;
	}
	
	pointOnClosestVertex(target, fov) {
		
		var closest = 100000;
		var closestPoint;
		var pOnLine, ratio, d;
		for (var i = 0; i < this.points.length; i++) {
			pOnLine = this.closestPointOnLine(target, i);
			ratio   = this.extractRatioOnLine(pOnLine, i);
			if ((ratio >= 0) && (ratio <= 1)) {	
				d = pOnLine.dist(target);
				if ((d < closest) && (d <= fov)) {
					closest = d;
					closestPoint = pOnLine;
				}
			}
		}
		
		return (typeof closestPoint === "undefined") ? closestPoint : { point: closestPoint, distance: closest };
		
	}

}