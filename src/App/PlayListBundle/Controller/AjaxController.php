<?php

namespace App\PlayListBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\SecurityContext;
use App\PlayListBundle\Entity\Schedules;

class AjaxController extends Controller
{
	public function indexAction($action, $value)
	 {
		try{
			$this->$action($value);
		}catch(Exception $e){
			error_log($e->getMessage());
		}
	 }
	 private function getFilesCount(){
		$count = 0;
		$path = realpath('/var/lib/mpd/music');

		$objects = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path), \RecursiveIteratorIterator::SELF_FIRST);
		foreach($objects as $name => $object){
			if($object->getType()=='file'){
				$count++;
			}
		}
		die(json_encode(array('count'=>$count)));
	 }
	 
	protected function parseMp3($ThisFileInfo){
		$std = new \stdClass();
		$std->Title = isset($ThisFileInfo['tags']['id3v2']['title'][0])?$ThisFileInfo['tags']['id3v2']['title'][0]:'';
		$std->Artist = isset($ThisFileInfo['tags']['id3v2']['artist'][0])?$ThisFileInfo['tags']['id3v2']['artist'][0]:'';
		$std->Album = isset($ThisFileInfo['tags']['id3v2']['album'][0])?$ThisFileInfo['tags']['id3v2']['album'][0]:'';
		$std->Genre = isset($ThisFileInfo['tags']['id3v2']['genre'][0])?$ThisFileInfo['tags']['id3v2']['genre'][0]:'';
		return $std;
    }
	 
	 private function updateSchedule($version){
	 	$songs = array();
		
		$path = realpath('/var/lib/mpd/music');

		require_once($_SERVER['DOCUMENT_ROOT'].'/libs/getid3/getid3.php'); 
		// Initialize getID3 engine 
		$getID3 = new \getID3; 
		$data = array();
		
		$objects = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path), \RecursiveIteratorIterator::SELF_FIRST);
		foreach($objects as $name => $object){
			if($object->getType()=='file' && $object->getExtension()=='mp3'){
				$pathname = $object->getPathname();
				$basename = $object->getBasename();
				
				$ThisFileInfo = $getID3->analyze($pathname);
				
				$info = $this->parseMp3($ThisFileInfo);
				if($info->Title && $info->Artist){
					//$songs[$pathname] = str_replace("-","",str_replace(" ","", str_replace("_", "", $info->Artist . $info->Title)));//preg_replace('/[^a-zа-яё]+/iu', '', $song);
					$songs[$pathname] = preg_replace('/[^a-zа-яё]+/iu', '', $info->Artist . $info->Title);
				}else{
					//$songs[$pathname] = str_replace("-","",str_replace(" ","", str_replace("_", "", $basename)));
					$songs[$pathname] = preg_replace('/[^a-zа-яё]+/iu', '', $basename);
				}
			}
		}
		
		$fliped_songs = array_flip($songs);
	 	$k = "";
	 	$file = "";
	 	$fp = fopen("/var/lib/mpd/playlists/red.m3u",'w');
	 	fwrite($fp, '');
	 	fclose($fp);
	 	$fp = fopen("/var/lib/mpd/playlists/orange.m3u",'w');
	 	fwrite($fp, '');
	 	fclose($fp);
	 	$fp = fopen("/var/lib/mpd/playlists/yellow.m3u",'w');
	 	fwrite($fp, '');
	 	fclose($fp);
	 	$fp = fopen("/var/lib/mpd/playlists/green.m3u",'w');
	 	fwrite($fp, '');
	 	fclose($fp);
	 	$fp = fopen("/var/lib/mpd/playlists/blue.m3u",'w');
	 	fwrite($fp, '');
	 	fclose($fp);
	 	$fp = fopen("/var/lib/mpd/playlists/dark-blue.m3u",'w');
	 	fwrite($fp, '');
	 	fclose($fp);
	 	$fp = fopen("/var/lib/mpd/playlists/purple.m3u",'w');
	 	fwrite($fp, '');
	 	fclose($fp);
	 	foreach ($_POST['colors'] as $key => $value) {
	 		switch (key($value)) {
	 			case 'red':
	 				$file = "/var/lib/mpd/playlists/red.m3u";
	 				
	 				break;
	 			case 'orange':
	 				$file = "/var/lib/mpd/playlists/orange.m3u";
	 				break;
	 			case 'yellow':
	 				$file = "/var/lib/mpd/playlists/yellow.m3u";
	 				break;
	 			case 'green':
	 				$file = "/var/lib/mpd/playlists/green.m3u";
	 				break;
	 			case 'blue':
	 				$file = "/var/lib/mpd/playlists/blue.m3u";
	 				break;
	 			case 'dark-blue':
	 				$file = "/var/lib/mpd/playlists/dark-blue.m3u";
	 				break;
	 			case 'purple':
	 				$file = "/var/lib/mpd/playlists/purple.m3u";
	 				break;
	 		}
	 		if(is_writable($file)){
				$song = $value[key($value)];
				$parsed_song = preg_replace('/[^a-zа-яё]+/iu', '', $song);
				if(
					in_array(
					//str_replace("-","",str_replace(" ","", str_replace("_", "", $song)))
					$parsed_song
					, $songs)
				){
					//$pathforpl = $fliped_songs[str_replace("-","",str_replace(" ","", str_replace("_", "", $song)))];
					$pathforpl = $fliped_songs[$parsed_song];
					$pathforpl = str_replace("/var/lib/mpd/music/","",$pathforpl);
					$fp = fopen($file,'a');
					fwrite($fp, $pathforpl."\n");
 					fclose($fp);
				}else{
					$data['fail'][] = $parsed_song;
				}
				/*
	 			$song = str_replace(" ", "_", $value[key($value)]);
				$data = $this->reverse_search('/var/lib/mpd/music', $song);
				
				foreach ($data as $songe) {
					$fp = fopen($file,'a');
					fwrite($fp, str_replace("/var/lib/mpd/music/", "", $songe)."\n");
 					fclose($fp);
				}
				*/
				
			}else{
				die(json_encode(array('error'=>'не возможно произвести запись')));
			}
	 	}
	 	$data['songs'] = $songs;
	 	die(json_encode($data));
		
	 }

	 private function reverse_search($dir_path, $file_name){
		$dirs = scandir($dir_path);
		$arr = array();
		$result = array();
		foreach ($dirs as $key => $value) {			
			if(stripos($value, ".mp3")!==false){
				if(strpos($value, $file_name)!==false){
					$arr[] = $dir_path."/".$value;
				}
			}elseif(!is_dir($value)){
				$result = $this->reverse_search($dir_path."/".$value, $file_name);
				$arr = array_merge($arr, $result);
			}
		}
		return $arr;
	}
}

