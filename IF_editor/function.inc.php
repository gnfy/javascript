<?php
/**
 ******************************
 * 常用方法
 ******************************
 */

/**
 * @功能：文件上传
 * @参数：$f => 文件上传参数
 *        $f['savetype']    => 上传类型 1->本地(默认), 2->远程;
 *        $f['file']        => 上传文件的相关属性
 *        $f['allow']       => 允许上传文件类型
 *        $f['filename']    => 设定文件上传名称
 *        $f['filesize']    => 允许文件上传大小
 *        $f['basepath']    => 文件上传基本路径
 *        $f['dirpath']     => 文件上传路径
 * @返回：若上传成功，则返回上传的路径(字符串),否则返回带错误信息的数组
 */
function saveFile($f) {
    
    $file     = pathinfo(strtolower($f['file']['name'])); // 获得文件上传的相关信息
    
    $savetype = empty ($f['savetype']) ? 1 : $f['savetype'];
    $filesize = empty ($f['filesize']) ? 6 * 1024 * 1024 : $f['filesize']; // 文件大小默认6M
    $allow    = empty ($f['allow'])    ? 'jpeg,jpg,rar,txt,gif,doc,docx,xls,xlsx,bmp,png,pdf,gz' : $f['allow']; // 允许上传的文件
    $basepath = empty ($f['basepath']) ? '.' : $f['basepath'];  // 基本路径
    $dirpath  = empty ($f['dirpath'])  ? date('Y/m/d') : $f['dirpath'];   // 上传路径
    $filename = empty ($f['filename']) ? getUniqueName($dirpath, $file['extension']) : $f['filename']; // 保存的文件名称
    if ( $savetype == 1 ) {
        
        $f['file']['size'] > $filesize ? $error[] = '上传的文件过大' : '';

    } else {
        $img_code = file_get_contents($f['file']['name']);
        strlen($img_code) > 0 ? '' : $error[] = '获取不到文件';
        strlen($img_code) > $filesize ? $error[] = '上传的文件过大' : '';
    }
    strpos($allow, $file['extension']) > -1 ? '' : $error[] = '上传的文件类型不允许';
    
    if ( is_array($error)) return $error;
    
    $dirpath = $basepath.'/'.$dirpath;
    
    makeDir($dirpath); // 建立目录
    
    $return_path = $dirpath.'/'.$filename; // 返回路径
    if ( $savetype == 1 ) {
        if (!move_uploaded_file($f['file']['tmp_name'], $return_path)) $error[] = '文件移动失败';
    } else {
       if (!file_put_contents($return_path, $img_code, LOCK_EX)) $error[] = '文件保存失败';
    }

    return is_array(@$error) ? $error : $return_path;
}

/**
 * 获得当前目录下不重名的文件名
 *
 * @param string $dir 目录
 * @param string $ext 文件后缀
 * @return string 文件名
 */
function getUniqueName($dir, $ext) {
    $filename = '';
    while ( empty($filename) ) {
        $filename = time().getRandCode().'.'.$ext;
        if ( file_exists($dir.'/'.$filename) ) {
            $filename = '';
        }
    }
    return $filename;
}
/**
 * @功能：获得随机码
 * @参数：$length => 随机码长度
 * @返回：返回指定长度的随机码
 */
function getRandCode( $length = 4 ) {
    $baseCode = '0123456789abcdef';
    $str = '';
    for ($i = 0; $i < $length; $i++ ) {
        
        $p = rand(0, strlen($baseCode)-1);
        $str .= $baseCode{$p};
        
    }
    return $str;
}

/**
 * @功能：创建目录
 * @参数：$path => 要创建的目录, $mod => 指定权限
 * @返回：若创建成功返回true,否则返回false或直接跳出
 */

function makeDir($path, $mod = 0777) {
    
    if ($path == '.' || $path == '..') return false;
    $path = str_replace('\\', '/', $path);
    $dir = '';
    foreach ( explode('/', $path) as $v ) {
        $dir .= $v.'/';
        if ($v == '.' || $v == '..') continue;
        if ( !file_exists($dir) ) {
            if ( !@mkdir($dir) ) {
                exit('创建'.$dir.'失败');
            }
            @chmod($dir, $mod);
        }
    }
    return true;
}

/**
 * @功能：获得图片缩放尺寸($size[0]/$size[1] = $w/$h)
 * @参数：$picurl => 图片地址, $w => 要缩放的宽, $h => 要缩放的高
 * @返回：数组，$data[0] => 缩放后的宽, $data[1] => 缩放后的高
 */
function getZoomSize( $picurl, $w = 200, $h=200 ) {
    
    if (!$size = getimagesize($picurl)) return false;
    if ( $size[0] <= $w && $size[1] <= $h ) { // 当图片的尺寸小于缩放时，返回原图尺寸
        
        return $data = $size;
    
    }
    
    if ( $size[0] * $h / $w > $size[1] ) { // 尺寸超标
        
        $data[0] = $h * $size[0] / $size[1];
        $data[1] = $h;
    
    } else {
    
        $data[0] = $w;
        $data[1] = $w * $size[1] / $size[0];
        
    }
    
    return $data;
    
}
