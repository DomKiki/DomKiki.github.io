/********************* Constants *********************/

const gridSize   = 4;
const squareSize = 100;

const canvasSize = gridSize * squareSize + 1;

const startNum   = 2;

const colors     = [ "#FFFFFF", "#FFFFFF", "#FFFFCC", "#FFCC99", "#FFCC00", "#FF0000", "#CC0099", "#6600FF", 
					 "#0000FF", "#006699", "#00CC00", "#99FF99", "#0099cc", "#003399", "#000000" ];

const generations     = 1,
	  specimensPerGen = 1000,
	  batchSize       = 100;
					 
/****************** Global variables *****************/

var grid, oGrid, flat;

var score   = 0,
	scoreTxt,
	record  = 0,
	records = [];
	
var gameOver = false;

var frame,
	changed;

var brain, fittest,
	rewards, expected, pred, move,
	idSpecimen, idGeneration = -1;
	
/********************** p5 Methods *******************/

function setup() {
	
    var canvas = createCanvas(canvasSize, canvasSize);
	canvas.parent("canvas");
	scoreTxt = select("#score");
	
	this.resetGame();
	this.nextGeneration();
	this.update();
	
	error = [];
	
	/*var btn = createButton("Frame");
	btn.mousePressed(drawG);*/
	
	frameRate(3);
	//noLoop();
}

function draw() {
	
	// One specimen is running at a time
	if (idSpecimen < specimensPerGen) {
		// Play once per second until game over
		// Prediction in range [0:3] (left/right, up/down)
		if ((!gameOver) && (changed)) {
			
			flat = this.flattenGrid(grid);
			
			// Simulate one move ahead and compute the rewards
			rewards  = this.simulateMoves(grid);
			// Expected prediction
			expected = new Array(4).fill(0.0);
			expected[maxIndex(rewards)] = 1.0;
			// Actual prediction
			pred     = this.brain.predict(flat);
			move     = maxIndex(pred);
			
			// Apply move
			changed = this.applyMove(floor(move / 2), move % 2);
			// Back-propagate error through NN
			// this.brain.train(flat, expected);	!! This has an unintended side-effect, model.predict() will output NaN's !! To work on
			// Save error
			if (error.length >= batchSize) {
				// Average error
				var sum = 0;
				for (var i = 0; i < error.length; i++)
					sum += error[i];
				sum /= error.length;
				console.log("Error : " + (sum * 100) + "%");
				error = [];
			}
			else {
				error.push(this.brain.computeError(pred, expected));
				console.log(error);
			}
			
		}
		else {
			if (score > record) {
				record  = score;
				fittest = this.brain.clone();
			}
			idSpecimen++;
			this.resetGame();
			update();
		}
	}
	else {
		noLoop();
		/*record = this.getFittest(records, 2);
		fittest = record[0].tf.reproduce(record[1].tf);
		this.nextGeneration();*/
	}
	
}

/************************ Moves **********************/

function keyPressed() {
	
	// Key detection
	var a,d;
	switch (keyCode) {
		
		case UP_ARROW:
			a = 1;
			d = 0;
			break;
		
		case DOWN_ARROW:
			a = 1;
			d = 1;
			break;
			
		case LEFT_ARROW:
			a = 0;
			d = 0;
			break;
		
		case RIGHT_ARROW:
			a = 0;
			d = 1;
			break;
			
		default:
			return;		
	}
	
	this.applyMove(a,d);
	
}

function applyMove(a, d, show=true) {
	
	// Copy for further change check
	var g = copyGrid(grid),
		p = copyGrid(grid);
	// Rotate the grid if up/down
	if (a == 1)
		g = rotateGrid(g, 1);
		
	// Actual move and combination
	g = slideGrid(g,a,d);
	g = combineGrid(g,a,d);
	
	// Rotate back 
	if (a == 1)
		g = rotateGrid(g, 3);
	
	// Save changes
	grid = copyGrid(g);
		
	// Feed new number into the grid if something moved (disabled if !show because it's only for move simulation)
	var changed = !gridEquals(p);
	if ((changed) && (show)) {
		feedGrid();
		update();
	}
	
	// Game Over : display final score
	gameOver = isGameOver();
	if (gameOver)
		updateScore();
	
	return changed;
	
}

function simulateMoves() {
		
	var current,
		dScore,
		scores = [];
	
	for (var m = 0; m < 4; m++) {
		
		// Current
		oGrid  = this.copyGrid(grid);	
		dScore = score;
		this.applyMove(floor(m / 2), m % 2, false);
		// deltaScore (current - previous)
		dScore = score - dScore;
		scores.push((gameOver) ? -score : dScore);
		// Reset
		grid   = this.copyGrid(oGrid);
		score -= dScore;
		
	}
	
	return scores;
	
}

/************************* Grid **********************/

// Fill grid with zeros
function initGrid() {
	grid = new Array(gridSize);
	for (var i = 0; i < gridSize; i++)
		grid[i] = new Array(gridSize).fill(0);
}

// Swap row and column of an array
function rotateGrid(g, d) {
	var s, 
		cp = copyGrid(g), cp2; 
	for (var n = 0; n < d; n++) {
		cp2 = copyGrid(cp);
		s   = cp.length;
		for (var i = 0; i < s; i++) {
			cp2[i].fill(0);
			for (var j = 0; j < s; j++)
				cp2[i][j] = cp[j][i];
		}		
		cp = copyGrid(cp2);
	}
	return cp;
}

