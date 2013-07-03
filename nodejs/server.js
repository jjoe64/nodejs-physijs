//'use strict';

THREE = require('./three.js');

var Physijs = require('./physiNode/physi.js');
require('./physiNode/physijs_worker.js');

/////////////////
// game






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

})();

