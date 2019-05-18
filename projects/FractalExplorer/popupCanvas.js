var popupCanvas = function(p) {

	var canvas;
	
	var complex,
		grid_c, grid_i;
		
	var range         = 2.0,
		step          = 0.02,
		maxIterations = 50, 
		maxMagnitude  = 2;

	p.setup = function() {
		
		canvas = p.createCanvas(200,200).parent("popup");
		
		p.textSize(16);
		p.textAlign(p.CENTER, p.CENTER);
		p.stroke(0);
		p.fill(255,0,0);
				
	}
	
	// Instantiates, fills the grids and computes the iterations for each complex number
	p.initGrids = function() {

		// Init
		var r = 2 * range / step;
		grid_c = new Array(r);
		grid_i = new Array(r);
		var i = 0, j;
		for (var x = -range; x <= range; x += step) {
			
			j = 0;
			grid_c[i] = new Array(r);
			grid_i[i] = new Array(r);
			
			for (var y = -range; y <= range; y += step) {
				grid_c[i][j]   = new Complex(x, -y);
				grid_i[i][j++] = 0;
			}
			i++;
		}
		
		// Iterations (Julia : fix C = complex and sweep z0)
		for (var i = 0; i < grid_i.length; i++)
			for (var j = 0; j < grid_i[i].length; j++)
				grid_i[i][j] = iterateZ(grid_c[i][j], maxIterations, maxMagnitude, complex.copy());
			
	}
	
	// Display iterations in canvas
	p.displayGrid = function() {
		
		// Clear canvas
		p.fill(255);
		p.noStroke();
		p.rect(0, 0, p.width, p.height);
		p.translate(p.width / 2, p.height / 2);
		var c, coords, col;
		for (var i = 0; i < grid_c.length; i++)
			for (var j = 0; j < grid_c[i].length; j++) {
				col = iterationColor(grid_i[i][j], maxIterations);
				p.fill(col);
				p.stroke(col);
				c = grid_c[i][j];
				p.point(c.re / step, c.im / step);
			}
		p.translate(-p.width / 2, -p.height / 2);
	}
	
	p.setComplex = function(c) { 
		complex = c.copy(); 
		p.loop();
	}


}