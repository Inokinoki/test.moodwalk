<?php
/**
 * Tool for Request (Only Get in this project)
 */
class Request{
	private $_connection = null;

	function __construct($url){
		if($this->_connection == null){
            $this->_connection = curl_init($url);
        }
        // Dont show to user
        curl_setopt($this->_connection, CURLOPT_RETURNTRANSFER, 1);
	}

    function setURL($url){
        curl_setopt($this->_connection, CURLOPT_URL, $url);
    }

    function setOPT($opt, $val){
        curl_setopt($this->_connection, $opt, $val);
    }

    function exec(){
        $result = curl_exec($this->_connection);
        return $result;
    }

    function __destruct() {
        if ($this->_connection != null){
            curl_close($this->_connection);
            $this->__construct = null;
        }
    }
}
?>