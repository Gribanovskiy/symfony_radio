<?php
namespace App\PlayListBundle\Controller; 
use Symfony\Component\DependencyInjection\ContainerInterface; 
/** * Сервис для управления состоянием задач * */ 
require_once('/var/www/liferecorder/web/relaxx/include/mpd/Common.php');
require_once('/var/www/liferecorder/web/relaxx/include/mpd/Playlist.php');
class Schedules {
	private $container; 
	public function __construct(ContainerInterface $container) {
		$this->container = $container; 
	} 
	public function setPlayList___(){
		try{
			$em = $this->container ->get('doctrine') ->getManager(); 
			
			$stmt = $em->getConnection()  
					   ->prepare('SELECT title FROM Schedules WHERE start_at <= DATE_FORMAT( NOW( ) ,  "%H:%i:%s" ) ORDER BY start_at DESC LIMIT 1');  
			$stmt->execute();  
			$schedule = $stmt->fetch();
			
			$title = $schedule['title'];
			if(!$title){
				exit();
			}
			$mpd = new \Net_MPD_Playlist();
			$current_title = @file_get_contents('/var/www/liferecorder/web/cron/current.txt');
			if(trim($current_title)!=$title){
				$mpd->clear();
				$mpd->loadPlaylist($title);
				$mpd->runCommand('play');
				file_put_contents( '/var/www/liferecorder/web/cron/current.txt', $title );
			}
		}catch(Exception $e){
			echo $e->getMessage();
		}
	}
	public function setPlayList(){
		try{
			$title = "red";
			$day = date('N');
			$dayToColor = array();
			$dayToColor[1] = "red";
			$dayToColor[2] = "orange";
			$dayToColor[3] = "yellow";
			$dayToColor[4] = "green";
			$dayToColor[5] = "blue";
			$dayToColor[6] = "dark-blue";
			$dayToColor[7] = "purple";
			$title = $dayToColor[$day];
			$mpd = new \Net_MPD_Playlist();
			if($title){
				$mpd->clear();
				$mpd->loadPlaylist($title);
				$mpd->runCommand('play');
			}
		}catch(Exception $e){
			echo $e->getMessage();
		}
	} 
}