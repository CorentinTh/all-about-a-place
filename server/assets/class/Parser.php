<?php

/**
 * Created by PhpStorm.
 * User: Corentin THOMASSET
 * Date: 20/02/2018
 * Time: 00:58
 */
class Parser {
	private $url = '';
	private $base = '';
	private $args = [];

	/**
	 * Parser constructor.
	 * @param $url
	 */
	public function __construct($url) {

		$base = '';
		$args = [];

		$uri = trim($url, '/ ');

		$elements = parse_url($uri);
		$path = explode('/', $elements['path']);

		if (isset($path[1])) {
			$base = $path[1];
		}

		if (isset($elements['query'])) {
			parse_str($elements['query'], $args);
		}

		$this->url = $url;
		$this->base = $base;
		$this->args = $args;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getUrl() {
		return $this->url;
	}

	/**
	 * @return string
	 */
	public function getBase() {
		return $this->base;
	}

	/**
	 * @return array
	 */
	public function getArgs() {
		return $this->args;
	}

	public function isValidUrl(){
		$baseCorrect = $this->base != '' && preg_match('/^[a-zA-Z]+[a-zA-Z-_]+[a-zA-Z]+$/', $this->base);

		return $baseCorrect;
	}
}