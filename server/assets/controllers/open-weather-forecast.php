<?php

/*
 *  		  - Available methods -
 *
 *  To get your API token from the keys.php file:
 * 		$this->keys['api-name']
 *
 *  To trigger an error:
 * 		$this->setError('Error in request argument.')
 *
 *  Request argument are available as variables:
 * 		http://url.tld/api/api-name?arg1=foo&arg2=bar
 *
 * 		You will have :
 * 			$arg1 with value 'foo'
 * 			$arg2 with value 'bar'
 *
 */

if (isset($place) && !is_null($place) && is_string($place)) {

	$req = new Request();
	$params = [
		'q' => $_GET['place'],
		'APPID' => $this->keys['open-weather'],
		'units' => 'metric',
		'mode' => 'json'
	];

	echo $req->url("http://api.openweathermap.org/data/2.5/forecast")
		->get($params)
		->execute();

} else {
	$this->setError('Error in request argument.');
}

