// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit. Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: false});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
//camera.position.set(0, 100, -40); // Position camera in x,y,z
//camera.up = new THREE.Vector3(0,0,1);
//camera.lookAt(new THREE.Vector3(0,10,0));
//camera.lookAt(new THREE.Vector3(0,1,-1)); // Look right north, i.e. z. Didn't work.
// Todo: Manage to change start rotation of camera. (low prio) This don't work: camera.rotation.set(0,0.5,0); // camera.rotation.y = 90 * Math.PI / 180;
//camera.rotation.set(0,0,-10);


// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

//controls.target = new THREE.Vector3(0, 0, -10);
//controls.target.set(0, 0, -10);
//controls.update();


// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

// Debug prints points in 3 axis (green x, red y, blue z):
/* 
var axissize = 0.1;
var geometry = new THREE.BoxGeometry( axissize, axissize, axissize );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var material2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var material3 = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
//var origocube = new THREE.Mesh( geometry, material ); origocube.position.set(0,0,0); scene.add(origocube);
for ( var i = -10; i < 10; i ++ ) {
	var xcube = new THREE.Mesh( geometry, material );
	var ycube = new THREE.Mesh( geometry, material2 );
	var zcube = new THREE.Mesh( geometry, material3 );
	xcube.position.set(i*10,0,0);
	ycube.position.set(0,i*10,0);
	zcube.position.set(0,0,i*10);
	scene.add(xcube);
	scene.add(ycube);
	scene.add(zcube);
}
*/

// Reticulum. Have an object react when user looks at it. Track the object
function addReticulum(obj) {
	Reticulum.add( obj, {
		fuseVisible: true
		/*onGazeOver: function(){ // obj.material.emissive.setHex( 0xffcc00 ); },
		onGazeOut: function(){	  // obj.material.emissive.setHex( 0xcc0000 ); },
		onGazeLong: function(){	  // obj.material.emissive.setHex( 0x0000cc ); },
		onGazeClick: function(){  // obj.material.emissive.setHex( 0x00cccc * Math.random() ); } 	// have the object react when user clicks / taps on targeted object
		*/
	});
}


// Database connection
var panoramasArray = [];
var scene_filename;
var scene_nr = 0;
var counter = 0;
/*
<?php
//if($_GET['collection']!=""){
//	$mycollection = $_GET['collection'];
//} else {
	$mycollection = "VR Museum_old";
//}
if($_GET['thepath']!=""){
	$thepath = "../" . $_GET['thepath'] . "/";
} else {
	$thepath = "";
}
if($_GET['sid']!=""){
	$scene_id = $_GET['sid'];
} else {
	$scene_id = 0;
}
$servername = "inceptive-178573.mysql.binero.se";
$username = "178573_ob49380";
$password = "inceptive2016";
$dbname="178573-inceptive";
$mysqli = new mysqli($servername, $username, $password, $dbname);
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}
$sql  = 'SELECT * FROM `photo` ';
$sql  .= 'WHERE `collectiontitle` = ? '; 
$sql .= 'ORDER BY `score` DESC';
$stmt = $mysqli->stmt_init();

if ($stmt->prepare($sql)) {
    $stmt->bind_param("s", $mycollection);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
?>
		panoramasArray.push(<? echo $row["id"]; ?>);	//Result: ["1", "2", "4"];
		if(counter==<? echo $scene_id; ?>){
			scene_filename = <? echo $row["id"]; ?>;
			scene_nr = counter;
		}
		counter=counter + 1;
<?
	}
    $result->free();
}
$mysqli->close();
?>
*/

// CREATE 3D OBJECTS: *********************
var ui_elems = [
  // Cone
  { // XMb size
	name: "Chair 1",
	path: "images/cone/",
	thumb: "",
	obj: "cone2_obj.obj",
	mtl: "cone2_obj.mtl",
	format: 'objmtl',
	scale: 0.15,
	translate: new THREE.Vector3(0, 0, 0)
  }
  ]	
  
