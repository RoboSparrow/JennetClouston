<?php
// error_reporting(E_ALL);
//ini_set('display_errors', 1);

// Setting debug prints out data
$debug = (empty($_REQUEST['debug'])) ? false : true;

if (!empty($_REQUEST['q'])) {
        
    $soundfile = null;
    
    //split up string so it matches the max chars boundary of Google Translate
    $queries = str_split($_REQUEST['q'], 99);
    if ($debug) {
        print_r($queries);
    }
    
    //request audio
    foreach ($queries as $q) {
        $_REQUEST['q'] = $q;
        $qs = http_build_query($_REQUEST);
        $ctx = stream_context_create(array("http" => array("method" => "GET", "header" => "Referer: \r\n")));
        $soundfile .= file_get_contents("http://translate.google.com/translate_tts?" . $qs, false, $ctx);
    }
    
    //set headers
    if (!$debug) {
        header("Content-type: audio/mpeg");
        header("Content-Transfer-Encoding: binary");
        header('Pragma: no-cache');
        header('Expires: 0');
    }
    echo($soundfile);
}
exit(0);
