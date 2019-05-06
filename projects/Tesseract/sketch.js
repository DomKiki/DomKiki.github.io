var angle = 0;

var points = [];

var sldXY, sldXZ, sldYZ, sldXW, sldYW, sldZW;

function setup() {
	
    var canvas = createCanvas(800, 600, WEBGL);
	canvas.parent("canvas");
	
	var slidersDiv = select("#sliders");
	sldXY = select("#sldXY");
	sldXZ = select("#sldXZ");
	sldYZ = select("#sldYZ");
	sldXW = select("#sldXW");
	sldYW = select("#sldYW");
	sldZW = select("#sldZW");
	
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

    background(0);
    rotateX(-PI / 2);
    var projected3d = [];

	stroke(255, 200);
	noStroke();
	noFill();

	var transform = [];
	
	// Put them in an array and parse it
	if (sldXY.value() != 0)
		transform.push(rotationMatrix([0,1], sldXY.value()));
	if (sldXZ.value() != 0)
		transform.push(rotationMatrix([0,2], sldXZ.value()));
	if (sldYZ.value() != 0)
		transform.push(rotationMatrix([1,2], sldYZ.value()));
	if (sldXW.value() != 0)
		transform.push(rotationMatrix([0, 3], sldXW.value()));
	if (sldYW.value() != 0)
		transform.push(rotationMatrix([1, 3], sldYW.value()));
	if (sldZW.value() != 0)
		transform.push(rotationMatrix([2, 3], sldZW.value()));
	
    for (var i = 0; i < points.length; i++) {
		
		// Transform chain
		var rotated = points[i].toMatrix();
		for (var t = 0; t < transform.length; t++) 
			rotated = transform[t].mult(rotated);
		
        var d = 2;
        var w = 1 / (d - rotated.get(3,0));
		
        var proj = projectionMatrix(w);
        var projected = proj.mult(rotated).mult(width / 8);
        projected3d[i] = projected.mtx;
        
        point(projected.get(0,0), projected.get(1,0), projected.get(2,0));
				
    }
	
    // Connecting
	strokeWeight(4);
    stroke(255);
	for (var o = 0; o <= 8; o += 8)
		for (var i = 0; i < 4; i++) {
			connect(o, i, (i + 1) % 4, projected3d);
			connect(o, i + 4, ((i + 1) % 4) + 4, projected3d);
			connect(o, i, i + 4, projected3d);
		}
	
    for (var i = 0; i < 8; i++) {
        connect(0, i, i + 8, projected3d);
    }
	
}

function connect(offset, i, j, points) {
    const a = points[i + offset];
    const b = points[j + offset];
    line(a[0][0], a[1][0], a[2][0], b[0][0], b[1][0], b[2][0]);
}

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