var gen_path = "../uploads/";
var theradius = 1000;

// Todo: Fetch images from their url source on internet. Do like google image search.
// Note. Use Photoshop automate to create smaller thumbnails.

// CUBE:
var geometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
var material = new THREE.MeshNormalMaterial();
var cube1 = new THREE.Mesh(geometry, material);
cube1.position.set(0, 0, 1);
scene.add(cube1); // Add cube mesh to your three.js scene

// CONES 
var startz = -30;
var spacing = 20
var coneheight = -15


function lat2z(lat){  // "breddgrad" that is how far north we are. lat = z. long = x. Y = upwards in the air.
    var R = 6.378137; // Radius of earth in meters / 10.000.000 to compensate for 0.1 microdegrees
    return -R * lat * Math.PI/180; // meters
}
function long2x(long1){  
    var R = 6.378137; // Radius of earth in meters  / 10.000.000 to compensate for 0.1 microdegrees
    var test = R * long1 * Math.PI/180; // meters
    return test
}

// The track is from south to north and back south again.
// 5 cones + startcones.
track_long = 127813750; // how far east the track is.
var zeroz = lat2z(577775376);  // cone 3 is origo of the 3d world
var zerox = long2x(track_long);
var z0 = lat2z(577771980) - zeroz; // Startpos. Most south
var x0 = long2x(track_long) - zerox;
var z1 = lat2z(577773112) - zeroz; 
var x1 = long2x(track_long) - zerox; 
var z2 = lat2z(577774244) - zeroz; 
var x2 = long2x(track_long) - zerox;
var z4 = lat2z(577776508) - zeroz; 
var x4 = long2x(track_long) - zerox; 
var z5 = lat2z(577777640) - zeroz; // most north
var x5 = long2x(track_long) - zerox; 


console.log("zeroz=" + zeroz);
console.log("zerox=" + zerox);
console.log("z5=" + z5);
console.log("x5=" +x5);

loadItem(ui_elems[0], function(model) { scene.add(model) }, x0-3, coneheight, z0)	// 2 startcones. South.
loadItem(ui_elems[0], function(model) { scene.add(model) }, x0+3, coneheight, z0)	
loadItem(ui_elems[0], function(model) { scene.add(model) }, x1, coneheight, z1)	
loadItem(ui_elems[0], function(model) { scene.add(model) }, x2, coneheight, z2)	
loadItem(ui_elems[0], function(model) { scene.add(model) }, 0, coneheight, 0)	
loadItem(ui_elems[0], function(model) { scene.add(model) }, x4, coneheight, z4)	
loadItem(ui_elems[0], function(model) { scene.add(model) }, x5, coneheight, z5)	

function loadItem(item, callback, xpos, ypos, zpos) {
	var loader = new THREE.OBJMTLLoader();
	//console.log(loader)
	loader.load(item.path + item.obj, item.path + item.mtl, function (obj) {
	  //console.log(obj)
	  obj.scale.set(item.scale,item.scale,item.scale);
	  obj.position.set(xpos, ypos, zpos);
	  callback(obj)
	})
}

