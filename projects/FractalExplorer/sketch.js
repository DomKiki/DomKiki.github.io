/****************** Global variables *****************/
	
var sldMinX, sldMaxX, sldMinY, sldMaxY,
	sldStepX, sldStepY,
	sldTranslateX, sldTranslateY,
	sldMaxIte, sldMaxMag,
	btnGo,
	popUp;
	
var txtRangeX, txtRangeY, 
	txtStepX, txtStepY,
	txtTranslateX, txtTranslateY,
	txtMaxIte, txtMaxMag;

/****************** Canvas instances *****************/

var pCanvas = new p5(popupCanvas, "popup");
var mCanvas = new p5(mainCanvas, "canvas");

/********************* Iterations ********************/

// Iterate over a complex number
function iterateC(c, maxI, maxM) {
	if (c.mag >= maxM)
		return 0;
	return iterate(new Complex(0,0), c, maxI, maxM);
}

function iterateZ(z0, maxI, maxM, c) {
	if (z0.mag >= maxM)
		return 0;
	return iterate(z0.copy(), c, maxI, maxM);
}

function iterate(z, c, maxI, maxM) {
	var i = 0;
	while ((i < maxI) && (z.mag < maxM)) {
		z.mult(z);
		z.add(c);
		i++;
	}
	return i;	
}

// Transforms an integer into a color
function iterationColor(n, max) {
	
	if (n == 0)
		return 255;
	
	// Red     -> Yellow    -> Green   -> Blue    -> Black
	// 255,0,0 -> 255,255,0 -> 0,255,0 -> 0,0,255 -> 0,0,0
	var tier = max / 5,
		r,g,b;
	
	// White to Red
	if (n <= tier) {
		r = 255;
		g = mCanvas.map(n, 1, tier, 255, 0);
		b = mCanvas.map(n, 1, tier, 255, 0);
	}
	// Red to Yellow
	else if (n <= (2 * tier)) {
		r = 255;
		g = mCanvas.map(n, tier + 1, 2 * tier, 1, 255);
		b = 0;
	}
	// Yellow to Green
	else if (n <= (3 * tier)) {
		r = mCanvas.map(n, 2 * tier + 1, 3 * tier, 255, 1);
		g = 255;
		b = 0;
	}
	// Green to Blue
	else if (n <= (4 * tier)) {
		r = 0;
		g = mCanvas.map(n, 3 * tier + 1, 4 * tier, 255, 1);
		b = mCanvas.map(n, 3 * tier + 1, 4 * tier, 1, 255);
	}
	// Blue to Black
	else {
		r = 0;
		g = 0;
		b = mCanvas.map(n, 4 * tier + 1, max, 255, 0);
	}
	
	return mCanvas.color(r,g,b);
	
}

/*********************** Pop-up **********************/

function hidePopup() { popUp.class("hidden");       }
function showPopup() { popUp.removeClass("hidden"); }