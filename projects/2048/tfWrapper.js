class TensorFlowWrapper {

	constructor(inp, hid, out, model) {
	
		this.input_n  = inp;
		this.hidden_n = hid;
		this.output_n = out;
		
		if (model instanceof tf.Sequential)
			this.model = model;
		else
			this.model = this.createModel();
	
	}
	
	createModel() {
		
		return tf.tidy(() => {
			const hidden = createDense(this.hidden_n, [this.input_n], 'sigmoid');
			const output = createDense(this.output_n, null,           'softmax');
			const model  = tf.sequential();
			const opt_op = tf.train.adam(0.2);
			model.add(hidden);
			model.add(output);
			model.compile({ loss: 'meanSquaredError', optimizer: opt_op });
			return model;
		});
		
	}
	
	predict(inputs) {
		//return tf.tidy(() => {
			const xs = tf.tensor2d([inputs]);
			const ys = this.model.predict(xs);
			return ys.dataSync();
		//});
	}
	
	computeError(pred, expected) {
		var e = 0;
		for (var i = 0; i < expected.length; i++)
			e += pow(expected[i] - pred[i], 2);
		return sqrt(e);
	}
	
	train(inputs, expected) {
		//tf.tidy(() => {
			const xs = tf.tensor2d([inputs]);
			const ys = tf.tensor2d([expected]);
			this.model.fit(xs, ys);
		//});
	}
	
	clone() {
		return tf.tidy(() => {
			var cln = this.createModel();
			cln.setWeights(this.model.getWeights().slice());
			return new TensorFlowWrapper(this.input_n, this.hidden_n, this.output_n, cln);
		});
	}
	
	reproduce(mate) {
		
		const wgt1 = this.model.getWeights();
		const wgt2 = mate.model.getWeights();
		if (wgt1.length != wgt2.length)
			return null;
		
		const chd = this.clone();
		var newWgt = [],
			target, ten, shp, val;
		for (var i = 0; i < wgt1.length; i++) {
			target    = (random() < 0.5) ? wgt1 : wgt2;
			ten       = target[i];
			newWgt[i] = tf.tensor(ten.dataSync().slice(), ten.shape);
		}
		chd.model.setWeights(newWgt);
		
		return chd;
		
	}
	
	mutate(rate, max) {
		const wgt = this.model.getWeights();
		var   mut = [],
			  ten, shp, val;
		for (var i = 0; i < wgt.length; i++) {
			ten = wgt[i];
			shp = wgt[i].shape;
			val = ten.dataSync().slice();
			if (random() < rate)
				for (var j = 0; j < val.length; j++)
					val[j] += randomGaussian(0, max);
			mut[i] = tf.tensor(val, shp);
		}
		this.model.setWeights(mut);
	}

}

function createDense(unt, shp=null, act) { 
	var opt = {
			units:      unt,
			inputShape: shp,
			activation: act };
	if (shp == null)
		delete opt.inputShape;
	return tf.layers.dense(opt);
}