// ASTAZERO GROUND
var floorTexture = new THREE.ImageUtils.loadTexture("images/asphaltcloseups0106s.png");
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 50, 50 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide} ); // transparent: true, opacity: 0.6 
var floorGeometry = new THREE.PlaneGeometry(theradius*2, theradius*2, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
//loor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
floor.position.set(0, -18, 0);
floor.rotateZ(59*Math.PI/180);
scene.add(floor);


// SPHERE
// "Equirectangular": Should be preferrably by power of 2, and large like 4096x4096). Examples: http://onyxcrab.azurewebsites.net/
// https://en.wikipedia.org/wiki/Panoramic_photography#Full_rotation   http://www.airpano.com/360-videos.php  http://www.panoramio.com/
// Can convert image (http://www.instructables.com/id/How-to-Modify-an-Image-to-Stereographic-Projection/step7/Apply-the-stereographic-projection/) or stereographic mapping ()
var textureLoader = new THREE.TextureLoader();
textureLoader.load(gen_path + panoramasArray[1] + ".jpg", function(t){
	loadedTexture = t;
});
var sphere0 = new THREE.SphereGeometry(theradius, theradius, 40);
sphere0.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
//var sphereMaterial0 = new THREE.MeshBasicMaterial();

var sphereMaterial0 = new THREE.MeshBasicMaterial( {
	//side: THREE.DoubleSide,
	transparent: true,
	opacity: 1,
	map: THREE.ImageUtils.loadTexture("images/astazero-arena.jpg") //(gen_path + "stars.png");
});
var sphereMesh0 = new THREE.Mesh(sphere0, sphereMaterial0);
sphereMesh0.position.set(0, 0, 0);
sphereMesh0.rotateY(120*Math.PI/180); // due to the sphere image was taken 60 degrees rotated.
scene.add(sphereMesh0);


// MENU OPTION (CYLINDER SHAPED)
var radius = 150;
var height = 10;
var menuoption_width = 4;
var menuoption_space = 1;
var cubes = new THREE.Object3D();
for(var i = 0; i < panoramasArray.length; i++ ) {
	var geometry = new THREE.CylinderGeometry( radius, radius, height, 60, 1, true, ((180-(menuoption_width+menuoption_space)*panoramasArray.length*0.5)+i*(menuoption_width+menuoption_space)-1)*Math.PI/180, menuoption_width*Math.PI/180 ); // radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength
	geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) ); // flips the faces of the cylinder so they faces inwards
	var grayness =  1; //Math.random() * 0.5 + 0.25;
	var material = new THREE.MeshBasicMaterial( {
		transparent: true,
		map: THREE.ImageUtils.loadTexture(gen_path  + panoramasArray[i] + "t.jpg"), // "thumbs/" + panoramasArray[i] + ".jpg"),
		color: (1,1,1)
	});
	var cube = new THREE.Mesh( geometry, material );
	cube.grayness = grayness;
	cube.imagenr = i;
	addReticulum(cube);
	cube.position.set(0, 21, 80); // Relates to "radius" above, and "thetalength". This is the center of the cylinder with radius 150.
	cubes.add( cube );
}
//scene.add(cubes);

// MENU BACKGROUND
var bggeometry = new THREE.CylinderGeometry( radius, radius, height+4, 60, 1, true, (180-(menuoption_width+menuoption_space)*panoramasArray.length*0.5+menuoption_space)*Math.PI/180, ((menuoption_width+menuoption_space)*panoramasArray.length+menuoption_space*0.5)*Math.PI/180 ); // radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength (calculated from right to left)
var bgmaterial = new THREE.MeshBasicMaterial( {
	side: THREE.DoubleSide,
	color: 0x000000,
	transparent: true,
	opacity: 0.6
});
var bgcube = new THREE.Mesh( bggeometry, bgmaterial );
bgcube.position.set(0, 21, 79.9);
//scene.add(bgcube);


// RECICLE. Small dot in the center of the view. (Initiate it here)
Reticulum.init(camera, {
	proximity: false,
	clickevents: true,
	reticle: {
		visible: true,
		restPoint: 30, // 90, //Defines the reticle's resting point when no object has been targeted
		color: 0xffffff, //0xcc00cc,
		innerRadius: 0.0002, //0.0001,
		outerRadius: 0.006,  //0.003,
		hover: {
			color: 0xffffff, //0x00cccc,
			innerRadius: 0.02,
			outerRadius: 0.024,
			speed: 5,
			vibrate: 50 //Set to 0 or [] to disable
		}
	},
	fuse: {
		visible: false,
		duration: 2, //2.5,
		color: 0xffffff, //0x00fff6,
		innerRadius: 0.022, //0.045,
		outerRadius: 0.03,  //0.06,
		vibrate: 30, //Set to 0 or [] to disable
		clickCancelFuse: false //If users clicks on targeted object fuse is canceled
	}
});
scene.add(camera);  


