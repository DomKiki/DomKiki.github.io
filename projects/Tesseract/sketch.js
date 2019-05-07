/****************** Global variables *****************/

var angle  = 0,
	points = [];

var sliders,
	angles,
	checkboxes,
	cycling,
	rotationMatrices = [];

var btnRandom,
	randomize  = false,
	skipRandom = 20,
	cpt        = 0;

/********************** p5 Methods *******************/
	
	
function setup() {
	
    var canvas = createCanvas(800, 600, WEBGL);
	canvas.parent("canvas");
	
	// Init sliders, checkboxes, angles and rotation matrices
	var trSliders  = selectAll("tr", select("table", select("#sliders")));
	
	sliders          = new Array(3);
	angles           = new Array(3);
	checkboxes       = new Array(3);
	cycling          = new Array(3);
	rotationMatrices = new Array(3);
	for (var i = 0; i < sliders.length; i++) {
		sliders[i]          = new Array(4);
		angles[i]           = new Array(4);
		checkboxes[i]       = new Array(4);
		cycling[i]          = new Array(4);
		rotationMatrices[i] = new Array(4);
		for (var j = 0; j < sliders[i].length; j++) {
			var td = createElement("td")
					.parent(trSliders[i + 1]);
			if ((i != j) && (i < j)) {
				sliders[i][j] = createSlider(-1, 1, 0, 0.01)
							   .value(0)
					  		   .parent(td)
							   .input(updateAngle)
							   .attribute("ondblclick", 'resetAngle('+i+','+j+')');
				checkboxes[i][j] = createCheckbox();
				checkboxes[i][j].parent(td);
				checkboxes[i][j].attribute("id", 'cb_'+i+'_'+j)
				checkboxes[i][j].attribute("onchange", 'pressCycle('+i+','+j+')');
				cycling[i][j] = false;
				rotationMatrices[i][j] = rotationMatrix([i,j],0);
				angles[i][j] = 0;
			}
		}
	}
	
	// Options
	var divOptions = select("#options");
	var btnReset = createButton("Reset")
				  .parent(divOptions)
				  .mouseClicked(resetAllAngles);
				  
	btnRandom = createButton("Random")
				   .parent(divOptions)
				   .mouseClicked(pressRandom);
		
	// Refactor this later !
    points[0] = new P4Vector(-1, -1, -1, 1);
    points[1] = new P4Vector(1, -1, -1, 1);
    points[2] = new P4Vector(1, 1, -1, 1);
    points[3] = new P4Vector(-1, 1, -1, 1);
    points[4] = new P4Vector(-1, -1, 1, 1);
    points[5] = new P4Vector(1, -1, 1, 1);
    points[6] = new P4Vector(1, 1, 1, 1);
    points[7] = new P4Vector(-1, 1, 1, 1);
    points[8] = new P4Vector(-1, -1, -1, -1);
    points[9] = new P4Vector(1, -1, -1, -1);
    points[10] = new P4Vector(1, 1, -1, -1);
    points[11] = new P4Vector(-1, 1, -1, -1);
    points[12] = new P4Vector(-1, -1, 1, -1);
    points[13] = new P4Vector(1, -1, 1, -1);
    points[14] = new P4Vector(1, 1, 1, -1);
    points[15] = new P4Vector(-1, 1, 1, -1);
	
}

function draw() {

    background(220);
	strokeWeight(3);
	stroke(10);
	noFill();

    var projected3d = [];
	var transform   = transformStack();

    for (var i = 0; i < points.length; i++) {
		
		// Transform chain
		var rotated = points[i].toMatrix();
		for (var t = 0; t < transform.length; t++) 
			rotated = transform[t].mult(rotated);
		
        var d = 2;
        var w = 1 / (d - rotated.get(3,0));
		
        var proj = projectionMatrix(w);
        var projected = proj.mult(rotated).mult(width / 10);
        projected3d[i] = projected.mtx;
				
    }
	
    // Connecting
	for (var o = 0; o <= 8; o += 8)
		for (var i = 0; i < 4; i++) {
			connect(o, i, (i + 1) % 4, projected3d);
			connect(o, i + 4, ((i + 1) % 4) + 4, projected3d);
			connect(o, i, i + 4, projected3d);
		}
    for (var i = 0; i < 8; i++)
        connect(0, i, i + 8, projected3d);
	
	// Cycle randomization
	if (randomize)
		if (cpt++ >= skipRandom) {
			randomizeCycling(0.15);
			cpt = 0;
		}
	// Cycling
	cycleAngles(0.01);
	
}

