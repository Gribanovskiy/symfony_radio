<?php

// Set your return content type
header('Content-type: audio/ogg,mp3');
 
$daurl = 'http://liferecorder.shcg.ru:8000/mpd.ogg';

// Get that website's content
$handle = fopen($daurl, "r");
 
// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = stream_get_contents($handle, 128);
        echo $buffer;
    }
    fclose($handle);
}

?>