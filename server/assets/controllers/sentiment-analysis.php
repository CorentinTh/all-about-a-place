<?php


$data = $_POST['data'];

if (!is_null($data) && $data != '') {
	$url = "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27";
	$username = $this->keys['ibm-text-processing']['username'];
	$password = $this->keys['ibm-text-processing']['password'];

	$req = new Request();

	if(PRODUCTION){
		echo $req
			->url($url)
			->post($data)
			->addCredentials($username, $password)
			->addHeader("Content-Type: application/json")
			->execute();
	}else{
		echo '';
	}

} else {
	$this->setError('Error in request argument.');
}