// CAD MODELS
var light = new THREE.PointLight(0xffffff);
light.position.set(-80,95,60);
scene.add(light);
var ambientLight = new THREE.AmbientLight(0x999999);
scene.add(ambientLight);


/*
// OBJECT loader code
var objectLoader = new THREE.ObjectLoader();
objectLoader.load("../general/asset_src/testhus/testhus2.json", function ( obj ) {
	obj.scale.set(4,4,4);
	obj.position.set(0,-10, 0);
	scene.add( obj );
} );
*/

/*
// SOUND. Only works on Android
var audio = document.createElement('audio');
var source = document.createElement('source');
source.src = "../general/audio/louvre2.mp3";
audio.appendChild(source);
audio.play(); // Then use it whenever you want (like when you're close to an object)
*/

// MOUSE
document.addEventListener("mousemove", onDocumentMouseMove, false);
function onDocumentMouseMove(event){
}

// WALK (on desktop).
var character = new THREE.Object3D();
character.add(cube1);
scene.add(character);

var moving = false;
window.addEventListener('keydown', function () {
	if((event.keyCode != 37) && (event.keyCode != 39)) { moving = true; }
	// Keycodes: http://www.cambiaresearch.com/articles/15/javascript-key-codes

	// Reset the position sensor when 'z' pressed.
	if (event.keyCode == 90) controls.resetSensor();
});
window.addEventListener('keyup', function () {
  moving = false;
});
var moveDistance;
var YAXIS = new THREE.Vector3(0, 1, 0);
var ZAXIS = new THREE.Vector3(0, 0, 1);

// Variables for animate function
var lastRender = 0,
last_imagenr = -1,
mycolor = 1.0,
last_homedistance = 0,
homedistance = 0,
notswitched = true,
notloaded = true,
xpos = -100,
poscounter=0,
vehiclex = 0,
vehiclez = 0;
var astaarray;

// WEBSOCKET FOR THE POSITIONING DATA
var websocket;
var serverdata;
$(document).ready(function () {
  connectWebSocket();
});
function connectWebSocket() {
  //websocket = new WebSocket("ws://echo.websocket.org/");
  //websocket = new WebSocket("ws://10.130.23.14:53251"); // Ordinary server.
  websocket = new WebSocket("ws://10.130.22.6:53251"); // Karl-Johan server.
  
  //websocket.onopen = function()
  //{
    // Web Socket is connected, send data using send()
  //    alert("Websocket connected...");
  //    console.log("*** Websocket Connected");
  //};

  websocket.onclose = function() { 
  	alert("Disconnected!") 
  	console.log("*** Websocket Disconnected");
  }
  websocket.onerror = function() { 
  	alert("Error!") 
  	console.log("*** Websocket Error");  	
  }
  websocket.onmessage = function(evt) { 
  	console.log("*** Websocket Onmessage" + evt.data);  
  	serverdata = evt.data; 
    //serverdata = "0;0;18446739675626200513;577795978;0127690660;019480;00000;0000;0"; // origo = cone 3
  	//serverdata = "0;0;18446739675626200513;577771980;0127816300;019480;00000;0000;0"; // cone 0  	
	astaarray = serverdata.split(';');
	thelat = astaarray[3]; // "breddgrad". That is z in the model. We are looking north when we stand in origo and look at positive z.
	vehiclez = lat2z(thelat) - zeroz; //*0.1*360/1000000
	
	thelong = astaarray[4];	
	vehiclex = long2x(thelong) - zerox; //*0.1*360/1000000

	//alert("Message received. Lat: " + thelat) 

  }
   
}
//function echoData(data) {
//  websocket.send(data);
//}

