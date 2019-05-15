/****************************** Banner *******************************/

const IMG_SKY = DIR_IMG + "sky.png";
	  IMG_SEA = DIR_IMG + "sea.png";
	  IMG_TXT = DIR_IMG + "txt.png";
	  
const ANM_SKY_IN  = 0,
	  ANM_SEA_IN  = 1,
	  ANM_TXT_IN  = 2,
	  ANM_SKY_OUT = 3,
	  ANM_SEA_OUT = 4;
	  
var   canvas,
	  imgSky, imgSea, imgTxt,
	  skySiz, seaSiz, txtSiz,
	  skyPos, seaPos, txtPos;
	  
var   anim = 0; 
	 
	  
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
	txtPos = createVector(-txtSiz.x, height-seaSiz.y-txtSiz.y);

}

function draw() {

	background(255);

	this.displayImages();
	this.animate(3);
	
	
}	  

function animate(step) {
	
	switch (anim) {
		
		case ANM_SKY_IN:
			if (skyPos.y < 0) {
				skyPos.y += step;
				if (skyPos.y >= 0) {
					skyPos.y = 0;
					anim = ANM_SEA_IN;
				}
			}
			break;
			
		case ANM_SEA_IN:
			if (seaPos.y > 225) {
				seaPos.y -= step;
				if (seaPos.y <= skySiz.y) {
					seaPos.y = skySiz.y;
					anim = ANM_TXT_IN;
				}
			}
			break;
			
		case ANM_TXT_IN:
			if (txtPos.x < 0) {
				txtPos.x += (3 * step);
				if (txtPos.x >= 0) {
					txtPos.x = 0;
					anim = ANM_SEA_OUT;
				}
			}
			break;

		case ANM_SEA_OUT:
			if (seaPos.y < height) {
				seaPos.y += step;
				if (seaPos.y >= height) {
					seaPos.y = height;
					anim = ANM_SKY_OUT;
				}
			}
			break;
			
		case ANM_SKY_OUT:
			if (skyPos.y > -skySiz.y) {
				skyPos.y  -= step;
				if (skyPos.y <= -skySiz.y) {
					skyPos.y = -skySiz.y;
					anim = -1;
					noLoop();
				}
			}
			break;
			
		default:
			break;
		
	}
	
}
	 
function displayImages() {
	
	//noStroke();
	// Sky
	/*fill(0);
	rect(skyPos.x, skyPos.y, skySiz.x, skySiz.y);*/
	image(imgSky, skyPos.x, skyPos.y);
	// Sea
	/*fill(0,0,255);
	rect(seaPos.x, seaPos.y, seaSiz.x, seaSiz.y);*/
	image(imgSea, seaPos.x, seaPos.y);
	// Txt
	/*fill(255);
	rect(txtPos.x, txtPos.y, txtSiz.x, txtSiz.y);*/
	image(imgTxt, txtPos.x, txtPos.y);
	
}	