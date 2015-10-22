(function(fn) {
	var $$ = $(document);
	var mousedown = 'mousedown', mouseup = 'mouseup';
 
	function noMenu() { return false; }
 
	function handler(callback) {
		return function(e) {
			if (e.which === 3) { callback.call(this, e); }
			if (e.type === mousedown) { $$.one('contextmenu', noMenu); }
		};
	};
 
	fn.rightClick = function rightClick(callback) {
		return this.rightMousedown(function() {
			$(this).one(mouseup, handler(callback));
		});
	};
 
	fn.rightMousedown = function rightMousedown(callback) {
		return this[mousedown](handler(callback));
	};
 
	fn.rightMouseup = function rightMouseup(callback) {
		return this[mouseup](handler(callback));
	};
 
})(jQuery.fn);

//BASE
function getFileCount(){
	var count = 0;
	$.ajax({
		dataType: 'json',
		type: 'POST',
		async:false,
		url: '/ajax/getFilesCount/v1',
		error: function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		},
		success: function(r){
			count = r.count;
		}
	});
	return count;
}
function updateSchedule(colors){
	$.ajax({
		dataType: 'json',
		type: 'POST',
		data: {colors:colors},
		url: '/ajax/updateSchedule/v2',
		error: function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		},
		success: function(r){
			if(r.fail){
				var fails = "";
				$.each(r.fail,function(k,v){
					fails += v+"\n";
				});
				alert('следующие треки не внесены:\n'+fails);
			}
			$('.accept-changes-in-playlist').find('span').text('Подтвердить изменения');
			$('#circleG').removeClass('active');
		}
	});
}

function delPlayList(value){
	if(typeof value != 'undefined'){
		var url = "/relaxx/include/controller-playlist.php?action=deletePlaylist&value="+value;
		getAjaxResponse(url);
	}
}

function addToSchedule(value){
	if(typeof value != 'undefined'){
		var url = "/ajax/addToSchedule/"+value;
		return getAjaxResponse(url);
	}
}

function deleteSchedule(id){
	if(typeof id != 'undefined'){
		var url = "/ajax/deleteSchedule/"+id;
		return getAjaxResponse(url);
	}
}

function savePlayList(value){
	if(typeof value != 'undefined'){
		var url = "/relaxx/include/controller-playlist.php?action=savePlaylist&value="+value;
		getAjaxResponse(url);
	}
}

function getPlaylists(){
	var url = "/relaxx/include/controller-playlist.php?action=getPlaylists";
	return getAjaxResponse(url);
}

function getListPlaylist(value){
	var url = "/relaxx/include/controller-playlist.php?action=listPlaylistInfo&value="+value;
	return getAjaxResponse(url);
}

function addPlaylist(playlist, list){
	var songs = "";
	$.each(list.file, function(k,v){
		if(!v.Title && !v.Artist){
			var file_info = buildTag(v);

			songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" aria-checked="false" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> <span class="text" data="'+v.Artist+' - '+v.Title+'">'+file_info.Artist+' - '+file_info.Title+'</span> </span>\
                                        <div class="day-colors"></div>\
                                    </li>';
		}else{
			songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> <span class="text" data="'+v.Artist+' - '+v.Title+'">'+v.Artist+' - '+v.Title+'</span> </span>\
                                        <div class="day-colors"></div>\
                                    </li>';
		}
	});
	$('.day.column .grid-row .color.'+playlist).parents('.day.column').find('.songs').html(songs);
}

function updateMPD(){
	var url = "/relaxx/include/controller-mpdadmin.php?action=updateDatabase";
	r = getAjaxResponse(url);
}

