<?php

define('PRODUCTION', true);

if (PRODUCTION) {
	$allowed_hosts = array(
		'localhost:1234',
		'corentin-thomasset.fr',
		'api-project.local',
		'all-about-a-place.corentin-thomasset.fr'
	);

	$fromBadHost = !isset($_SERVER['HTTP_HOST']) || !in_array($_SERVER['HTTP_HOST'], $allowed_hosts);
	$notAjaxRequest = !isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest';
	$rootRequest = isset($_SERVER['REQUEST_URI']) && preg_match('/^\/(api|server)\/*$/', $_SERVER['REQUEST_URI']);

	if ($fromBadHost || $notAjaxRequest || $rootRequest) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 401 Unauthorized');
		include '401.php';
		exit;
	}

	header("Access-Control-Allow-Origin: https://all-about-a-place.corentin-thomasset.fr");
} else {
	header("Access-Control-Allow-Origin: *");
}

include_once("../assets/includes.php");

$apiManager = new APIManager();

echo $apiManager->getResult();