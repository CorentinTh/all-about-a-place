<?php


/**
 * Class APIManager
 */
class APIManager {
	private $controllersDir = '';
	private $errorMessages = [];
	private $hasError = false;
	private $output = '';
	private $parser;
	private $keys;
	private $url;

	/**
	 * APIManager constructor.
	 */
	public function __construct() {
		$this->url = $_SERVER['REQUEST_URI'];
		$this->controllersDir = dirname(__DIR__) . "/controllers/";

		global $API_KEYS;
		$this->keys = $API_KEYS;
	}


	/**
	 * @return string
	 */
	public function getResult() {
		$this->parser = new Parser($this->url);
		$this->verifications();

		if ($this->hasError) {
			$output = new stdClass();

			$output->errors = $this->errorMessages;
			$output->hasError = true;
			$output->ok = false;

			return json_encode($output);
		} else {
			return $this->output;
		}
	}

	/**
	 * @param $apiName
	 * @return bool
	 */
	private function exists($apiName) {
		return file_exists($this->controllersDir . $apiName . ".php");
	}

	/**
	 *
	 */
	private function verifications() {
		if ($this->parser->isValidUrl()) {
			$apiName = $this->parser->getBase();

			if ($this->exists($apiName)) {
				$this->output = $this->retrieveFile($apiName);
			} else {
				header("HTTP/1.0 404 Not Found");
				$this->setError('This API doesn\'t exist');
			}
		} else {
			header('HTTP/1.0 400 Bad Request');
			$this->setError('Invalid request');
		}
	}

	/**
	 * @param $apiName
	 * @return string
	 */
	private function retrieveFile($apiName) {
		$path = $this->controllersDir . $apiName . ".php";

		extract($this->parser->getArgs());

		ob_start();
		require $path;
		return ob_get_clean();
	}

	/**
	 * @param $msg
	 */
	private function setError($msg) {
		$this->hasError = true;
		array_push($this->errorMessages, $msg);
	}
}