function showSongMenu(e, type, data){
	var cmid = 'trackMenu';
	$('body').append(buildSongMenu(type, data));
	$('#'+cmid).css({
		top: (e.pageY-$(window).scrollTop())+'px',
		left: (e.pageX-280)+'px',
	});
	$('#'+cmid).show();

	function buildSongMenu(type, data){
		var list = '';
		if(type == 'playlist'){
			list = '<div class="list-group"><a href="#" class="list-group-item" id="delSelectedSongs">Удалить выделенное</a><a href="#" class="list-group-item" id="playSong">Воспроизвести</a><a href="#" class="list-group-item" id="savePlayList">Сохранить плей-лист</a></div>';
		}else if(type == 'tracks'){
			list = '<div class="list-group"><a href="#" class="list-group-item" id="addSelectedSongs">Добавить выделенное</a></div>';
		}else if(type == 'saved_playlist'){
			list = '<div class="list-group"><a href="#" class="list-group-item" id="delPlayList">Удалить плей-лист</a>\
			<a href="#" class="list-group-item" id="addToSchedule">Добавить в расписание</a></div>';
		}
		return '<div id="'+cmid+'" data="'+data+'"><div class="context-header">Выбрать действие: </div><div>'+list+'</div></div>';
	}
}

function removeSongMenu(){
	var cmid = 'trackMenu';
	$('#'+cmid).remove();
}

function buildTag(a){
	if(!a.Time){
		if(a.Name){
			a.Title=a.Name
		}
		if(!a.Title){
			a.Title=a.file
		}
		a.Time="stream"
	}else{
		var b=a.file.substr(a.file.lastIndexOf("/")+1);
		n=b.indexOf("-");
		if(n){
			a.Artist=b.substr(0,n-1)
		}a.Title=b.substr(n+1)
		
	}
	return a
}

function refreshTracklist(b,c){
	switch(b){
		case"search":url="/relaxx/include/controller-database.php?"+Object.toQueryString({
			action:b,type:c.target.value,search:c.search.value
		});
		break;
		case"listPlaylistInfo":url="/relaxx/include/controller-playlist.php?"+Object.toQueryString({
			action:b,value:c
		});
		break;
		default:url="/relaxx/include/controller-database.php?action=directory&dir="+c
	}
	return getAjaxResponse(url);
}

function convertTime(a){
	if(Number(a)){
		m=parseInt(a/60);
		s=Math.abs(a%60);
		h=parseInt(m/60);
		if(h>0){
			m=Math.abs(m%60)
		}
		return(a<0?"-":"")+(h>0?h+":":"")+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s)
	}else{
		return a
	}
}

function getcurrent(){
	var url = "/relaxx/include/controller-playback.php?action=getCurrentSong";
	return getAjaxResponse(url);
}

function getStats(){
	var url = "/relaxx/include/controller-common.php?action=getStats";
	return getAjaxResponse(url);
}

function getStatus(){
	var url = "/relaxx/include/controller-common.php?action=getStatus";
	return getAjaxResponse(url);
}

function continue_song(){
	var r = getcurrent();
	if(typeof r.Id != 'undefined'){
		var url = "/relaxx/include/controller-playback.php?action=continue&value="+r.Id;
		getAjaxResponse(url);
	}
	return false;
}

function pause(){
	var url = "/relaxx/include/controller-playback.php?action=pause";
	getAjaxResponse(url);
}

function stop(){
	var url = "/relaxx/include/controller-playback.php?action=stop";
	getAjaxResponse(url);
}

function repeat(value){
	var url = "/relaxx/include/controller-playback.php?action=repeat&value="+value;
	getAjaxResponse(url);
}

function random(value){
	var url = "/relaxx/include/controller-playback.php?action=random&value="+value;
	getAjaxResponse(url);
}

function setVolume(value){
	var url = "/relaxx/include/controller-playback.php?action=setVolume&value="+value;
	getAjaxResponse(url);
}

function play(Id){
	var url = "/relaxx/include/controller-playback.php?action=play&value="+Id;
	getAjaxResponse(url);
}

function nextSong(){
	var url = "/relaxx/include/controller-playback.php?action=nextSong";
	getAjaxResponse(url);
}

