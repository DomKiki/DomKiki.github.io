/****************************** Banner *******************************/

const IMG_SKY = DIR_IMG + "sky.png"; // "https://image.noelshack.com/fichiers/2019/20/3/1557939925-sky.png",
	  IMG_SEA = DIR_IMG + "sea.png"; // "https://image.noelshack.com/fichiers/2019/20/3/1557939925-sea.png",
	  IMG_TXT = DIR_IMG + "txt.png"; // "https://image.noelshack.com/fichiers/2019/20/3/1557939924-text.png";
	  
var   canvas,
	  imgSky, imgSea, imgTxt;
	  
function preload() {
	imgSky = loadImage(IMG_SKY);
	imgSea = loadImage(IMG_SEA);
	//imgTxt = loadImage(IMG_TXT);
}
	  
function setup() {

	canvas = createCanvas(800, 400);
	canvas.parent("#banner");
	
	for (var entry of entries)
		createProject(entry);

}

function draw() {

	image(imgSky,0,0);
	image(imgSea,0,225);
	//image(imgTxt,0,225);
	
	noLoop();

}	  
	 
function assembleBanner() {
	
}