/****************** Global variables *****************/

const CM_NONE   = 0,
	  CM_INDIV  = 1,
	  CM_SINGLE = 2;

var COL_BLACK;

var canvas, center;

var tree, angles, time = { h: 0, m: 0, s: 0 };

var colors = ["#FF0000", "#66FF00", "#0066FF"],
	backgroundColor,
	clockRadius = 150,
	showClock   = true;

var shrink   = 0.67,
	minLen   = 10,
	branches = 1,
	colorMod = CM_INDIV;

var ctrl, gui,
	btnColorMode, btnShowClock;

/************************* p5 ************************/

function setup() {

	canvas = createCanvas(1200, 800);
	canvas.parent("canvasDiv");
	center = createVector(width/2, height/2);
	backgroundColor = color("#e6ffff");

	initTree();
	initGUI();
	initColors();

	frameRate(2);
	
}

function draw() {

	background(backgroundColor);

	if (showClock)
		drawClock();

	setClockTime();
	updateAngles();

	translate(center.x, center.y);
	for (let i = 0; i < tree.length; i++) {
		push();
			rotate(angles[i]);
			branch(i, tree[i].getDir().mag(), getColor(i));
		pop();
	}
}

/************************* Tree **********************/

function initTree() {
	tree = [ new Hand(createVector(center.x, center.y - (clockRadius - 80))),
			 new Hand(createVector(center.x, center.y - (clockRadius - 50))),
			 new Hand(createVector(center.x, center.y - (clockRadius - 30))) ];
	for (let i of tree)
		console.log(i.getDir().mag());
}

function branch(index, len, col) {

	stroke(col);
	noFill();
	strokeWeight(len / 50);

	line(0, 0, 0, -len);
	if ((len > minLen) && (index > (tree.length - 1 - branches))) {
		push();
			translate(0, -len);
			for (let i = 0; i < angles.length; i++) {
				let a = angles[i];
				push();
					rotate(a);
					branch(index, len * shrink, getColor(i), alpha * 0.95);
				pop();
			}
		pop();
	}
}

/************************ Clock **********************/

function polar(rad, phi) { return createVector(rad * cos(phi), rad * sin(phi)); }

function drawClock() {

	let divis = 12;
	translate(width / 2, height / 2);

	// Divisions
	noStroke();
	fill(0);
	textSize(20);
	textAlign(CENTER);
	for (let h = 0; h <= divis; h++) {
		let a = h * (TWO_PI / divis);
		for (let i = 1; i < 5; i++) {
			let sub = polar(clockRadius, a + i * (TWO_PI / 60));
			ellipse(sub.x, sub.y, 5);
		}
		let c = polar(clockRadius, a);
		ellipse(c.x, c.y, 10);
		if (h < 12) {
			let textPos = polar(clockRadius - 30, a - HALF_PI);
			text(h, textPos.x, textPos.y);
		}
	}

	translate(-center.x, -center.y);

}

function setClockTime() {
	let sec = second();
	let min = minute() + sec/60;
	let hr  = hour()   + min/60;
	tree[0].setPosition(hr * 5);
	tree[1].setPosition(min);
	tree[2].setPosition(sec);
}

function updateAngles() {
	let refs   = [ createVector(0, -100), createVector(0, 100) ];
	    angles = [];
	for (let i = 0; i < tree.length; i++) {
		let ref = (tree[i].getDir().x > 0) ? 0 : 1;
		let off = (ref == 1) ? PI : 0;
		angles.push(p5.Vector.sub(tree[i].p2, center).angleBetween(refs[ref]) + off);
	}
}

function initColors() {
	COL_BLACK = color(0);
	for (let c = 0; c < colors.length; c++)
		colors[c] = color(colors[c]);
}

function getColor(index, alpha) {
	switch (colorMod) {
		case CM_NONE:
			return COL_BLACK;
		case CM_INDIV:
			return colors[index];
		default: 
			return COL_BLACK;
		/*case CM_SINGLE:
			return color(255,120,0);*/
	}
}