function connect(offset, i, j, points) {
    const a = points[i + offset];
    const b = points[j + offset];
    line(a[0][0], a[1][0], a[2][0], b[0][0], b[1][0], b[2][0]);
}

/************************ Angles *********************/

function updateAngle() {
	
	for (var i = 0; i < sliders.length; i++)
		for (var j = 0; j < sliders[i].length; j++)
			if (sliders[i][j] != null) {
				var v = sliders[i][j].value() * PI;
				if (v != angles[i][j]) {
					rotationMatrices[i][j] = rotationMatrix([i,j], v);
					angles[i][j]           = v;
					break;
				}
			}
			
}

function cycleAngles(d) {
	const twoPi = 2 * PI;
	for (var i = 0; i < cycling.length; i++)
		for (var j = 0; j < cycling[i].length; j++)
			if (cycling[i][j] == true)
				resetAngle(i, j, (angles[i][j] + d + twoPi) % twoPi);
}

function resetAngle(i, j, val) {
	if (val == null)
		val = 0;
	sliders[i][j].value(map(val, -2 * PI, 2 * PI, -1, 1));
	angles[i][j] = val;
	rotationMatrices[i][j] = rotationMatrix([i,j], val);
}

function resetAllAngles() {
	for (var i = 0; i < angles.length; i++)
		for (var j = 0; j < angles[i].length; j++)
			if ((angles[i][j] != null) && (angles[i][j] != 0))
				resetAngle(i, j);		
}

function randomizeCycling(percent) {
	for (var i = 0; i < cycling.length; i++)
		for (var j = 0; j < cycling[i].length; j++)
			if (cycling[i][j] != null)
				if (random() < percent)
					pressCycle(i,j);
}

/*********************** Buttons **********************/

function pressRandom() {
	randomize = !randomize;
	if (randomize)
		btnRandom.style("border-style", "inset");
	else {
		btnRandom.style("border-style", "outset");
		for (var i = 0; i < cycling.length; i++)
			for (var j = 0; j < cycling[i].length; j++)
				if (cycling[i][j] != null)
					cycling[i][j] = false;
	}
}

function pressCycle(i, j) { cycling[i][j] = !cycling[i][j]; }

/*********************** Matrix ***********************/

function rotationMatrix(axis, angle) {
	
	var m = identityMatrix(4);
	
	m.mtx[axis[0]][axis[0]] = cos(angle);
	m.mtx[axis[0]][axis[1]] = -sin(angle);
	m.mtx[axis[1]][axis[0]] = sin(angle);
	m.mtx[axis[1]][axis[1]] = cos(angle);
	
	return m;
	
}

function projectionMatrix(w) {
	
	var m = identityMatrix(3, w);
	for (var i = 0; i < m.mtx.length; i++)
		m.mtx[i].push(0);
	return m;
	
}

function identityMatrix(order, val) {
	
	if (val == null)
		val = 1;
	
	var m = new Matrix(order, order);
	for (var i = 0; i < order; i++)
		m.mtx[i][i] = val;
	return m;
	
}


function transformStack() {
	
	var stack = [];
	
	for (var i = 0; i < angles.length; i++)
		for (var j = 0; j < angles[i].length; j++) {
			var a = angles[i][j];
			if ((a != null) && (a != 0))
				stack.push(rotationMatrices[i][j]);
		}
	
	return stack;
	
}