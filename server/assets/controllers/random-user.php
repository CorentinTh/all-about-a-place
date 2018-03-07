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

$req = new Request();

echo $req->url("https://randomuser.me/api")->get()->execute();

