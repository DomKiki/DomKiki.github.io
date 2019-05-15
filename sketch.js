/****************************** Banner *******************************/

const IMG_SKY = DIR_IMG + "sky.png";
	  IMG_SEA = DIR_IMG + "sea.png";
	  IMG_TXT = DIR_IMG + "txt.png";
	  
var   canvas,
	  imgSky, imgSea, imgTxt;
	  
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

}

function draw() {

	image(imgSky,0,0);
	image(imgTxt,0,0);
	image(imgSea,0,225);
	
	noLoop();

}	  
	 
function assembleBanner() {
	
}