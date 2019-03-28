var tag = document.createElement('script');
  tag.id = 'iframe-demo';
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player;
  
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('existing-iframe-example', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
        }
    });
	player.addEventListener('onStateChange', updateBar);
  }
  
  function updateBar(event){
	if(event.data == 2) { // paused
		console.log(player.getCurrentTime());
	}
	
	}
  
  function onPlayerReady(event) {
	console.log(player.getPlayerState());
	event.target.playVideo();	// no autoplay on chrome?
    document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
	//event.target.playVideo(); // event.target references target that dispatched the event
	//$(document).ready(function(event){
	//	if(event.data == -1){
	//		event.target.playVideo();
	}
  
  //change video border based on player state
  
  function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
      color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
      color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
      color = "#33691E"; // playing = green
    } else if (playerStatus == 2) {
      color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
      color = "#AA00FF"; // buffering = purple
    } else if (playerStatus == 5) {
      color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
      document.getElementById('existing-iframe-example').style.borderColor = color;
    }
  }
  
  var socket = io();
  
  // when video state changes
  function onPlayerStateChange(event) {
    changeBorderColor(event.data);
	console.log(event.data);
	if(event.data == 1) {
		console.log('video is playing'); //playing
		socket.emit('play');
	} else if(event.data == 2){
		socket.emit('paused');
	}
	
}
  
  
  
	

		$(function () { // wait until things are done loading to do stuff
			var clicked = 'clicked';
			//var socket = io(); // new instance serve wiring up node and socket
			
			//chat message capabilities
			
			$('#msg').submit(function(){ // when selector with form is submitted
				socket.emit('chat message', $('#m').val()); 
				$('#m').val('');
				return false;
			});
			socket.on('chat message', function(msg){ // got from io.emit()
				$('#messages').append($('<li>').text(msg));
				
			});
			
			
			
			
			// get video ID
			$('#vidID').submit(function(){
				socket.emit('video id', $('#videoId').val());
				$('videoId').val('');
				return false;
			});
			socket.on('video id', function(vid){
				player.cueVideoById(vid, 0, "large");
			});
			
			
			// pause all vids with the button
			
			$('#b').click(function(){
				var currentTime = player.getCurrentTime();
				socket.emit('paused', currentTime);
				console.log('pressing pause');
				});
			
			socket.on('paused', function(){
				player.pauseVideo();
				console.log('paused');
				});
				
			// play all videos with button
			$('#c').click(function(){
				socket.emit('play');
				});
			
			socket.on('play', function(){
				player.playVideo();
				console.log('play button');
				});	
				
			 // sync
			$('#d').click(function() {
			
				var currentTime = player.getCurrentTime();
				console.log(currentTime);
				socket.emit('sync', currentTime);
			});
						
				socket.on('sync', function(currentTime){
					player.seekTo(currentTime);
					console.log(currentTime);
				});
			
			
		});
		