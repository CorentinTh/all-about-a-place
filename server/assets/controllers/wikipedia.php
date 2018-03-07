<?php

if (isset($query) && !is_null($query) && $query != '') {

	$url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' . urlencode($query);

	$req = new Request();

	echo $req
		->url($url)
		->execute();

} else {
	$this->setError('Error in request argument.');
}

