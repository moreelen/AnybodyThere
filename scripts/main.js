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

	// Get the coordinates of the mouse.
	function getCoordinates(){
		x = parseInt((event.clientX / window.innerWidth) * 100);
	 	y = parseInt((event.clientY / window.innerHeight) * 100);
		// console.log('x', x, 'y', y);
	}

// Creates a dot.
	function createDot(id, xVal, yVal){
		$theBlack.append("<div class='dot' id='" + id + "'></div>");
		$("#" + id).css({
			"top": yVal + "%",
			"left": xVal + "%"
		});
	}

	// Creates an object to add to the local array and sends it to the database.
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

	// Creates object with database from firebase.
	const database = firebase.database().ref();

	// Checks for new data in database and if there is, creates dots for new data.
	database.on("child_added", snapshot => {
		if (initialDataLoaded) {
    	var dataNew = snapshot.val();
    	console.log(dataNew);
			if (dataNew.user !== user) {
				createDot(dataNew.dot, dataNew.x, dataNew.y);
			}
  	} else {
  	}
	});

	// First call for database.
	database.on("value", snapshot => {
		const data = snapshot.val();
		console.log('new data', data);
		dots = data;
		initialDataLoaded = true;
	});

	// When a user clicks, push the coordinates to the database and create the dot.
	$theBlack.on('click.black', function(){
		// console.log('click');
		date = Date.now();
		getCoordinates();
		pushCoordinates(date);
		createDot(date, x, y);
	});

	// Cycle through and remove old data.
	setInterval (function(){
		var now = Date.now();
		var cutoff = now - 3600000;
		var old = database.orderByChild('dot').endAt(cutoff).limitToLast(1);
		old.on('child_added', function(snapshot) {
    	snapshot.ref.remove();
		});
	}, 5000);

});

// Sam Browne
// Josh Unsworth
// Roman
// Liv
// Josh Balfour
// Sophie
// Georgia
