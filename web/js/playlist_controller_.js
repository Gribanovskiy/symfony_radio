
	$(document).ready(function(){
		$('body').on('click', function(e){
			removeSongMenu();
		});
	});
		
	var rpt = 0;
	var state = 0;
	var rnd = 0;
	var playlist_id = 0;
	setStatus();
	//current song
	var r = getcurrent();
	var curr_file = r.file;
	var opt = [];
	opt[0] = {
		'el':{
			'append':1,
			'html':'<div id="playlist_time" class="well"></div><div class="current_file_wrap"><label>Сейчас проигрывается файл: </label><div class="current_file">---</div></div>',
		},
	};
	if(typeof curr_file != 'undefined'){
		
		opt[0] = {
			'el':{
				'append':1,
				'html':'<div id="playlist_time" class="well"></div><div class="current_file_wrap"><label>Сейчас проигрывается файл: </label><div class="current_file">'+r.file+'</div></div>',
			},
		};
		
	}
	render('#playlist',opt);
	setInterval(function(){
		var r = getcurrent();
		var status = getStatus();

		if(r.file != curr_file){
			opt[0] = {
				'el':{
					'query':'.current_file',
					'html':r.file,
				},
			};
			render('#playlist',opt);
			$('#active_playlist_info > div').removeClass('active');
			$('#active_playlist_info > div[rel='+r.Id+']').addClass('active');
		}
		if(status.time){
			var a = status.time;
			a=a.split(":");
			opt[0] = {
				'el':{
					'query':'#playlist_time',
					'html':convertTime(a[0])+' : '+convertTime(a[1]),
				},
			};
			render('#playlist',opt);
		}
	},1000);
	
	//playback
	$('.prev_song').on('click',function(){
		prevSong();
		r = getcurrent();
		if(r.file != curr_file){
			opt[0] = {
				'el':{
					'query':'.current_file',
					'html':r.file,
				},
			};
			render('#playlist',opt);
		}
	});
	$('.next_song').on('click',function(){
		nextSong();
		r = getcurrent();
		if(r.file != curr_file){
			opt[0] = {
				'el':{
					'query':'.current_file',
					'html':r.file,
				},
			};
			render('#playlist',opt);
		}
	});
	$('.stop_song').on('click',function(){
		stop();
		setStatus();
	});
	$('.pause_song').on('click',function(){
		pause();
		setStatus();
	});
	$('.continue_song').on('click',function(){
		continue_song();
		setStatus();
	});
	
	$('.repeat_song').on('click',function(){
		rpt = rpt==1 ? 0 : 1;
		repeat(rpt);
		setStatus();
	});
	$('.random_song').on('click',function(){
		rnd = rnd==1 ? 0 : 1;
		random(rnd);
		setStatus();
	});



	$(document).ready(function(){
		var playlist = getPlayList(0);
		var files = '';
		if(typeof playlist.playlist != 'undefined'){
			$.each(playlist.playlist.file, function(k,v){
				if(!v.Title && !v.Artist){
					var file_info = buildTag(v);
					files += '<div rel="'+file_info.Id+'">'+file_info.Artist+' : '+file_info.Title+'</div>';
				}else{
					files += '<div rel="'+v.Id+'">'+v.Artist+' : '+v.Title+'</div>';
				}
			});
			var opt2 = [];
			opt2[0] = {
				'el':{
					'append':1,
					'html':'<div id="active_playlist_info">'+files+'</div>',
				},
			};
			render('#active_playlist',opt2);
			$('#active_playlist_info > div[rel='+r.Id+']').addClass('active');
		}
	});
	$(document).ready(function(){
		$(document).on('click', '#playSong', function(){
			var data = $(this).parents('#trackMenu').attr('data');
			data = String(data).split(':');
			play(data[0]);
		});
		$(document).on('click', '#active_playlist_info > div', function(e){
			if(e.shiftKey){
				var el = $(this);
				el.addClass('current');
				var n = $('#active_playlist_info > div').length;
				for(var i = 0, marked = []; i<n; i++){
					if($('#active_playlist_info > div').eq(i).hasClass('current')){
						marked.push(i);
					}
					else if(marked.length){
						marked.push(i);
					}
					if(($('#active_playlist_info > div').eq(i).attr('rel')==el.attr('rel'))){
						break;
					}
				}
				if(marked.length<2){
					for(var i = n, marked = []; i>=0; i--){
						if($('#active_playlist_info > div').eq(i).hasClass('current')){
							marked.push(i);
						}
						else if(marked.length){
							marked.push(i);
						}
						if(($('#active_playlist_info > div').eq(i).attr('rel')==el.attr('rel'))){
							break;
						}
					}
				}
				$('#active_playlist_info > div').removeClass('current');
				$.each(marked, function(k,v){
					$('#active_playlist_info > div').eq(v).addClass('current');
				});
			}
			else if(e.ctrlKey){
				$(this).addClass('current');
			}
			else{
				if($(this).hasClass('current')){
					$(this).removeClass('current');
				}else{
					$('#active_playlist_info > div').removeClass('current');
					$(this).addClass('current');
				}
			}
		});
		$(document).on('contextmenu','#active_playlist_info > div',function(e){
			removeSongMenu();
			$(this).addClass('current');
			var files = [];
			$('#active_playlist_info > div.current').each(function(){
				files.push($(this).attr('rel'));
			});
			var file_name = files.join(':');
			showSongMenu(e, 'playlist', file_name);
		});
	});
	function refreshList(refreshedTracks, append){
		var tracks = "";
		var songs = "";
		if(typeof refreshedTracks.file == 'undefined'){
			return;
		}
		$.each(refreshedTracks.file, function(k,v){
			if(!v.Title && !v.Artist){
				var file_info = buildTag(v);
				tracks += '<div rel="'+v.file+'">'+file_info.Artist+' : '+file_info.Title+'</div>';
				songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> '+file_info.Artist+' - '+file_info.Title+' </span>\
                                            <div class="day-colors"><span class="color red"></span><span class="color blue"></span><span class="color orange"></span></div>\
                                        </li>';
			}else{
				tracks += '<div rel="'+v.file+'">'+v.Artist+' : '+v.Title+'</div>';
				songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> '+v.Artist+' - '+v.Title+' </span>\
                                            <div class="day-colors"><span class="color red"></span><span class="color blue"></span><span class="color orange"></span></div>\
                                        </li>';
			}
		});
		var opt2 = [];
		opt2[0] = {
			'el':{
				'append': append?1:undefined,
				'query': '#tracks_info',
				'html': append?'<div id="tracks_info" oncontextmenu="return false;">'+tracks+'</div>':tracks,
			},
		};
		$('#grid-list-songs').html(songs);
		render('#tracks',opt2);
	}
	function showDirs(dirs){
		var dirs_html = "";
		$.each(dirs, function(k,v){
			dirs_html += '<div>'+v+'</div>';
		});
		$('#dirs').html(dirs_html);
	}
	function showPls(pls){
		var pls_html = "";
		$.each(pls, function(k,v){
			pls_html += '<div>'+v+'</div>';
		});
		$('#saved_playlists').html(pls_html);
	}
	$(document).ready(function(){
		var refreshedTracks = refreshTracklist("","/");
		refreshList(refreshedTracks, 1);
		if(typeof refreshedTracks.directory != 'undefined'){
			showDirs(refreshedTracks.directory);

			$(document).on('click','#dirs > div', function(){
				var refreshedTracks = refreshTracklist("",$(this).text());
				$('#tracks').html('');
				refreshList(refreshedTracks, 1);
				if(typeof refreshedTracks.directory != 'undefined'){
					showDirs(refreshedTracks.directory);
				}else{
					$('#dirs').html('');
				}
			})
		}
		//show playlists
		var playlists = getPlaylists();
		showPls(playlists);
		$(document).on('click','#saved_playlists > div', function(){
			var value = $(this).text();
			var selected_playlist = getListPlaylist(value);
			refreshList(selected_playlist, 0);
		});
		//save playlist
		$(document).on('click','#savePlayList', function(){
			var value = window.prompt('enter playlist title:');
			if(value){
				savePlayList(value);
				//show playlists
				var playlists = getPlaylists();
				showPls(playlists);
			}
			return false;
		});

		//delete playlist
		$(document).on('click','#delPlayList', function(){
			var value = $(this).parents('#trackMenu').attr('data');
			delPlayList(value);
			var selected_playlist = getListPlaylist(value);
			refreshList(selected_playlist, 0);
			//show playlists
			var playlists = getPlaylists();
			showPls(playlists);
			return false;
		});
		$(document).on('click','#addToSchedule', function(){
			var value = $(this).parents('#trackMenu').attr('data');
			var addedSchedule = addToSchedule(value);
			if(addedSchedule.ok == true){
				addScheduleToHTML(value, addedSchedule.id);
			}
			return false;
		});
		$(document).on('click','.schedules-list li .js-close', function(){
			
			var deletedSchedule = deleteSchedule(
				$(this).parent().attr('data')
			);
			if(deletedSchedule.ok){
				$('.schedules-list li[data='+deletedSchedule.id+']').remove();
			}
			return false;
		});
		$(document).on('blur','.schedules-list li .time', function(){
			var id = $(this).parent().attr('data');
			updateSchedule(id,$(this).text());
			return false;
		});
	});
	
	function addScheduleToHTML(value, id){
		var date = new Date();
		var d = (date.getHours()+1)+':'+date.getMinutes()+':00';
		$('.schedules-list').append('<li data="'+id+'" class="list-group-item"><span class="badge js-close">&times</span>\
		<span contenteditable="true" class="badge time">'+d+'</span> '+value+'</li>');
	}
	
	$(document).ready(function(){
		$(document).on('click', '#tracks_info > div', function(e){
			if(e.shiftKey){
				var el = $(this);
				el.addClass('current');
				var n = $('#tracks_info > div').length;
				for(var i = 0, marked = []; i<n; i++){
					if($('#tracks_info > div').eq(i).hasClass('current')){
						marked.push(i);
					}
					else if(marked.length){
						marked.push(i);
					}
					if(($('#tracks_info > div').eq(i).attr('rel')==el.attr('rel'))){
						break;
					}
				}
				if(marked.length<2){
					for(var i = n, marked = []; i>=0; i--){
						if($('#tracks_info > div').eq(i).hasClass('current')){
							marked.push(i);
						}
						else if(marked.length){
							marked.push(i);
						}
						if(($('#tracks_info > div').eq(i).attr('rel')==el.attr('rel'))){
							break;
						}
					}
				}
				$('#tracks_info > div').removeClass('current');
				$.each(marked, function(k,v){
					$('#tracks_info > div').eq(v).addClass('current');
				});
			}
			else if(e.ctrlKey){
				$(this).addClass('current');
			}
			else{
				if($(this).hasClass('current')){
					$(this).removeClass('current');
				}else{
					$('#tracks_info > div').removeClass('current');
					$(this).addClass('current');
				}
			}
		});
		$(document).on('contextmenu','#tracks_info > div',function(e){
			removeSongMenu();
			$(this).addClass('current');
			var files = [];
			$('#tracks_info > div.current').each(function(){
				files.push($(this).attr('rel'));
			});
			var file_name = files.join(':');
			showSongMenu(e, 'tracks', file_name);
		});

		$(document).on('contextmenu','#saved_playlists > div',function(e){
			removeSongMenu();

			var file_name = $(this).text();


			showSongMenu(e, 'saved_playlist', file_name);
			return false;
		});
	});
	$(document).ready(function(){
		$(document).on('click', '#addSelectedSongs', function(){
			var songs = $(this).parents('#trackMenu').attr('data');
			songs = String(songs).split(':');
			$.each(songs, function(k,v){
				$.ajax({
					url:'/relaxx/include/controller-playlist.php?action=addSong&value='+v,
					dataType: 'json',
					type: 'GET',
					async: false,
					success: function(r){
						
					},
					error:function(a,b,c){
						console.log(a);
						console.log(b);
						console.log(c);
					}
				});
			});
			$('#tracks_info > div.current').removeClass('current');
			var playlist = getPlayList(0);
			var files = '';
			var opt2 = [];
			opt2.push({
				'el':{
					'query': '#active_playlist',
					'html':'<div id="active_playlist_info"></div>',
				},
			});
			render('.playlists',opt2);
			if(typeof playlist.playlist != 'undefined'){
				$.each(playlist.playlist.file, function(k,v){
					if(!v.Title && !v.Artist){
						var file_info = buildTag(v);
						files += '<div rel="'+file_info.Id+'">'+file_info.Artist+' : '+file_info.Title+'</div>';
					}else{
						files += '<div rel="'+v.Id+'">'+v.Artist+' : '+v.Title+'</div>';
					}
				});
				var opt2 = [];
				opt2.push({
					'el':{
						'query': '#active_playlist',
						'html':'<div id="active_playlist_info">'+files+'</div>',
					},
				});
				render('.playlists',opt2);
				$('#active_playlist_info > div[rel='+r.Id+']').addClass('active');
			}
			return false;
		});
		
		$(document).on('click', '#delSelectedSongs', function(){
			var songs = $(this).parents('#trackMenu').attr('data');
			$.ajax({
				url:'/relaxx/include/controller-playlist.php?action=deleteSong&value='+songs,
				dataType: 'json',
				type: 'GET',
				async: false,
				success: function(r){
					
				},
				error:function(a,b,c){
					console.log(a);
					console.log(b);
					console.log(c);
				}
			});
			$('#active_playlist_info > div.current').removeClass('current');
			var playlist = getPlayList(0);
			var files = '';
			if(typeof playlist.playlist != 'undefined'){
				$.each(playlist.playlist.file, function(k,v){
					if(!v.Title && !v.Artist){
						var file_info = buildTag(v);
						files += '<div rel="'+file_info.Id+'">'+file_info.Artist+' : '+file_info.Title+'</div>';
					}else{
						files += '<div rel="'+v.Id+'">'+v.Artist+' : '+v.Title+'</div>';
					}
				});
				var opt2 = [];
				opt2.push({
					'el':{
						'query': '#active_playlist',
						'html':'<div id="active_playlist_info">'+files+'</div>',
					},
				});
				render('.playlists',opt2);
				$('#active_playlist_info > div[rel='+r.Id+']').addClass('active');
			}
			if(typeof playlist.playlist == 'undefined'){
				var opt2 = [];
				opt2.push({
					'el':{
						'query': '#active_playlist',
						'html':'&nbsp;',
					},
				});
				render('.playlists',opt2);
			}
			return false;
		});
	});

	$(document).ready(function(){
		$('.updateMPDDB').on('click', function(){
			updateMPD();
			var refreshedTracks = refreshTracklist("","/");
			$('#tracks').html('');
			refreshList(refreshedTracks, 1);
			if(typeof refreshedTracks.directory != 'undefined'){
				showDirs(refreshedTracks.directory);
			}
		});
	});
	
	function setStatus(){
		var status = getStatus();
		rpt = status.repeat;
		state = status.state;
		rnd = status.random;
		playlist_id = status.playlist;
		$('#playlist_control_btns .btn').removeClass('active');
		//setstatus
		if(rpt==1){
			$('#playlist_control_btns .repeat_song').removeClass('btn-default');
			$('#playlist_control_btns .repeat_song').addClass('btn-info');
			$('#playlist_control_btns .repeat_song').addClass('active');
		}else{
			$('#playlist_control_btns .repeat_song').addClass('btn-default');
			$('#playlist_control_btns .repeat_song').removeClass('btn-info');
			$('#playlist_control_btns .repeat_song').removeClass('active');
		}
		if(rnd==1){
			$('#playlist_control_btns .random_song').removeClass('btn-default');
			$('#playlist_control_btns .random_song').addClass('btn-info');
			$('#playlist_control_btns .random_song').addClass('active');
		}else{
			$('#playlist_control_btns .random_song').addClass('btn-default');
			$('#playlist_control_btns .random_song').removeClass('btn-info');
			$('#playlist_control_btns .random_song').removeClass('active');
		}
		if(state=='pause'){
			$('#playlist_control_btns .continue_song').removeClass('btn-info');
			$('#playlist_control_btns .continue_song').addClass('btn-default');
			$('#playlist_control_btns .pause_song').removeClass('btn-default');
			$('#playlist_control_btns .pause_song').addClass('btn-info');
			$('#playlist_control_btns .pause_song').addClass('active');
		}
		if(state=='play'){
			$('#playlist_control_btns .pause_song').removeClass('btn-info');
			$('#playlist_control_btns .pause_song').addClass('btn-default');
			$('#playlist_control_btns .stop_song').removeClass('btn-info');
			$('#playlist_control_btns .stop_song').addClass('btn-default');
			$('#playlist_control_btns .continue_song').removeClass('btn-default');
			$('#playlist_control_btns .continue_song').addClass('btn-info');
			$('#playlist_control_btns .continue_song').addClass('active');
		}
		if(state=='stop'){
			$('#playlist_control_btns .continue_song').removeClass('btn-info');
			$('#playlist_control_btns .continue_song').addClass('btn-default');
			$('#playlist_control_btns .pause_song').removeClass('btn-info');
			$('#playlist_control_btns .pause_song').addClass('btn-default');
			$('#playlist_control_btns .stop_song').removeClass('btn-default');
			$('#playlist_control_btns .stop_song').addClass('btn-info');
			$('#playlist_control_btns .stop_song').addClass('active');
		}
	}

