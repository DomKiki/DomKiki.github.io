/****************** Global variables *****************/

var ants = 1;
var antPos;

var directions = Object.freeze({"UP": 2, "RIGHT": 3, "DOWN": 4, "LEFT": 5});
var dirAmount  = 4;
var dir;

const dirArrows = ['↰', '-', '↱', '⇑', '⇒', '⇓', '⇐'];

// Cycles array
var colors = [ 'rgb(255, 255, 255)', 'rgb(0, 255, 0)', 'rgb(255, 0 ,0)', 'rgb(255, 153, 0)', 'rgb(0, 0, 0)', 'rgb(100, 100, 100)', 'rgb(0, 204, 255)', 'rgb(0, 0, 102)', 'rgb(255, 102, 255)', 'rgb(153, 0, 153)', 'rgb(153, 51, 0)', 'rgb(51, 153, 102)'];
var cycles = [ 1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, 1];
	
/****************** Canvas instances *****************/

var mCanvas = new p5(mainCanvas,    'canvasDiv');
var oCanvas = new p5(optionsCanvas, 'cyclePath');

/************************* Misc **********************/

function randomCycles(allow) {
	
	var arr = new Array(colors.length);
	var rnd;
	for (var c = 0; c < colors.length; c++) {
		rnd = Math.floor(Math.random() * dirArrows.length) - 1;
		if (allow != null)
			while (!allow.includes(rnd))
				rnd = Math.floor(Math.random() * dirArrows.length) - 1;
		arr[c] = rnd;	
	}
	return arr;
	
}

function createColorPicker(color) { 

	// Create Color Picker
	var input = document.createElement('BUTTON');
	var picker = new jscolor(input, {
		onFineChange: "oCanvas.updateColor(this.toRGBString())",
		valueElement: null
	});
	picker.fromString(color);
	
	// Cleanup and append again
	var node = document.getElementById("tdColorPicker");
	while (node.lastChild)
		node.removeChild(node.lastChild);
	document.getElementById("tdColorPicker").appendChild(input);
	
}

function checkRadioDirection(value) {
	
	var tdRad = document.getElementById("tdRadioDir");
	var rad   = tdRad.getElementsByTagName("INPUT");
	for (var i = 0; i < rad.length; i++)
		rad[i].checked = (rad[i].value == value);
	
}
