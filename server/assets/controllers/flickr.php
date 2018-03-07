<?php

if (isset($lng) && !is_null($lng) && isset($lat) && !is_null($lat)) {

	$req = new Request();
	$params = [
		'method' => 'flickr.photos.search',
		'api_key' => $this->keys['flickr'],
		'extras'=> 'url_m,geo',
		'format'=> 'json',
		'nojsoncallback'=> '1',
		'per_page'=> '10',
		'lat' => $lat,
		'lon' => $lng,
	];

	echo $req->url("https://api.flickr.com/services/rest/")
		->get($params)
		->execute();

}else{
	$this->setError('Error in request argument.');
}
