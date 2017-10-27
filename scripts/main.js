$(function(){
	var $theBlack = $('#theBlack');
	var x = 0;
	var y = 0;
	var pX = 0;
	var pY = 0;
	var dots = [
		{
			x: 0,
			y: 0
		}
	];

	function getCoordinates(){
		x = event.clientX;
		y = event.clientY;
		// console.log('x', x, 'y', y);
	}

	function percentCoordinates(){
		pX = parseInt((x / window.innerWidth) * 100);
		pY = parseInt((y / window.innerHeight) * 100);
		// console.log('pX', pX, 'pY', pY);
	}

	function createDot(){
		// $theBlack.append("<div class='dot' id='dot" + i + "'></div>")
	}

	function pushCoordinates(){
		dots.push({x: pX, y: pY});
		console.log(dots);
		createDot();
	}

	$theBlack.on('click.black', function(){
		// console.log('click');
		getCoordinates();
		percentCoordinates();
		pushCoordinates();
	});

});