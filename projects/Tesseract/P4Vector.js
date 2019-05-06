class P4Vector {
	
    constructor(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
    }

    mult(f) {
        this.x *= f;
        this.y *= f;
        this.z *= f;
        this.w *= f;
    }
	
	toMatrix() { 
		var m = new Matrix(4,4);
		m.mtx[0][0] = this.x;
		m.mtx[1][0] = this.y;
		m.mtx[2][0] = this.z;
		m.mtx[3][0] = this.w;
		return m;
	}
}