<?php
$goods = urldecode($_COOKIE['goodscar']);
$data = json_decode($goods);
foreach($data as $key => $val){
    $val -> name = gbkRawUrlDecode($val -> name);
    //$val -> name = iconv('utf-8','gbk',$val -> name);
    $data[$key] = $val;
}
print_r($goods);
print_R($data);

function gbkRawUrlDecode ($source) { 
    $decodedStr = ""; 
    $pos = 0; 
    $len = strlen ($source); 
    while ($pos < $len) { 
        $charAt = substr ($source, $pos, 1); 
        if ($charAt == '%') { 
            $pos++; 
            $charAt = substr ($source, $pos, 1); 
            if ($charAt == 'u') { 
                // we got a unicode character 
                $pos++; 
                $unicodeHexVal = substr ($source, $pos, 4); 
                $unicode = hexdec ($unicodeHexVal); 
                $entity = "&#". $unicode . ';';
                $decodedStr .= $entity;
                $pos += 4; 
            } 
            else { 
                // we have an escaped ascii character 
                $hexVal = substr ($source, $pos, 2); 
                $decodedStr .= chr (hexdec ($hexVal)); 
                $pos += 2; 
            } 
        } else { 
            $decodedStr .= $charAt; 
            $pos++; 
        } 
    } 
    return $decodedStr; 
} 
?>