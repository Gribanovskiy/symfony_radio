<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  AJAX controller for MPD - admin functions	   /
/  ---------------------------------------------- */
 session_start();
 
 ini_set('default_mimetype','text/javascript');
 header("Content-type: text/javascript;  charset=utf-8");  
 
 // read config
 require("class-config.php");   
 $config = new config("../config/config.php");
 
 if (1) {
     
   // include MPD-lib and connect
   require_once 'lib-mpd.php';
   $MPD = Net_MPD::factory('Admin', $config->host, intval($config->port), $config->pass);
   if (!$MPD->connect()) {   
   	    echo json_encode('error');   	
   		die();   	    
   }
   
   // switch ond action
   $status = "";
   switch($_GET['action'])
	{
		case 'getOutputs':
			 $status = ($MPD->isCommand('outputs')) ? $MPD->getOutputs() : 'error';
			 break;
		case 'disableOutput':
			($config->checkRights("admin_mpd") && $MPD->isCommand('disableoutput')) ? $MPD->disableOutput($_GET['value']) : $status = "error";
			break;		
		case 'enableOutput':
			($config->checkRights("admin_mpd") && $MPD->isCommand('enableoutput')) ? $MPD->enableOutput($_GET['value']) : $status = "error";
			break;		
		case 'kill':
			($config->checkRights("admin_mpd") && $MPD->isCommand('kill')) ? $MPD->kill() : $status = "error";
			break;		
		case 'updateDatabase':
			($config->checkRights("admin_mpd") && $MPD->isCommand('update')) ? $MPD->updateDatabase(@$_GET['value']) : $status = "error";			
			break;					
	}
	echo json_encode($status);		
 }
?>