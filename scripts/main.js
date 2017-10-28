$(function(){
	var $theBlack = $('#theBlack');
	var x = 0;
	var y = 0;
	var dots = [];

	function getCoordinates(){
		x = parseInt((event.clientX / window.innerWidth) * 100);
	 	y = parseInt((event.clientY / window.innerHeight) * 100);
		// console.log('x', x, 'y', y);
	}

	function createDot(){
		// $theBlack.append("<div class='dot' id='dot" + i + "'></div>")
	}

	function pushCoordinates(){
		dots.push({x: x, y: y});
		// console.log(dots);
		createDot();
	}

	$theBlack.on('click.black', function(){
		// console.log('click');
		getCoordinates();
		pushCoordinates();
	});

});
