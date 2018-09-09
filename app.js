var express = require('express')
var app = express(); // app created 
var http = require('http').Server(app); // http server that gets app (function handler)
var io = require('socket.io')(http); // mounts on http server

app.get('/', function(req, res){ // respond with a html file when a GET request 
	res.sendFile(__dirname+ '/index.html');	// serve a html file

});

app.use(express.static(__dirname));

io.on('connection', function(socket){
	console.log('a user connected');
	
	
	socket.on('chat message', function(msg){ // get msg from emit
		console.log('chat message: ', msg);
		io.emit('chat message', msg + ' poop');		// broadcast to everyone, send to server
	});
	
	// get video id
	socket.on('video id', function(vid){
		console.log(vid);
		io.emit('video id', vid);
	});
	
	//receive status change
	socket.on('onStateChange', function() {
		console.log('status changed');
		
	});
	// react to pause
	socket.on('paused', function(){
		console.log('paused');
		io.emit('paused');
	});
	
	//react to play
	socket.on('play', function(){
		console.log('playing');
		io.emit('play');	// tell all clients to play
		console.log('emitting clicked event');
	});
	
	socket.on('disconnect', function(socket){
		console.log('a user disconnected')
	}); 
	
	// react to synch
	socket.on('sync', function(currentTime){
		console.log('sync or pause sync');
		io.emit('sync', currentTime);
	});
	
	// status change reaction
	socket.on('playing state', function() {
		console.log('vid is playing');
	});
	
	//cue video
	socket.on('load', function(){
		io.emit('load');
	});
	
	
});


http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});