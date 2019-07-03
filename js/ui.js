(function(self) {
	var inp, out, lastName, it;

	self.addEventListener('DOMContentLoaded', function() {
		inp = document.getElementById('name');
		out = document.getElementById('gender');
		if(typeof guess === 'undefined') return;
		setInterval(function() {
			it = (inp.innerText.match(/([a-zA-Z]| )/g) || [ '' ]).join('');
			if(it !== lastName) {
				lastName = it;
				out.innerText = guess(inp.innerText);
			}
		}, 20);
	});
})(this);