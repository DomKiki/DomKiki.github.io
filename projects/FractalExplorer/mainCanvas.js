var mainCanvas = function(p) {

	var canvas;

	var grid_c, grid_i,
		range         = { minX: -2.0, maxX: 2.0, minY: -1.8, maxY: 1.8 },
		step          = { x: 0.005, y: 0.005 },
		translate     = { x: 0.5,   y: 0.5  },
		squareSize,
		maxIterations = 100,
		maxMagnitude  = range.maxX;

	/********************** p5 Methods *******************/
		
	p.setup = function() {
		
		canvas = p.createCanvas(800,800)
				.parent("canvas")
				.style("border", "1px solid black");
		
		p.initSliders();
		p.noLoop();

	}

	p.draw = function() {
		
		p.background(255);
		
		if (typeof grid_i !== "undefined") {
			p.displayGrid();
			p.noLoop();
		}
		
	}

	/*********************** Canvas **********************/

	// Inits the canvas
	p.initCanvas = function() {
		
		canvas = p.createCanvas((range.maxX - range.minX) / step.x,
							    (range.maxY - range.minY) / step.y)			
				.parent("canvas")
				.style("border", "1px solid black")
				.mousePressed(p.focusNumber);
				
		squareSize = p.createVector((p.width * step.x) / (range.maxX - range.minX),
								    (p.width * step.y) / (range.maxY - range.minY));
		
	}

	// Gets the parameters and launches the computation
	p.go = function() {
		p.initCanvas();
		p.initGrids();
		p.loop();
	}

	p.focusNumber = function() {
		popUp.position(p.mouseX, p.mouseY);
		pCanvas.setComplex(grid_c[p.round(p.mouseX / squareSize.x)][p.round(p.mouseY / squareSize.y)]);
		pCanvas.initGrids();
		pCanvas.displayGrid();
		showPopup();
	}

	/************************ Grid ***********************/

	// Instantiates, fills the grids and computes the iterations for each complex number
	p.initGrids = function() {

		// Init
		var r = p.createVector((range.maxX - range.minX) / step.x,
						       (range.maxY - range.minY) / step.y);
		grid_c = new Array(r.x);
		grid_i = new Array(r.x);
		var i = 0, j;
		for (var x = range.minX; x <= range.maxX; x += step.x) {
			
			j = 0;
			grid_c[i] = new Array(r.y);
			grid_i[i] = new Array(r.y);
			
			for (var y = range.minY; y <= range.maxY; y += step.y) {
				grid_c[i][j]   = new Complex(x, -y);
				grid_i[i][j++] = 0;
			}
			i++;
		}
		
		// Iterations (Mandelbrot : fix z0 = 0 and sweep C)
		for (var i = 0; i < grid_i.length; i++)
			for (var j = 0; j < grid_i[i].length; j++)
				grid_i[i][j] = iterateC(grid_c[i][j], maxIterations, maxMagnitude);

	}

	// Display iterations in canvas
	p.displayGrid = function() {
		
		p.translate(translate.x * p.width, translate.y * p.height);
		p.noStroke();
		var c, coords, col;
		for (var i = 0; i < grid_c.length; i++)
			for (var j = 0; j < grid_c[i].length; j++) {
				col    = iterationColor(grid_i[i][j], maxIterations);
				p.fill(col);
				p.stroke(col);
				c      = grid_c[i][j];
				p.rect(c.re * squareSize.x / step.x, 
					   c.im * squareSize.y / step.y,
					   squareSize.x, squareSize.y);
			}
	}

	/*********************** Sliders *********************/

	p.initSliders = function() {
		
		sldMinX   = p.makeSlider(-10.0, -0.5,  -2.0,   0.1, p.select("#sldMinX"),   p.updateMinX);
		sldMaxX   = p.makeSlider(0.5,   10.0,   2.0,   0.1, p.select("#sldMaxX"),   p.updateMaxX);
		sldMinY   = p.makeSlider(-10.0, -1.0,  -1.8,   0.1, p.select("#sldMinY"),   p.updateMinY);
		sldMaxY   = p.makeSlider(1.0,   10.0,   1.8,   0.1, p.select("#sldMaxY"),   p.updateMaxY);
		sldStepX  = p.makeSlider(0.005,  0.1, 0.005, 0.005, p.select("#sldStepX"),  p.updateStepX);
		sldStepY  = p.makeSlider(0.005,  0.1, 0.005, 0.005, p.select("#sldStepY"),  p.updateStepY);
		sldMaxIte = p.makeSlider(100,  10000,   300,   100, p.select("#sldMaxIte"), p.updateMaxIte);
		sldMaxMag = p.makeSlider(  1,     10,     2,     1, p.select("#sldMaxMag"), p.updateMaxMag);
		sldTranslateX = p.createSlider(0,   1,   0.5,  0.05).parent("sldTranslateX").changed(p.updateTranslateX);
		sldTranslateY = p.createSlider(0,   1,   0.5,  0.05).parent("sldTranslateY").changed(p.updateTranslateY);
		
		txtRangeX     = p.select("#txtRangeX");
		txtRangeY     = p.select("#txtRangeY");
		txtStepX      = p.select("#txtStepX");
		txtStepY      = p.select("#txtStepY");
		txtTranslateX = p.select("#txtTranslateX");
		txtTranslateY = p.select("#txtTranslateY");
		txtMaxIte     = p.select("#txtMaxIte");
		txtMaxMag     = p.select("#txtMaxMag");
		
		p.updateMinX();
		p.updateMaxX();
		p.updateMinY();
		p.updateMaxY();
		p.updateStepX();
		p.updateStepY();
		p.updateTranslateX();
		p.updateTranslateY();
		p.updateMaxIte();
		p.updateMaxMag();
		
		btnGo = p.createButton("Go")
			.parent("#btnGo")
			.mousePressed(p.go);
			
		popUp = p.select("#popup")
			   .mousePressed(p.hidePopup);
			
	}
	p.makeSlider = function(min, max, val, stp, par, callback) {
		return p.createSlider(min, max, val, stp)
			  .parent(par)
			  .input(callback);
	}

	p.updateMinX = function() {
		range.minX = sldMinX.value();
		p.displayRangeX();
	}
	p.updateMaxX = function() {
		range.maxX = sldMaxX.value();
		p.displayRangeX();
	}
	p.updateMinY = function() {
		range.minY = sldMinY.value();
		p.displayRangeY();
	}
	p.updateMaxY = function() {
		range.maxY = sldMaxY.value();
		p.displayRangeY();
	}
	p.updateStepX = function() {
		step.x = sldStepX.value();
		txtStepX.html("x : " + step.x);
	}
	p.updateStepY = function() {
		step.y = sldStepY.value();
		txtStepY.html("y : " + step.y);
	}
	p.updateTranslateX = function() {
		translate.x = sldTranslateX.value();
		txtTranslateX.html("x : " + translate.x);
		p.loop();
	}
	p.updateTranslateY = function() {
		translate.y = sldTranslateY.value();
		txtTranslateY.html("y : " + translate.y);
		p.loop();
	}
	p.updateMaxIte = function() {
		maxIterations = sldMaxIte.value();
		txtMaxIte.html(maxIterations);
	}
	p.updateMaxMag = function() {
		maxMagnitude = sldMaxMag.value();
		txtMaxMag.html(maxMagnitude);
	}
	
	p.displayRangeX = function() { txtRangeX.html(range.minX + " ≤ x ≤ " + range.maxX); }
	p.displayRangeY = function() { txtRangeY.html(range.minY + " ≤ y ≤ " + range.maxY); }

	p.hidePopup = function() { popUp.style("visibility", "hidden"); }
	p.showPopup = function() { 
		popUp.position(mouseX, mouseY);
		popUp.style("visibility", "visible"); 
	}

}