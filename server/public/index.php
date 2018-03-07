<?php

define('PRODUCTION', false);

$allowed_hosts = array(
	'localhost:1234',
	'corentin-thomasset.fr',
	'api-project.local',
	'all-about-a-place.corentin-thomasset.fr'
);
//$allowed_hosts = array('corentin-thomasset.fr');


if(PRODUCTION){
	if (!isset($_SERVER['HTTP_HOST']) || !in_array($_SERVER['HTTP_HOST'], $allowed_hosts)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 401 Unauthorized');
		exit;
	}else{
		if (isset($_SERVER['REQUEST_URI']) && preg_match('/^\/(api|server)\/(.*)/', $_SERVER['REQUEST_URI'])){
			header($_SERVER['SERVER_PROTOCOL'] . ' 401 Unauthorized');
			include '401.php';
			exit;
		}
	}

	header("Access-Control-Allow-Origin: http://all-about-a-place.corentin-thomasset.fr");
}else{
	header("Access-Control-Allow-Origin: *");
}




//header('content-type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: http://localhost:1234");
//header("Access-Control-Allow-Origin: http://corentin-thomasset.fr");

include_once("../assets/includes.php");

$apiManager = new APIManager();

echo $apiManager->getResult();