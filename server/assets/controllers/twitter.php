<?php


if (!isset($count) || is_null($count) || !is_numeric($count)) {
	$count = 10;
}

if (!isset($query) || is_null($query) || !is_string($query)) {
	$this->setError('Error in request argument.');
} else {

	$key = $this->keys['twitter']['key'];
	$secret = $this->keys['twitter']['secret'];

	// Getting the bearer token
	$bearerTokenRequest = new Request();
	$baseApi = 'https://api.twitter.com/';

	$bearerTokenResultJson = $bearerTokenRequest
		->url($baseApi . 'oauth2/token')
		->post('grant_type=client_credentials')
		->addCredentials($key, $secret)
		->addHeader('Content-Type: application/x-www-form-urlencoded;charset=UTF-8')
		->execute();

	$bearerTokenResult = json_decode($bearerTokenResultJson, true);

	if (!is_array($bearerTokenResult) || !isset($bearerTokenResult['token_type']) || !isset($bearerTokenResult['access_token']) || $bearerTokenResult['token_type'] !== "bearer") {
		die("Something went wrong getting the bearer token.");
	}

	$bearerToken = $bearerTokenResult['access_token'];

	// Request
	$req = new Request();

	$params = [
		'include_entities' => 'false',
		'result_type' => 'mixed',
		'q' => $query,
		'count' => $count
	];

	echo $req
		->url($baseApi . '1.1/search/tweets.json')
		->get($params)
		->addCredentials($bearerToken, '', 'bearer')
		->execute();
}
