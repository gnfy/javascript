<?php
$url = 'http://localhost/sock/add_post.php';
$host = parse_url($url);
$fs = fsockopen($host['host'], 80, $errno, $str, 30) or die ($str .'---->'. $errno);
$val = 'key='.rawurlencode('key');
/**
$head  = 'POST '.$host['path']." HTTP/1.1\r\n";
$head .= 'Host: '.$host['host']."\r\n";
$head .= 'Keep-Alive: 115'."\r\n";
$head .= 'Connection: keep-alive'."\r\n";
$head .= 'Content-type:application/x-www-form-urlencoded'."\r\n";
$head .= 'Content-Length:'.strlen($val)."\r\n";
$head .= $val;
//print_r($head);exit;
//*/
fputs($fs, "POST ".$host['path']." HTTP/1.1\r\n");
fputs($fs, "Host: ".$host['host']."\r\n");
fputs($fs, "Content-type:application/x-www-form-urlencoded\r\n");
fputs($fs, "Content-length:".strlen($val)."\r\n");
fputs($fs, "Connection:Close\r\n\r\n");
fputs($fs, $val."\r\n");
while ( !feof($fs) ) {
    $str .= fgets($fs, 4096);
}
echo $str;
fclose($fs);
exit;