function prevSong(){
	var url = "/relaxx/include/controller-playback.php?action=prevSong";
	getAjaxResponse(url);
}

function getPlayList(id){
	if (typeof id == 'undefined') {
		id = 0;
	};
	var url = "/relaxx/include/controller-ping.php?value="+id;
	return getAjaxResponse(url);
}

function getAjaxResponse(url, data){
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

function render(el, optezz){
	$.each(optezz, function(k,v){
		if(typeof v.el != 'undefined' && typeof v.el.html != 'undefined' && typeof v.el.append != 'undefined'){
			$(el).append(v.el.html);
		}else if(typeof v.el != 'undefined' && typeof v.el.html != 'undefined' && typeof v.el.query != 'undefined'){
			$(el).find(v.el.query).html(v.el.html);
		}
	});
}

var colors = [];
function refreshList(refreshedTracks, prevFolder){
	var songs = "";
	var folders = "";

	//clear list
	$('#grid-list-songs').html('');

	if(typeof refreshedTracks.file == 'undefined'){
		return;
	}
	//add files
	$.each(refreshedTracks.file, function(k,v){
		if(!v.Title && !v.Artist){
			var file_info = buildTag(v);

			songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" aria-checked="false" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> <span class="text tinysort" data="'+file_info.Artist+' - '+file_info.Title+'">'+file_info.Artist+' - '+file_info.Title+'</span> </span>\
                                        <div class="day-colors"></div>\
                                    </li>';
		}else{
			songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> <span class="text tinysort" data="'+v.Artist+' - '+v.Title+'">'+v.Artist+' - '+v.Title+'</span> </span>\
                                        <div class="day-colors"></div>\
                                    </li>';
		}
	});

	//add folders
	if(typeof prevFolder != 'undefined'){
		folders = '<li class="folder" oncontextmenu="return false;"><span class="glyphicon glyphicon-folder-close"></span>'+prevFolder+'</li>';
	}else{
		folders = '';
	}

	if(typeof refreshedTracks.directory != 'undefined'){
		
		$.each(refreshedTracks.directory, function(k,v){
			folders += '<li class="folder" oncontextmenu="return false;"><span class="glyphicon glyphicon-folder-close"></span><span class="tinysortf">'+v+'</span></li>';
		});

	}

	var count = getFileCount();

	$('#grid-list-songs').html(folders);
	
	$('#grid-list-songs').append(songs);
	$('.general .grid-row .badge').text(count);
	$( ".grid-list.songs.sortable" ).sortable({
	  connectWith: "ul",
	  items: "> li",
	  sort: function(e,ui){
	  	ui.item.css({
	  		top: e.pageY-230
	  	});
	  },
	  update: function(e,ui){
	  	if(ui.item.hasClass('folder')){
	  		var folder = ui.item.text();
	  		var tracks = refreshTracklist("",folder);
	  		var column = $(e.target);

	  		ui.item.remove(); 

	  		addTracksToColumn(column, tracks, folder);
	  	}else{
	  		ui.item.find('.day-colors').html('<span class="color"></span>');
		  	ui.item.attr('style','');
	  	}
	  	setColors();
	  	jQuery('.accept-changes-in-playlist').removeClass('disabled');
	  }
	});

	$( "#grid-list-songs .song, #grid-list-songs .folder" ).draggable({
	  connectToSortable: ".sortable",
	  helper: "clone",
	  scroll: false,
	  revert: "invalid"
	});
	$( ".sortable,.sortable li" ).disableSelection();
	setTimeout(setColors,1000);
}

function addTracksToColumn(column, tracks, folder){
	var songs = "";
	if(typeof tracks.file == 'undefined'){
		return;
	}
	//add files
	$.each(tracks.file, function(k,v){
		if(!v.Title && !v.Artist){
			var file_info = buildTag(v);

			songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" aria-checked="false" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> <span class="text tinysort" data="'+file_info.Artist+' - '+file_info.Title+'">'+file_info.Artist+' - '+file_info.Title+'</span> </span>\
                                        <div class="day-colors"></div>\
                                    </li>';
		}else{
			songs += '<li class="song"><span class="checkbox"><div class="icheckbox_minimal" style="position: relative;"><input type="checkbox" class="check-song" value="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div> <span class="text tinysort" data="'+v.Artist+' - '+v.Title+'">'+v.Artist+' - '+v.Title+'</span> </span>\
                                        <div class="day-colors"></div>\
                                    </li>';
		}
	});
	column.append(songs);
	setColors();
}


function setColors(){
	var general = $('.general.column');
	var days = $('.column:not(.general)');
	general.find('.day-colors').html('');
	colors = [];
	days.each(function(){
		var color = "";
		if($(this).find('.grid-row .color').hasClass('red')){
			color = "red";
		}else if($(this).find('.grid-row .color').hasClass('purple')){
			color = "purple";
		}else if($(this).find('.grid-row .color').hasClass('orange')){
			color = "orange";
		}else if($(this).find('.grid-row .color').hasClass('yellow')){
			color = "yellow";
		}else if($(this).find('.grid-row .color').hasClass('green')){
			color = "green";
		}else if($(this).find('.grid-row .color').hasClass('blue')){
			color = "blue";
		}else if($(this).find('.grid-row .color').hasClass('dark-blue')){
			color = "dark-blue";
		}
		$(this).find('.song .text').each(function(){
			
			eval('colors.push({"'+color+'":"'+$(this).text()+'"})');
			$('.general .song .text[data="'+$(this).text()+'"]').parents('.song').find('.day-colors').append('<span class="color '+color+'"></span>');
		});
	});
}

function actions(){
	var selectAll = new CustomEvent("selectAll", {
		detail: {
			action: 'selectAll'
		}
	});
	var garbage = new CustomEvent("garbage", {
		detail: {
			action: 'garbage'
		}
	});

	var presets_select_all = document.getElementsByClassName('select-all');
	for (var i in presets_select_all) {
		
		i = parseInt(i);
		if(!(i >= 0)){
			continue;
		}

		presets_select_all[i].addEventListener('selectAll', function(e){
			$(this).parents('.column').find('.grid-list.songs > .song input[type=checkbox], .grid-list.songs > .folder').each(function(){
				if($(this).hasClass('folder')){
					if($(this).hasClass('active')){
						$(this).removeClass('active');
					}else{
						$(this).addClass('active');
					}
				}else{
					if($(this).parents('.icheckbox_minimal').hasClass('checked')){
						$(this).removeAttr('checked');
						$(this).parents('.icheckbox_minimal').removeClass('checked');
						
					}else{
						$(this).attr('checked', 'checked');
						$(this).parents('.icheckbox_minimal').addClass('checked');
					}
				}
			});

		});

		presets_select_all[i].onclick = function(){
			this.dispatchEvent(selectAll);
		}
	};

	var presets_garbage = document.getElementsByClassName('garbage');
	for (var i in presets_garbage) {
		
		i = parseInt(i);
		if(!(i >= 0)){
			continue;
		}

		presets_garbage[i].addEventListener('garbage', function(e){
			$(this).parents('.column').find('.grid-list.songs > li input[type=checkbox], .grid-list.songs > .folder').each(function(){
				if($(this).hasClass('folder')){
					if($(this).hasClass('active')){
						$(this).remove();
					}
				}else{
					if($(this).parents('.icheckbox_minimal').hasClass('checked')){
						$(this).parents('.song').remove();
					}
				}
			});
			$('.accept-changes-in-playlist').removeClass('disabled');
			setColors();
		});

		presets_garbage[i].onclick = function(){
			this.dispatchEvent(garbage);
		}
	};
}



