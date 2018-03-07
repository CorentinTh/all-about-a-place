<?php

/**
 * Class Request
 */
class Request {

	private $context = [];
	private $url = "";

	/**
	 * Request constructor.
	 * @param null $url
	 */
	public function __construct($url = null) {
		if (!is_null($url)) {
			$this->url = $url;
		}

		$this->context['http'] = [
			'header' => [],
			'method' => 'GET'
		];
		return $this;
	}

	/**
	 * @param $url
	 * @return $this
	 */
	public function url($url) {
		$this->url = $url;
		return $this;
	}

	/**
	 * @param null $getParams
	 * @param null $bodyParams
	 * @return $this
	 */
	public function get($getParams = null, $bodyParams = null) {
		if (!is_null($getParams)) {
			$this->url .= '?' . http_build_query($getParams);
		}
		if (!is_null($bodyParams)) {
			$this->setContent($bodyParams);
		}
		$this->context['http']['method'] = 'GET';
		return $this;
	}

	/**
	 * @param null $bodyParams
	 * @param null $getParams
	 * @return $this
	 */
	public function post($bodyParams = null, $getParams = null) {
		if (!is_null($getParams)) {
			$this->url .= '?' . http_build_query($getParams);
		}
		if (!is_null($bodyParams)) {
			$this->setContent($bodyParams);
		}
		$this->context['http']['method'] = 'POST';
		return $this;
	}

	/**
	 * @param $username
	 * @param $password
	 * @param string $type
	 * @return $this
	 */
	public function addCredentials($username, $password, $type = 'basic') {
		if($type == 'basic'){
			$this->addHeader("Authorization: Basic " . base64_encode("$username:$password"));
		} else if($type == 'bearer'){
			$this->addHeader("Authorization: Bearer " . $username);
		}

		return $this;
	}

	/**
	 * @param $header
	 * @return $this
	 */
	public function addHeader($header) {
		$this->context['http']['header'][] = $header;
		return $this;
	}

	/**
	 * @param $params
	 * @return $this
	 */
	private function setContent($params) {
		$this->context['http']['content'] = $params;
		return $this;
	}

	/**
	 * @return string
	 */
	public function execute() {
		$context = stream_context_create($this->context);

		$content = @file_get_contents($this->url, false, $context);

		if($content){
			return $content;
		}else{
			return implode("\n", $http_response_header);
		}

	}
}