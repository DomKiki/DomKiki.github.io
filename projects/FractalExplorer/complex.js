class Complex {
	
	constructor(re, im) {
		this.setValue(re, im);
	}
	
	setValue(re, im) {
		this.re = re;
		this.im = im;
		this.updateMag();
	}
	
	updateMag() {
		this.mag = Math.sqrt(Math.pow(this.re, 2) + Math.pow(this.im, 2));
	}
	
	add(c) {
		var real = this.re + c.re;
		var img  = this.im + c.im;
		this.setValue(real, img);
		return this;
	}
	
	mult(c) {
		var real = this.re * c.re - (this.im * c.im);
		var img  = this.im * c.re + this.re * c.im;
		this.setValue(real, img);
		return this;
	}
	
	toString() {
		var str = "" + this.re;
		if (this.im > 0) 
			str += " + " + this.im + "i";
		else if (this.im < 0)
			str += " - " + (-this.im) + "i";
		return str;
	}
	
	copy() { return new Complex(this.re, this.im); }
	
}