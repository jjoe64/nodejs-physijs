'use strict';

var THREE = require('./libs/three.js');
var Ammo = require('./libs/ammo.js');
var Physijs = require('./libs/physi.js')(THREE, Ammo);



/////////////////
// game

	var initScene, render, renderer, scene, camera, box_falling;
	
	initScene = function() {
		
		scene = new Physijs.Scene;
		
		// Box
		box_falling = new Physijs.BoxMesh(
			new THREE.CubeGeometry( 5, 5, 5 ),
			new THREE.MeshBasicMaterial({ color: 0x888888 })
		);
		scene.add( box_falling );
		
		// Box
		var box = new Physijs.BoxMesh(
			new THREE.CubeGeometry( 5, 5, 5 ),
			new THREE.MeshBasicMaterial({ color: 0x880088 }),
			0
		);
		box.position.y = -20;
		scene.add( box );
		
		setTimeout( render, 200 );
	};
	
	render = function() {
		scene.simulate(); // run physics
		setTimeout( render, 200 );
	};


//////////////////
// web socket

var io = require('socket.io').listen(8088);

(function() {
	io.sockets.on('connection', function (socket) {
		console.log('client conneted');
	});

	// start physijs scene
	initScene();
})();

