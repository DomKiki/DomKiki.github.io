/****************************** Banner *******************************/

const IMG_SKY = DIR_IMG + "sky.png";
	  IMG_SEA = DIR_IMG + "sea.png";
	  IMG_TXT = DIR_IMG + "txt.png";
	  
const ANM_SKY_IN  = 0,
	  ANM_SEA_IN  = 1,
	  ANM_TXT_IN  = 2,
	  ANM_SKY_OUT = 3,
	  ANM_SEA_OUT = 4;
	  
var   canvas, grid,
	  imgSky, imgSea, imgTxt,
	  skySiz, seaSiz, txtSiz,
	  skyPos, seaPos, txtPos;
	  
var   sldAli, sldCoh, sldSep;
	  
var   anim  = 0,
	  sleep = 0; 

var   flock = [],
	  opt   = { fov: false, vel: false, walls: false };
	 
  
function preload() {
	imgSky = loadImage(IMG_SKY);
	imgSea = loadImage(IMG_SEA);
	imgTxt = loadImage(IMG_TXT);
}
  
function setup() {

	canvas = createCanvas(800, 325);
	canvas.parent("#banner");
	
	for (var entry of entries)
		createProject(entry);
	
	skySiz = createVector(800,225);
	seaSiz = createVector(800,100);
	txtSiz = createVector(800,225);
	
	skyPos = createVector(0, -skySiz.y);
	seaPos = createVector(0, height);
	txtPos = createVector(-txtSiz.x, height - (seaSiz.y + txtSiz.y));
	
	sldAli = createSlider(0,2,1.5,0.1).style("display", "none");
	sldCoh = createSlider(0,2,0.5,0.1).style("display", "none");
	sldSep = createSlider(0,2,1.0,0.1).style("display", "none");
	
}

function draw() {
	
	background(255);

	if (anim != -1) {
		this.displayImages();
		if (sleep == 0) {
			this.animate(3);
		}
		else
			sleep--;
	}
	else 
		for (var b of flock) {
			b.ACS(flock);
			b.update();
			b.display(opt);
		}

}

function animate(step) {
	
	switch (anim) {
		
		case ANM_SKY_IN:
			if (skyPos.y < 0) {
				skyPos.y += step;
				if (skyPos.y >= 0) {
					skyPos.y = 0;
					anim = ANM_TXT_IN;
				}
			}
			break;
			
		case ANM_TXT_IN:
			if (txtPos.x < 0) {
				txtPos.x += (3 * step);
				if (txtPos.x >= 0) {
					txtPos.x = 0;
					anim = ANM_SEA_IN;
				}
			}
			break;
			
		case ANM_SEA_IN:
			if (seaPos.y > 225) {
				seaPos.y -= step;
				if (seaPos.y <= skySiz.y) {
					seaPos.y = skySiz.y;
					sleep = 300;
					anim = ANM_SKY_OUT;
				}
			}
			break;
			
		case ANM_SKY_OUT:
			if (skyPos.y > -skySiz.y) {
				skyPos.y  -= step;
				if (skyPos.y <= -skySiz.y) {
					skyPos.y = -skySiz.y;
					anim = ANM_SEA_OUT;
				}
			}
			break;

		case ANM_SEA_OUT:
			if (seaPos.y < height) {
				seaPos.y += step;
				if (seaPos.y >= height) {
					seaPos.y = height;
					anim = -1;
				}
			}
			break;
			
		default:
			break;
		
	}
	
	if (anim == -1) {
		this.displayImages();
		grid = this.getPixels(canvas);
		noStroke();
		fill(255);
		rect(0,0,width,height);
		flock = this.generateFlock(grid, 5);
	}
	
}
	 
function displayImages() {
	
	image(imgSky, skyPos.x, skyPos.y);
	image(imgSea, seaPos.x, seaPos.y);
	image(imgTxt, txtPos.x, txtPos.y);
	
	/*noFill();
	stroke(0,0,255);
	rect(skyPos.x, skyPos.y, skySiz.x, skySiz.y);
	stroke(0);
	rect(seaPos.x, seaPos.y, seaSiz.x, seaSiz.y);
	stroke(255,0,0);
	rect(txtPos.x, txtPos.y, txtSiz.x, txtSiz.y);*/
	
}	

function getPixels() {
	
	var g = new Array(height);
	for (var row = 0; row < height; row++)
		g[row] = new Array(width);
	
	loadPixels();
	var c,
		d = pixelDensity(),
		l = 4 * (width * d) * (height * d);
	
	var index, x, y;
	for (var i = 0; i < l; i += 4) {
		index = i / 4;
		x       = floor(index / (width * d));
		y       = (index / d) % width;
		g[x][y] = floor(red(pixels[i]) / 255);
	}
	updatePixels();
	
	return g;	
}

function generateFlock(g, s) {
	
	var f = [];
	for (var i = 0; i < height; i += s)
		for (var j = 0; j < width; j += s)
			if (g[i][j] == 0) {
				b = new Boid(i, j, 10, 0);
				b.size = s;
				b.display(opt);
				f.push(b);
			}		
	return f;
}