// Make a copy of an array
function copyGrid(g) {
	var s  = g.length,
		cp = new Array(s);
	for (var i = 0; i < s; i++) {
		cp[i] = new Array(s);
		for (var j = 0; j < s; j++)
			cp[i][j] = g[i][j];
	}
	return cp;
}
	
// Randomly throw 2s or 4s in an array
function feedGrid(n=1) {
	
	// Don't get stuck in an infinite loop
	var avail = false;
	for (var i = 0; i < gridSize; i++)
		if (grid[i].includes(0)) {
			avail = true;
			break;
		}
	if (!avail)
		return;
	
	// Feed it !
	var ok = 0,
		num,
		pos;
	while (ok < n) {
		num = (random() < 0.9) ? 2 : 4;
		pos = createVector(floor(random(gridSize)), floor(random(gridSize)));
		if (grid[pos.x][pos.y] == 0) {
			grid[pos.x][pos.y] = num;
			ok++;
		}
	}
	
}

// Test equality between grid and c
function gridEquals(c) {

	for (var i = 0; i < gridSize; i++)
		for (var j = 0; j < gridSize; j++)
			if (grid[i][j] != c[i][j])
				return false;
	return true;
		
}

// Slide the grid along an axis (0 for rows, 1 for columns)
function slideGrid(g, axis, dir) {

	var fil,
		res = copyGrid(g);
	for (var r = 0; r < res.length; r++) {
		var fil = res[r].filter(x => x);
		var pad = new Array(res.length - fil.length).fill(0);
		res[r]  = (dir == 0) ? fil.concat(pad) : pad.concat(fil);
	}
	return res;
	
}

// Combine adjacent equal numbers
function combineGrid(g, axis, dir) {
	
	var res = copyGrid(g);
	for (var r = 0; r < res.length; r++) {
		
		var row = res[r],
			i1 = (dir == 0) ? 0                : (res.length - 1),
			i2 = (dir == 0) ? (res.length - 1) : 0,
			di = (dir == 0) ? 1                : -1,
			a, b;
			
		for (var i = i1; i != i2; i += di) {
			a = row[i];
			b = row[i + di];
			if (a == b) {
				row[i] = a + b;
				row[i + di] = 0;
				score += row[i];
			}
		}
		
	}
	return slideGrid(res, axis, dir);
	
}

// Reduces a 2D array into 1D
function flattenGrid(g) {
	var res = new Array(g.length * g[0].length),
		cpt = 0;
	for (var i = 0; i < g.length; i++)
		for (var j = 0; j < g[i].length; j++)
			res[cpt++] = grid[i][j];
	return res;
}

// Resets the grid
function resetGrid() {
	initGrid();
	//feedGrid(startNum);
	grid[1][1] = 2;
	grid[1][3] = 2;
}

/************************ Array **********************/

function maxIndex(arr) {
	
	if (arr.length === 0)
		return -1;
	
	var max = -Infinity;
	var ind = -1;
	for (var i = 0; i < arr.length; i++)
		if (arr[i] > max) {
			max = arr[i];
			ind = i;
		}
		
	return ind;
}

/************************ Data ***********************/

function updateScore() { 
	var str = score + " pts";
	if (gameOver)
		str = "Final Score : " + str;
	scoreTxt.html(str); 
}

// Checks if there is an empty space in the grid or 2 identical values that could be merged
function isGameOver() {
	for (var i = 0; i < gridSize; i++)
		for (var j = 0; j < gridSize; j++)
			if (grid[i][j] == 0)
				return false;
			else if ((i < (gridSize - 1)) && (grid[i][j] == grid[i+1][j]))
				return false;
			else if ((j < (gridSize - 1)) && (grid[i][j] == grid[i][j+1]))
				return false;
	return true;
}

// Resets board, score and neural network (mutated)
function resetGame() {
	
	// Neural network
	if (typeof fittest === "undefined")
		brain  = new TensorFlowWrapper(16, 64, 4);
	/*else
		brain  = fittest.clone();
	brain.mutate(0.1, 0.5);*/
		
	gameOver   = false;
	changed    = true;
	score      = 0;
	this.resetGrid();
	
}

// Increases counters and resets game
function nextGeneration() {
	idGeneration++;
	idSpecimen = 0;
	this.resetGame();
}

// Gets n fittest of an array
function getFittest(arr, n) {
	records.sort(compareFitness);
	return records.slice(records.length - n, records.length);
}

function compareFitness(a,b) {
	if (a.fit < b.fit)
		return -1;
	if (a.fit > b.fit)
		return 1;
	return 0;
}

/*********************** Display *********************/

function update() {
	
    background(255);
	updateScore();
	drawGrid(squareSize);
	
}

function drawGrid(w) {
	
	var v, p, c;
	for (var i = 0; i < gridSize; i++)
		for (var j = 0; j < gridSize; j++) {
			
			v = grid[i][j];
			p = (v != 0) ? round(Math.log2(v)) : 1;
			c = colors[p];
			fill(c);
			strokeWeight(1);
			stroke(0);
			rect(j * w, i * w, w, w, 10);
			
			if (v != 0) {
				textAlign(CENTER, CENTER);
				textSize(round(50 - p));
				stroke(invertColor(c));
				fill(invertColor(c));
				text(v, (j*w) + (w/2), (i*w) + (w/2));
			}
		}
	
}

function invertColor(c) { return color(255 - red(c), 255 - green(c), 255 - blue(c)); }