/*
ID: Integer,
ObjectType: Integer
Timestampplts: Integer milliseconds since 2007.
Latitude: Integer, 0.1 microdegrees. 0 - 900 000 000. 57.777198   577795978
Longitude: Integer, 0.1 microdegrees. 0 - 900 000 000
Altitude: Integer, 0.01 meter. 0 - 800 000 000
Speed: Integer, 0.01 m/s. 0 - 16382
Heading: Integer, 0.1 degrees relative to north. 0 - 3600
Drive Direction: Enum, forward(0) or backward(1). 0 - 1
*/


// ANIMATE. This runs over and over.
function animate(timestamp) {
	var delta = Math.min(timestamp - lastRender, 500);	
	//console.log(delta)
	lastRender = timestamp;
	poscounter++;		
	
	// MOVE ACCORDING TO POSITION FROM WEBSOCKET
	//if(poscounter>250){ 	
	
		// Move camera based on AstaZero websocket position
		camera.position.set(vehiclex, 0, vehiclez); // Reset in origin
		character.position.set(vehiclex, 0, vehiclez); // Reset in origin
	
		// Debug-text.
		var text3 = document.createElement('div'); text3.style.position = 'absolute'; text3.style.width = 100; text3.style.height = 100; text3.style.backgroundColor = "blue";
		//text3.innerHTML = "TEST: " + vehiclex + " - " + vehiclez + " - " + serverdata; 
		//text3.style.top = 150 + 'px'; text3.style.left = 100 + 'px'; document.body.appendChild(text3);
		
		/* Debug test toward echo websocket:
		if(poscounter%5===0){ 
			echoData(poscounter);
			moveDistance = Math.sin( serverdata*Math.PI/720 )*3;			
			//console.log(moveDistance);
			
			camera.position.copy(character.position);
			var direction = ZAXIS.clone();
			direction.applyQuaternion(camera.quaternion);
			direction.sub(YAXIS.clone().multiplyScalar(direction.dot(YAXIS)));
			direction.normalize();
			character.quaternion.setFromUnitVectors(ZAXIS, direction);
			character.translateZ(-moveDistance);			
		}*/
	//}

	// Update VR headset position and apply to camera.
	controls.update();

	// Render the scene through the manager.
	manager.render(scene, camera, timestamp);
		requestAnimationFrame(animate);

	// Reticle. Keep checking if user is looking at any tracked objects
	Reticulum.update();

	// Walk (for desktop) (camera movement)
	camera.position.copy(character.position);
	if (moving) {
		last_homedistance = homedistance;
		homedistance = camera.position.distanceTo(new THREE.Vector3( 0, 0, 0 ) );

		if(last_homedistance > homedistance){
			moveDistance = 1;  // 1dm per game frame. 50fps->5m/s
			notswitched = true;	notloaded = true;
		} else  {
			moveDistance = 1;
			if(homedistance>theradius*0.85){ 
				moveDistance = (theradius-homedistance) * 0.0001;
			}
		}
		// move in direction we look at
		var direction = ZAXIS.clone();
		direction.applyQuaternion(camera.quaternion);
		direction.sub(YAXIS.clone().multiplyScalar(direction.dot(YAXIS)));
		direction.normalize();
		character.quaternion.setFromUnitVectors(ZAXIS, direction);
		character.translateZ(-moveDistance);
	}

    // MENU SELECTOR
	var raycaster = new THREE.Raycaster();
	raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld); // world position
	raycaster.ray.direction.set(0, 0, 0.5).unproject(camera).sub(raycaster.ray.origin).normalize();
	var intersects = raycaster.intersectObjects( cubes.children );
	cubes.children.forEach(function( cube ) {
		cube.material.color.setRGB( cube.grayness, cube.grayness, cube.grayness );
	});
	for( var i = 0; i < intersects.length; i++ ) { // If objects are behind each other there might be more than one here. Then take the first.
		var intersection = intersects[ i ];
		var	obj = intersection.object;
		// Gaze at an menu option for a second to select it
		if((obj.imagenr!=last_imagenr) && (i==0)){
			if(mycolor>=0.49) mycolor -= 0.005;
			//obj.material.color.setRGB(mycolor*0.9, mycolor, mycolor*0.9);
			obj.scale.set( 1, 1, 0.998 ); // To adjust the distance to the user, adjust z. x and y adjust size of the (thin) cylinder.

			// Todo: Apply the standard selection approach in Reticulum.
			if(mycolor<=0.5){
				last_imagenr = obj.imagenr;
				mycolor = 1.0;
				sphereMaterial.map = THREE.ImageUtils.loadTexture(gen_path + panoramasArray[obj.imagenr] + ".jpg");
				camera.position.set(0, 0, 0); // Reset in origin
				character.position.set(0, 0, 0); // Reset in origin
				// Todo: Subtle sound effect when hover object, select object etc ALSO ON IOS AND WEB. Currently there is a vibration, but it only works on Android.

				// Beep (only works on desktop)
				var snd2 = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
				snd2.currentTime=0;
				snd2.play();
			}
		}
		// Debug-text.
		//var text3 = document.createElement('div'); text3.style.position = 'absolute'; text3.style.width = 100; text3.style.height = 100; text3.style.backgroundColor = "blue";
		//text3.innerHTML = "TEST: " + panoramasArray[obj.imagenr];
		//text3.style.top = 150 + 'px'; text3.style.left = 100 + 'px'; document.body.appendChild(text3);
	}
	if(intersects.length==0) mycolor=1.0; // Reser the menu "counter"

	// SOUND VOLUME based on distance
	/*var radiusOfSound = 80;
	var distance = camera.position.distanceTo( new THREE.Vector3( 0, 0, 0 ));
	if ( distance <= radiusOfSound ) {
		audio.volume = 1 - distance / radiusOfSound;
	} else {
		audio.volume = 0;
	}*/

} // end of animate()

