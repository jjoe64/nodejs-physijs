'use strict';

var THREE = require('./three.js');
var Ammo = require('../../Physijs/ammo.js');
var Physijs = require('../../Physijs/physi.js')(THREE, Ammo);



//var Physijs = require('./physiNode/physi.js');
//physijs_worker_functions = require('./physiNode/physijs_worker.js');

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
	var TICK_RATE = 133;
	var tick = 0;
	var clients = [];
	var _this = this;

	io.sockets.on('connection', function (socket) {
		console.log('client conneted');
		var cl = {
			socket: socket
		};
		clients.push(cl);
		// send hello packet
		sayHello(cl);
		socket.on('hello', function(data) {
			incomingHello.call(_this, cl, data);
		});
	});
	
	function sayHello(client) {
		client.socket.emit('hello', {
			
		});
	}
	
	function incomingHello(client, data) {
		var pl = new Player(data.id);
		pl.setData(data);
		client.player = pl;
		console.log('player logged in ');
	}
	
	function doTick(d) {
		//console.log('tick');
		//runPhysic();
		sendSnapshots();
		tick++;
	}
	
	function sendSnapshots() {
		/* After simulating a tick, the server decides if any client needs a world update and takes a snapshot of the current world state if necessary
		*/
		// currently world full_snapshot
		// gen
		var snapshot = {
			tick: tick
		};
		snapshot.players = [];
		clients.forEach(function(cl) {
			if (cl.player) {
				snapshot.players.push(cl.player.toData());
			}
		});
		
		// send
		clients.forEach(function(cl) {
			cl.socket.emit('update', snapshot);
		});
	}
	
	// main loop
	var _this = this;
	setInterval(function() {
		doTick.call(_this);
	}, TICK_RATE);

initScene();
})();

