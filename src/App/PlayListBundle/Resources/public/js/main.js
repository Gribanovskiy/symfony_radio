var source = "";
var canplay = false;
var networkState = 0;
$(function(){
	var notempty = false;
	$(document).ready(function(){
		var pl = getPlayList(0);
		if(Number(pl.status.playlistlength)>0){
			notempty = true;
		}
	});
	var night = getCookie('night');
	if(night==1){
		jQuery('body').addClass('night');
	}
	var url = document.location.hash;
	var paused = true;
	if(url == '#play'){
		paused = false;
		$('.play').removeClass('paused');
	}
	var cooks_volume = getCookie('volume');
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var analyser = context.createAnalyser();
	analyser.fftSize = 32;

	var color = setColor(cooks_volume*100);
	var prop = 'border-color';
  	$('.radiostation .play').attr('style','transition: ease border-color .3s');
  	if($('.radiostation .play').hasClass('paused')){
  		prop = 'border-left-color';
  	}
  	reprint('.radiostation .play',prop,color);

	var audioElement = document.getElementById("player");
	function setColor(perc){
		var color = 'EA1313';
		if(perc<=15){
			color = 'EA6565';
		}else if(perc<=30){
			color = 'EA5050';
		}else if(perc<=45){
			color = 'F14941';
		}else if(perc<=60){
			color = 'ED3A3A';
		}else if(perc<=75){
			color = 'ED2F2F';
		}else if(perc<=90){
			color = 'EA2626';
		}else{
			color = 'EA1313';
		}

		return '#'+color;
	}
	function reprint(el,prop,color){
		$(el).css(prop,color);
	}
	function canPlay(){
		showStats();
		
		setInterval(function(){
			if(networkState == 2 && source.mediaElement.networkState == 1){
				document.location.reload();
			}
			networkState = source.mediaElement.networkState;
			showStats();
		},3000);


	    source = context.createMediaElementSource(audioElement);
	    audioElement.volume = cooks_volume?cooks_volume:1;
	    source.connect(analyser);
	    analyser.connect(context.destination);
	    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(frequencyData);

	    // setup master volume
	    $( "#master" ).slider({
	      value: cooks_volume?(cooks_volume*100):100,
	      orientation: "horizontal",
	      range: "min",
	      max:100,
	      min:0,
	      slide:function(s,ui){
	      	//console.log(ui.value);
	      	var volume = ui.value/100;
	      	var color = setColor(ui.value);
	      	var prop = 'border-color';
	      	$('.radiostation .play').attr('style','transition: ease border-color .3s');
	      	if($('.radiostation .play').hasClass('paused')){
	      		prop = 'border-left-color';
	      	}
	      	reprint('.radiostation .play',prop,color);
	      	audioElement.volume = volume;
	      	setCookie('volume',volume);
	      },
	      animate: true
	    });

	    if(!paused){
	    	audioElement.play();
	    	$('.radiostation').css('top',105 + 'px');
	    }

	    $('.play').on('click', function(){
	    	$('.play').removeAttr('style');
	    	if(paused){
	    		audioElement.play();
	    		paused = false;
	    		$('.play').removeClass('paused');
	    		history.pushState(null, null, '#play');
	    		$('.radiostation').css('top',105 + 'px');
	    	}else{
	    		$('.radiostation').css('top',50 + '%');
	    		audioElement.pause();
	    		paused = true;
	    		$('.play').addClass('paused');
	    		history.pushState(null, null, '#pause');
	    	}
	    	return false;
	    });
		var h = $('#visualyser .bar').eq(2).css('width');
	    $('#visualyser2 .bar').each(function(){
		    $(this).find('.color').css({height: h,marginTop:$('.bar').eq(2).css('margin-right')});
		});
		
		$('#visualyser .bar').each(function(){
		    $(this).find('.color').css({height: h,marginTop:$('#visualyser .bar').eq(2).css('margin-left')});
		});
		$(window).resize(function(){
			var h = $('#visualyser .bar').eq(2).css('width');
			$('#visualyser2 .bar').each(function(){
				$(this).find('.color').css({height: h,marginTop:$('.bar').eq(2).css('margin-right')});
			});
			
			$('#visualyser .bar').each(function(){
				$(this).find('.color').css({height: h,marginTop:$('#visualyser .bar').eq(2).css('margin-left')});
			});
		});
	    var v_height = $('#visualyser').css('height');
	    var bar_freq = 255/8;
	    var freq_lenght = 255;
		function update() {
		    // Schedule the next update
		    requestAnimationFrame(update);
		    bars = $('#visualyser .bar');
		    

		    // Get the new frequency data
		    analyser.getByteFrequencyData(frequencyData);
		    // Update the visualisation
		    $('.bar').find('.color').css('opacity',0);
		    bars.each(function (index, bar) {
		    	//frequencyData[index]
		    	if(frequencyData[index]>0){
		    		$(this).find('.c8').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c8').css('opacity',1);
		    	}
		    	if(frequencyData[index]>bar_freq){
		    		$(this).find('.c7').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c7').css('opacity',1);
		    	}
		    	if(frequencyData[index]>bar_freq*2){
		    		$(this).find('.c6').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c6').css('opacity',1);
		    	}
		    	if(frequencyData[index]>bar_freq*3){
		    		$(this).find('.c5').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c5').css('opacity',1);
		    	}
		    	if(frequencyData[index]>bar_freq*4){
		    		$(this).find('.c4').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c4').css('opacity',1);
		    	}
		    	if(frequencyData[index]>bar_freq*5){
		    		$(this).find('.c3').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c3').css('opacity',1);
		    	}
		    	if(frequencyData[index]>bar_freq*6){
		    		$(this).find('.c2').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c2').css('opacity',1);
		    	}
		    	if(frequencyData[index]>bar_freq*7){
		    		$(this).find('.c1').css('opacity',1);
		    		$('#visualyser2 .bar').eq(index).find('.c1').css('opacity',1);
		    	}
		    });
		    
		    
		};

		// Kick it off...
		update();
		canplay = true;
	}
	$(document).ready(function(){
		if(notempty){
			audioElement.addEventListener("canplaythrough", function() {
				canPlay();
			});
			setInterval(function(){
				if(!canplay){
					canPlay();
				}
			},5000);
		}else{
			$('.song-title').text('Радио временно отключено');
			$('.play').css({cursor:'default', opacity:0.5});
			$('.play').on('click', function(){
				return false;
			});
		}
	});

	function showStats(){
		url="/relaxx/include/controller-playback.php?action=getCurrentSong";
		jQuery.ajax({
			url:url,
			dataType: 'json',
			type: 'GET',
			success: function(r){
				if(r.Artist && r.Title){
					$('.song-title').text(r.Artist+' - '+r.Title);
				}else{
					r.file = r.file.split('.');
					r.file = r.file[0];
					$('.song-title').text(r.file);
				}
			},
			error:function(a,b,c){
				console.log(a);
				console.log(b);
				console.log(c);
			}
		})
	}
	jQuery('#onoff').on('click', function(){
		if(jQuery('body').hasClass('night')){
			jQuery('body').removeClass('night');
			setCookie('night',0);
		}else{
			jQuery('body').addClass('night');
			setCookie('night',1);
		}
		return false;
	});

	function getCookie(name) {
	  var matches = document.cookie.match(new RegExp(
	    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	  ));
	  return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookie(name, value, options) {
	  options = options || {};

	  var expires = options.expires;

	  if (typeof expires == "number" && expires) {
	    var d = new Date();
	    d.setTime(d.getTime() + expires*1000);
	    expires = options.expires = d;
	  }
	  if (expires && expires.toUTCString) { 
	  	options.expires = expires.toUTCString();
	  }

	  value = encodeURIComponent(value);

	  var updatedCookie = name + "=" + value;

	  for(var propName in options) {
	    updatedCookie += "; " + propName;
	    var propValue = options[propName];    
	    if (propValue !== true) { 
	      updatedCookie += "=" + propValue;
	     }
	  }

	  document.cookie = updatedCookie;
	}

	function getAjaxResponse(url){
		var result = false;
		$.ajax({
				url:url,
				dataType: 'json',
				type: 'GET',
				async: false,
				success: function(r){
					result = r;
				},
				error:function(a,b,c){
					console.log(a);
					console.log(b);
					console.log(c);
				}
			})
		return result;
	}
	
});

