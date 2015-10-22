var dropZone = $('#dropZone'),
    maxFileSize = 100000000; // максимальный размер файла - 100 мб.

jQuery(document).ready(function(){

	var refreshedTracks = refreshTracklist("","/");
	refreshList(refreshedTracks, '/');

	var playlists = getPlaylists();
	for(playlist in playlists){
		var p = getListPlaylist(playlists[playlist]);
		if(typeof p.file != 'undefined'){
			addPlaylist(playlists[playlist], p);
		}
	}

	//set actions
	actions();

	$('.accept-changes-in-playlist').on('click', function(){
		$(this).find('span').text('loading...');
		$('#circleG').addClass('active');
		updateSchedule(colors);
		return false;
	});

	$(document).on('click', '.icheckbox_minimal', function(){
		if($(this).hasClass('checked')){
			$(this).removeClass('checked');
		}else{
			$(this).addClass('checked');
		}
		
	});

	var h = $('.general.column').height();
	$('.column:not(.general)').each(function(){
		$(this).height(h);
	});

	$(document).on('contextmenu', '.folder', function(e){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});

	$(document).on('click', '.folder', function(e){
		var folder = $(this).text();
		var refreshedTracks = refreshTracklist("",folder);
		refreshList(refreshedTracks, '/');
	});

	$('.sort.alphabet').on('click', function(){
		if($(this).hasClass('sorted')){
			$(this).removeClass('sorted');
			tinysort('#grid-list-songs > li', {selector:'.tinysortf'});
			tinysort('#grid-list-songs > li', {selector:'.tinysort'});
		}else{
			$(this).addClass('sorted');
			tinysort('#grid-list-songs > li', {selector:'.tinysortf',order:'desc'});
			tinysort('#grid-list-songs > li', {selector:'.tinysort',order:'desc'});
		}
	});

    if (typeof(window.FileReader) == 'undefined') {
	    dropZone.text('Не поддерживается браузером!');
	    dropZone.addClass('error');
	}

	dropZone[0].ondragover = function() {
	    dropZone.addClass('hover');
	    return false;
	};
	    
	dropZone[0].ondragleave = function() {
	    dropZone.removeClass('hover');
	    return false;
	};

	var file = '';

	dropZone[0].ondrop = function(event) {
	    event.preventDefault();
	    dropZone.removeClass('hover');
	    dropZone.addClass('drop');

	    var files = event.dataTransfer.files;
		var reader = new FileReader();
		reader.onloadend = function(e){
			
		}

		// reader.addEventListener('progress', uploadProgress, false);
		// reader.onloadend = function () {
		// 	var p = reader.result;
		// 	console.log(p);
		// 	//$('body').prepend('<audio id="test_song" controls="true" src="'+p+'">');
		// 	//document.getElementById('test_song').play();
		// }

		// if (files[0]) {
		// 	reader.readAsDataURL(files[0]);
		// 	//console.log(reader);
		// } else {
		// 	p = "";
		// }
		
	    //console.log(event.dataTransfer);
		return;
	};
	        
	if (file.size > maxFileSize) {
	    dropZone.text('Файл слишком большой!');
	    dropZone.addClass('error');
	    return false;
	}

});

function uploadProgress(event) {
	
    var percent = parseInt(event.loaded / event.total * 100);
	console.log(percent);
    dropZone.text('Загрузка: ' + percent + '%');
}

function stateChange(event) {
    if (event.target.readyState == 4) {
        if (event.target.status == 200) {
            dropZone.text('Загрузка успешно завершена!');
        } else {
            dropZone.text('Произошла ошибка!');
            dropZone.addClass('error');
        }
    }
}