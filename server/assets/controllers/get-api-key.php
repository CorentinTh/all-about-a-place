<?php

if (isset($api) && !is_null($api) && $api != '') {
	$data = new stdClass();

	$data->key = '';
	$data->firebase = '';

	if($api == 'google-maps'){
		$data->key = $this->keys['google-maps'];
		$data->firebase = $this->keys['firebase'];
	}

	echo json_encode($data);

}else{
	$this->setError('Error in request argument.');
}