$(function(){
	// Binding
	var $theBlack = $('#theBlack');
	var $style = $('style');
	var $window = $(window);
	var $help = $('#help');
	var $helpText = $('#helpText');

	// Initialise variables.
	var showHelp = 0;
	var x = 0;
	var y = 0;
	var user = Date.now();
	var userColour = null;
	var dots = [];
	var initialDataLoaded = false;

	// Initialise sounds
	var chime1 = new Howl({
  	src: ['./sounds/chime1.mp3']
	});
	var chime2 = new Howl({
  	src: ['./sounds/chime2.mp3']
	});
	var chime3 = new Howl({
  	src: ['./sounds/chime3.mp3']
	});
	var chime4 = new Howl({
  	src: ['./sounds/chime4.mp3']
	});
	var chime5 = new Howl({
  	src: ['./sounds/chime5.mp3']
	});

	var userSound = Math.floor(Math.random() * 5) +1

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

	// Set colour of the user. Array of colours, pick from array.
	function setColour(){
		var colours = [
			'#F8F087',
			'#B7E3C0',
			'#B8D0DD',
			'#F39DD4',
			'#FFA398'
		];

		userColour = colours[Math.floor(Math.random() * 4)];
	}
	setColour();
	console.log('userColour', userColour);

	// Get the coordinates of the mouse.
	function getCoordinates(){
		x = parseInt((event.clientX / window.innerWidth) * 100);
	 	y = parseInt((event.clientY / window.innerHeight) * 100);
		// console.log('x', x, 'y', y);
	}

	// Creates a dot.
	function createDot(id, xVal, yVal, colour, sound){
		$theBlack.append("<div class='dot' id='" + id + "'></div>");
		$("#" + id).css({
			"background-color": colour,
			"animation-name": "dot" + id,
			"animation-duration": "4s"
		});
		var coordinates = percentageToCoord(xVal, yVal);
		var startXPosition = (coordinates.x - 5);
		var startYPosition = (coordinates.y - 5);
		var endXPosition = (coordinates.x - 100);
		var endYPosition = (coordinates.y - 100);
		$style.append("@keyframes dot" + id + " { 0%{ width: 10px; height: 10px; border-radius: 10px; opacity: 1; top: " + startYPosition + "px; left: " + startXPosition + "px; } 100%{ width: 200px; height: 200px; border-radius: 300px; opacity: 0; top: " + endYPosition + "px; left: " + endXPosition + "px; } }");
		switch (sound) {
			case 1:
				chime1.play();
				break;
			case 2:
				chime2.play();
				break;
			case 3:
				chime3.play();
				break;
			case 4:
				chime4.play();
				break;
			case 5:
				chime5.play();
				break;
		}
		setTimeout(function(){
			$("#" + id).remove();
		}, 4000);
	}

	// Turns incoming percentage coordinates into pixel coordinates for that browser window.
	function percentageToCoord(xPercent, yPercent){
		var returnCoord = {};
		var windowHeight = $window.height();
		var windowWidth = $window.width();

		returnCoord["x"] = parseInt((xPercent / 100) * windowWidth);
		returnCoord["y"] = parseInt((yPercent / 100) *  windowHeight);

		return returnCoord;

	}

	// Creates an object to add to the local array and sends it to the database.
	function pushCoordinates(id){
		dots.push({
			dot: id,
			user: user,
			userColour: userColour,
			userSound: userSound,
			x: x,
			y: y
		});
		// console.log(dots);
		database.set(dots);
	}

	function showHelpText(){
		console.log('show');
		$helpText.css({
			"display": "block"
		});
		$help.html('<span><a href="#">X</a></span>').css({
			"color": "white"
		});
		showHelp = 1;
	}

	function hideHelpText(){
		console.log('hide');
		$helpText.css({
			"display": "none"
		});
		$help.html('<span><a href="#">?</a></span>').css({
			"color": "#202020"
		});
		showHelp = 0;
	}

	// Creates object with database from firebase.
	const database = firebase.database().ref();

	// Checks for new data in database and if there is, creates dots for new data.
	database.on("child_added", snapshot => {
		if (initialDataLoaded) {
    	var dataNew = snapshot.val();
    	console.log(dataNew);
			if (dataNew.user !== user) {
				createDot(dataNew.dot, dataNew.x, dataNew.y, dataNew.userColour, dataNew.userSound);
			}
  	} else {
  	}
	});

	// First call for database.
	database.on("value", snapshot => {
		const data = snapshot.val();
		console.log('new data', data);
		// database.set(dots);
		dots = data;
		initialDataLoaded = true;
	});

	// When a user clicks, push the coordinates to the database and create the dot.
	$theBlack.on('click.black', function(){
		// console.log('click');
		date = Date.now();
		getCoordinates();
		pushCoordinates(date);
		createDot(date, x, y, userColour, userSound);
	});

	// Click on help shows div. Otherwise hides it.
	$help.on('click.help', function(){
		if (showHelp === 0){
			showHelpText();
			console.log('showHelp is true');
		} else {
			hideHelpText();
			console.log('showhelp is false');
		}
	});

	// Cycle through and remove old data.
	setInterval (function(){
		database.orderByValue().on("value", snapshot => {
			snapshot.forEach(function(data) {
				var key = data.key;
				if (key !== '0'){
					data.ref.remove();
				}
  		});
		});
	}, 10000);

});

// TODO: create gitignore - add node_module and .Ds_Store
// TODO: create readme file - what it is, install, test it and run it
// TODO: create s3 pocket and put chimes in there
