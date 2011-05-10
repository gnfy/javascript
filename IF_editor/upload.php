<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<style>
a{color:#261CDC}
</style>
</head>
<body style="margin:0;padding:0;text-align:center;">
<div style="z-index:999;text-align:center;margin-top:20px;">
    <div>图片上传中....</div>
    <div><img src="images/loader.gif" border="0" /></div>
</div>
<?php
error_reporting(E_ALL ^E_NOTICE);
include_once 'function.inc.php';
include_once 'cls_image.class.php';
$path = '';

if ( $_FILES['if_img_local']['size'] > 0 ) {
       
    $f['savetype']  = 1;
    $f['file']      = $_FILES['if_img_local'];
    
} else if ($_POST['if_img_url']) {
    
        $f['savetype'] = 2;
        $f['file']['name'] = trim($_POST['if_img_url']);

} else {

    die('没有可以上传的图片');

}

$f['basepath']  = 'upload';
$f['allow']     = 'jpg,jpeg,bmp,png,gif';
$f['dirpath']   = 'temp';
$path           = saveFile($f); // 上传文件

if ( is_array ($path) ){ 
    echo '图片上传出现错误信息：'.implode(',', $path);
    exit;
}

$img       = pathinfo($path);
$thumb_img = $img['dirname'].'/thumb_'.$img['basename'];
$thumb     = new cls_image();
$thumb->dst_w = 200;
$thumb->dst_h = 200;
$thumb->setSrcImg($path);
$thumb->setDstImg($thumb_img);
$thumb->thumb_img();
$imgSize = $thumb->getThumbSize($path);

$style = 'style="margin:12px;float:'.$_POST['if_img_pos'].';width:'.round($imgSize[0]).';height:'.round($imgSize[1]).'"';

?>
<script type="text/javascript">
var editor = parent.IFeditor;
var html = '<img class="IF_image" <?php echo $style;?> onresize="false" changedsize="false" src="<?php echo $thumb_img;?>"  />';
editor.insertHTMLToIF(html);
editor.destroy_pop();
</script>
</body>
</html>
