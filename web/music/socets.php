<?php
//icecast2
/*
     $services = array('http', 'ftp', 'ssh', 'telnet', 'imap',
     'smtp', 'nicname', 'gopher', 'finger', 'pop3', 'www','shout');
     
     foreach ($services as $service) {
     $port = getservbyname($service, 'tcp');
     echo $service . ": " . $port . "<br />\n";
     }
*/
$serv = getservbyport(8000,'tcp');
var_dump($serv);