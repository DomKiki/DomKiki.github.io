class Matrix {

	constructor(h, w) {
		this.mtx = [];
		for (var i = 0; i < h; i++)
			this.mtx[i] = new Array(w).fill(0);
	}
	
	mult(b) {
		
		var res;
		
		if (b instanceof P4Vector)
			return this.mult(b.toMatrix());
		
		else if (b instanceof Matrix){
		
			var rowsA = this.mtx.length,
				colsA = this.mtx[0].length,
				rowsB = b.mtx.length,
				colsB = b.mtx[0].length;
			
			res = new Matrix(rowsA, colsB);

			if (colsA !== rowsB) {
				console.error("Columns of A must match rows of B");
				return null;
			}

			var s;
			for (var i = 0; i < rowsA; i++) {
				res.mtx[i] = [];
				for (var j = 0; j < colsB; j++) {
					s = 0;
					for (var k = 0; k < colsA; k++)
						s += this.mtx[i][k] * b.mtx[k][j];
					res.mtx[i][j] = s;
				}
			}		
		}
		
		else {
			res = new Matrix(this.mtx.length, this.mtx[0].length);
			for (var i = 0; i < this.mtx.length; i++)
				for (var j = 0; j < this.mtx[i].length; j++)
					res.mtx[i][j] = this.mtx[i][j] * b;
		}
		
		return res;
		
	}

	print() {
		var str = "";
		for (var i = 0; i < this.mtx.length; i++) {
			str += " | ";
			for (var j = 0; j < this.mtx[i].length; j++)
				str += this.mtx[i][j] + "\t";
			str += " |\r\n";
		}
		console.log(str);			
	}
	
	get(i, j) { return this.mtx[i][j] };
	
}