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
		'maxRows' => 2,
		'username' => $this->keys['geonames']
	];

	echo $req->url("http://api.geonames.org/wikipediaSearchJSON")
		->get($params)
		->execute();
}else{
	$this->setError('Error in request argument.');
}

