/****************** Global variables *****************/

var flock   = [];
var walls   = [];
var options = { fov: false, vel: false, walls: false };

var slidersDiv;

var sldAli,
	sldCoh,
	sldSep,
	sldMaxA,
	sldMaxV;

var btnFov,
	btnVel,
	btnWalls;

/********************** p5 Methods *******************/

function setup() {
	
    var canvas = createCanvas(800, 600);
	canvas.parent("canvas");
	
	for (var i = 0; i < 100; i++)
		flock.push(new Boid(random(width), random(height)));
	
	slidersDiv = select("#sliders");
	
	sldAli  = makeSliderTR(0, 5,  1,   0.05, "Alignment");
	sldCoh  = makeSliderTR(0, 5,  1,   0.05, "Cohesion");
	sldSep  = makeSliderTR(0, 5,  1,   0.05, "Separation");
	
	sldMaxA = makeSliderTR(0, 3,  0.1, 0.01, "Max Acceleration");
	sldMaxA.changed(updateMaxA);
	sldMaxV = makeSliderTR(0, 10, 5,   0.5,  "Max Velocity");
	sldMaxV.changed(updateMaxV);
	
	btnFoV = createButton("FoV")
			.parent("buttons")
			.mouseClicked(pressFoV);
				
	btnVel = createButton("Velocity")
			.parent("buttons")
			.mouseClicked(pressVel);
	
	btnWalls = createButton("Walls (Beta)")
			  .parent("buttons")
			  .mouseClicked(pressWalls);
	
}

function draw() {
	
    background(255);
	
	if (options.walls) {
		strokeWeight(1);	
		for (var w of walls)
			w.display();
	}
	
	noFill();
	
	for (var b of flock) {
		b.ACS(flock);
		if (options.walls)
			b.avoid(walls);
		b.update();
		b.display(options);
	}
	
}

/****************** Buttons Callbacks ****************/

function pressFoV() { 
	options.fov = !options.fov;
	btnFoV.style("border-style", options.fov ? "inset" : "outset");
}
function pressVel() {
	options.vel = !options.vel;
	btnVel.style("border-style", options.vel ? "inset" : "outset");
}

function pressWalls() { 
	options.walls = !options.walls;
	btnWalls.style("border-style", options.walls ? "inset" : "outset"); 
	if (options.walls)
		instantiateWalls(20);
}

/*********************** Slider **********************/

function makeSliderTR(min, max, value, step, label) {
	
	var slidersTab = select('TABLE', slidersDiv);
	var sld  = createSlider(min, max, value, step);
	var tr   = createElement('tr');
	var tdS  = createElement('td');
	var tdL  = createElement('td', label);
	sld.parent(tdS);
	tdS.parent(tr);
	tdL.parent(tr);
	tr.parent(slidersTab);
	
	return sld;
	
}

/************************ Data ***********************/

function instantiateWalls(amount, size=20, minLen=80, maxLen=200) {
	
	walls = [];
	
	var x, y, d, w, h;
		
	for (var i = 0; i < amount; i++) {
		// Value generation
		x = random(width);
		y = random(height);
		d = random();
		w = random(maxLen - minLen) + minLen;
		h = random(maxLen - minLen) + minLen;
		if (d < 0.5) w = size;
		else		 h = size;
		// Instantiations
		walls.push(new Wall([createVector(x,y), createVector(x+w,y), createVector(x+w,y+h), createVector(x,y+h)], color(random(255), random(255), random(255))));
	}
		
}

function updateMaxA() { for (var b of flock) b.setMaxA(sldMaxA.value()); }
function updateMaxV() { for (var b of flock) b.setMaxV(sldMaxV.value()); }