// Kick off animation loop
animate(Date.now());



// CARDBOARD MOVE IN GAZE DIRECTION
/*var mybeta;
window.addEventListener('deviceorientation', function (evt1) {
	mybeta = evt1.beta;
})
var lastX,
	lastY,
	lastZ,
	maxdist = 0.0,
	homedistance=0,
	last_homedistance=0,
	deltadirection_y;
window.addEventListener('devicemotion', function (evt) {
	var current = evt.accelerationIncludingGravity,
		deltaX = 0,
		deltaY = 0,
		deltaZ = 0,
		dist;
	if (lastX !== undefined) {
		deltaX = Math.abs(lastX - current.x);
		deltaY = Math.abs(lastY - current.y);
		deltaZ = Math.abs(lastZ - current.z);
		dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ).toFixed(4);
		if(dist > maxdist) maxdist = dist;
		deltadirection_y = lastY - current.y;

		// Hold head relatively still to walk in direction of your view.
		// Stop when leaning head a little to the side, like when watching something.
		if ((dist < 0.08) && (Math.abs(mybeta)<7)) {
			last_homedistance = homedistance;
			homedistance = camera.position.distanceTo(new THREE.Vector3( 0, 0, 0 ) );
			moveDistance = 1;
			notswitched=true;

			camera.position.copy(character.position);
			var direction = ZAXIS.clone();
			direction.applyQuaternion(camera.quaternion);
			direction.sub(YAXIS.clone().multiplyScalar(direction.dot(YAXIS)));
			direction.normalize();
			character.quaternion.setFromUnitVectors(ZAXIS, direction);
			character.translateZ(-moveDistance);
		}
		// A light knock on the cardboard reset the origin (creates a big accelerator value).
		if (dist > 5) {
			if(deltadirection_y>0) {
				camera.position.set(0, 0, 0); // Reset in origin
				character.position.set(0, 0, 0); // Reset in origin
			} else 	if(deltadirection_y<=0) {
				camera.position.set(0, 0, 130); // Reset in origin
				character.position.set(0, 0, 130); // Reset in origin
			}
		}
	}
	lastX = current.x; lastY = current.y; lastZ = current.z;
}, false);
*/