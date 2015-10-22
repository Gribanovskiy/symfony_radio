<?php
# cron 0 03 * * * user /path/to/script/ script.php 27.08.15

if(!isset($argv[1])){exit();}

$curr_date = strtotime($argv[1]);

$date_num = date('N',$curr_date);

if($date_num==1){exit();}

$menu_ids = array(3936, 3939, 3948, 3942, 3945);

$n = 1;

$start_date = date('Y-m-d', strtotime(date('Y-m-d',$curr_date) . ' -' . ($date_num-$n) . ' day'));

if($date_num==6){
	$n = 2;
}elseif($date_num==7){
	$n = 3;
}

$count_id = $date_num-$n;

$finish_date = date('Y-m-d', strtotime(date('Y-m-d',$curr_date) . ' -' . ($n) . ' day'));

$sql="SELECT * 
FROM checks
WHERE id
IN (
SELECT check_id
FROM  `orders` 
WHERE menu_id
IN ( ".implode(',', $menu_ids)." ) 
GROUP BY check_id
HAVING COUNT( menu_id ) =".count($menu_ids)."
)
AND add_time
BETWEEN  '{$start_date} 00:00:00'
AND  '{$finish_date} 23:59:59'
GROUP BY user_id
HAVING COUNT( id ) = {$count_id}";

try
{
	$db = new PDO('mysql:host=localhost;dbname=database','user','password');
	$result = $db->query($sql);

	while($row = $result->fetch())
	{
		print_r($row);
	}
}
catch(PDOException $e)
{
	die("Error: ".$e->getMessage());
}