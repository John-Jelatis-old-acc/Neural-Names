(function(self) {
	'use strict';

	var guys, gals, loadFile; // Data Set
	var idx, fix; // Fix Data
	var train, guess, weights; // AI Guess/Learn
	var team; // Known
	var learning_rate; // cfg

	loadFile = function(uri) {
		// Apple
		// Microsoft
		var xhr;
		xhr = new XMLHttpRequest();
		xhr.open('GET', uri, false);
		xhr.send();
		return (xhr.responseText);
	};

	guys = JSON.parse(loadFile('dataset/male.json'));
	gals = JSON.parse(loadFile('dataset/female.json'));

	fix = function(mode, text) {
		var ret, idx;
		switch(mode) {
			case 'arr':
				ret = new Array(11);
				for(idx = 0; idx < ret.length; idx++) {
					ret[idx] = idx >= text.length ?
						0 : text.charCodeAt(idx);
				}
				break;
			case 'txt':
				ret = '';
				for(idx = 0; idx < text.length; idx++) {
					ret += text[idx];
				}
				break;
		}
		return ret;
	};

	idx = 0;

	for(idx = 0; idx < gals.length; idx++) gals[idx] = fix('arr', gals[idx]);
	for(idx = 0; idx < guys.length; idx++) guys[idx] = fix('arr', guys[idx]);

	learning_rate = .1;
	weights = Array.from({ 'length': 11 }, function() { return 0; });

	guess = function(weights, name) {
		var sum, idx;
		sum = 0;
		for(idx = 0; idx < 11; idx++) {
			sum += name[idx] * weights[idx];
		}
		return sum >= 0 ? 1. : -1.;
	};

	train = function(weight, name, ans) {
		var err, guessRet, ret, idx;
		guessRet = guess(weight, name);
		err = (ans - guessRet) * learning_rate;
		ret = [ ];
		for(idx = 0; idx < 11; idx++) {
			ret[idx] = weight[idx] + name[idx] * err;
		}
		return ret;
	};

	team = function(name) {
		return gals.includes(name) ? -1. : 1.;
	};

	for(idx = 0; idx < 250; idx++) {
		weights = train(train(weights, gals[idx % gals.length], -1), guys[idx % guys.length], 1);
	}

	console.info('You can use `guess(\'name\') to test other names.');
	console.info('Here is a couple of tests: ');

	for(name of ['Kieran', 'Martin', 'Apple'])
		console.debug(name + " is: " + ((
			guess(weights, fix('arr', name))
		) === 1 ? 'male' : 'female'));


	console.info('Network info: \nWeights are set to ' + JSON.stringify(weights, null, 4)
		 + '; after ' + idx + ' iterations.\nThere are ' + guys.length + ' guys and '
		 + gals.length + ' girls in the sample size.');

	self.guess = function(n) { return guess(weights, fix('arr', n)) === 1 ? 'male' : 'female'; };
})(this);