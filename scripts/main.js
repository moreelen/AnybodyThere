$(function(){
	var $theBlack = $('#theBlack');
	var x = 0;
	var y = 0;
	var user = Date.now();
	var dots = [];
	var initialDataLoaded = false;

	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB99P0R8EE0HYoy-KieWM4ortK_8pByuoA",
    authDomain: "anybodythere-6fa78.firebaseapp.com",
    databaseURL: "https://anybodythere-6fa78.firebaseio.com",
    projectId: "anybodythere-6fa78",
    storageBucket: "",
    messagingSenderId: "179730851220"
  };
  firebase.initializeApp(config);

	function getCoordinates(){
		x = parseInt((event.clientX / window.innerWidth) * 100);
	 	y = parseInt((event.clientY / window.innerHeight) * 100);
		// console.log('x', x, 'y', y);
	}

	function createDot(id, xVal, yVal){
		$theBlack.append("<div class='dot' id='" + id + "'></div>");
		$("#" + id).css({
			"top": yVal + "%",
			"left": xVal + "%"
		});
	}

	function pushCoordinates(id){
		dots.push({
			dot: id,
			user: user,
			x: x,
			y: y
		});
		// console.log(dots);
		database.set(dots);
	}

	const database = firebase.database().ref();

	database.on("child_added", snapshot => {
		if (initialDataLoaded) {
    	var dataNew = snapshot.val();
    	console.log(dataNew);
			if (dataNew.user !== user) {
				createDot(dataNew.date, dataNew.x, dataNew.y);
			}
  	} else {
  	}
	});

	database.on("value", snapshot => {
		const data = snapshot.val();
		console.log('new data', data);
		dots = data;
		initialDataLoaded = true;
	});

	$theBlack.on('click.black', function(){
		// console.log('click');
		date = Date.now();
		getCoordinates();
		pushCoordinates(date);
		createDot(date, x, y);
	});

});

// If length of data is larger than dots. Difference = newdots.
// Grab the latest in data.

// Sam Browne
// Josh Unsworth
// Roman
// Liv
// Josh Balfour
// Sophie
// Georgia
