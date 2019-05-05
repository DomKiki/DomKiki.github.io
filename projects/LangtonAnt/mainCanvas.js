var mainCanvas = function(p) {
	
	var looping = true;
	
	var btnPause;
	
	var stepsPerFrame;
	var txtSPF;
	
	var grid;

	/********************* p5 Methods ********************/
	
	p.setup = function() {
		
		p.createCanvas(800, 600);
		p.background(255)
		 .noFill()
		 .strokeWeight(1);
		
		btnPause      = p.select("#btnPause");
		stepsPerFrame = p.select("#sldSPF").value();
		txtSPF        = p.select("#txtSPF");
		p.updateSPF(stepsPerFrame);
		
		// Instantiate grid
		p.grid = new Array(p.width);
		for (var i = 0; i < p.grid.length; i++)
			p.grid[i] = new Array(p.height);
		// Fill it with zeros
		p.initGrid(0);

		// Create ants
		antPos = new Array(ants);
		dir    = new Array(ants);
		for (var i = 0; i < ants; i++) {
			antPos[i] = p.createVector(p.floor(p.random(p.width)), p.floor(p.random(p.height)));
			dir[i]    = p.floor(p.random(dirAmount));
		}
		
	}
	
	p.draw = function() { p.oneFrame(); }

	/************************ Actions ********************/
	
	p.clear = function() {
		p.initGrid(0);
		p.fill(255)
		 .noStroke()
		 .rect(0, 0, p.width, p.height);
	}

	p.pause = function() {
		looping = !looping;
		if (looping) {
			btnPause.html("Pause");
			p.loop();
		}
		else {
			btnPause.html("Resume");
			p.noLoop();
		}
	}
	
	p.oneStep  = function() { for (var ant = 0; ant < ants; ant++) p.step(ant); }
	p.oneFrame = function() { for (var n = 0; n < stepsPerFrame; n++) p.oneStep(); }
	
	/*********************** Variables *******************/
	
	p.initGrid = function(value) {
		for (var i = 0; i < p.grid.length; i++)
			p.grid[i].fill(value);
	}
	
	p.updateSPF = function(spf) { 
		stepsPerFrame = spf; 
		txtSPF.html(spf + " SpF");
	}
		
	/************************ Moves **********************/

	p.turn = function(ant) {
		
		var pos = antPos[ant];
		var g = p.grid[pos.x][pos.y];
		// Next direction is the next value in the cycles array
		var d = (g + 1) % cycles.length;
		// Mark
		p.mark(pos, d);
		// Update direction
		if (p.abs(cycles[g]) > 1)
			dir[ant] = cycles[g];
		else
			dir[ant] = (dir[ant] + cycles[g] + dirAmount) % dirAmount;
		
		// Set grid value
		p.grid[pos.x][pos.y] = d;
		
	}
	
	p.mark = function(pos, c) {
		
		// Grid
		p.grid[pos.x][pos.y] = colors[c];
		// Pixel
		p.stroke(p.color(colors[c]));
		p.point(pos.x, pos.y);
		
	}

	p.step = function(ant) {
		
		// Turn
		p.turn(ant);
		
		// Apply move
		var m = p.createVector(0,0);
		switch(dir[ant] + directions.UP) {
			case directions.UP:
				m.y = -1;
				break;
			case directions.RIGHT:
				m.x = 1;
				break;
			case directions.DOWN:
				m.y = 1;
				break;
			case directions.LEFT:
				m.x = -1;
				break;
			default:
				break;
		}
		antPos[ant].add(m);
		
		// Wrap world on itself
		antPos[ant].x = (antPos[ant].x + p.width)  % p.width;
		antPos[ant].y = (antPos[ant].y + p.height) % p.height;
		
	}
	
};