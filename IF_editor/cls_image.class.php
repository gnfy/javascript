<?php
/**
 ******************************************
 * 图片处理类
 ******************************************
 */

class cls_image {

    public $srcImg; // 图片源
    
    public $dstImg; // 输出图片地址

    public $dst_w = 200; // 缩放的宽度

    public $dst_h = 200; // 缩放的高度

    // 图片类型列表
    public $type_list = array(
                1 => 'gif',
                2 => 'jpg',
                3 => 'png',
                6 => 'bmp'
            );
    // 图片生成命令列表
    public $image_command = array (
            'gif' => 'imagegif',
            'jpg' => 'imagejpeg',
            'png' => 'imagepng'
        );
    
    /**
     * 设置图片源
     *
     * @param string $srcImg 源图片地址
     */
    function setSrcImg($srcImg){
        $this->srcImg = $srcImg;
    }

    /**
     * 设置输出图片地址
     *
     * @param string $dstImg 输出图片地址
     */
    function setDstImg($dstImg){
        $this->dstImg = $dstImg;
    }

    /**
     * 设置输出图片的宽度
     *
     * @param int $w 缩放图片的宽度
     */
    function setDstImg_w($w) {
        $this->dst_w = $w;
    }

    /**
     * 设置输出图片的高度
     *
     * @param int $h 缩放图片的高度
     */
    function setDstImg_h($h){
        $this->dst_h = $h;
    }

    /**
     * 生成缩略图
     *
     * @param   array   $param              缩略图参数
     * @说明：
     *          int     $param['width']     缩略图宽度
     *          int     $param['height']    缩略图高度
     *          string  $param['srcImg']    源图片地址
     *          string  $param['dstImg']    输出图片地址
     *
     * @return  boolean  如果成功，则返回true,否则返回false
     */
    function thumb_img( $param = null ){
        
        // 获得GD信息
        $gd = $this->gd_version();
        if ($gd == 0) {
            echo '服务器不支持GD库';
            return false;
        }
        
        // 缩略图相关参数
        $width  = empty ($param['width'])  ? $this->dst_w  : $param['width'];
        $height = empty ($param['height']) ? $this->dst_h  : $param['height'];
        $srcImg = empty ($param['srcImg']) ? $this->srcImg : $param['srcImg'];
        $dstImg = empty ($param['dstImg']) ? $this->dstImg : $param['dstImg'];
        
        if ( !file_exists($srcImg) ) {
            echo '没有源图片';
            return false;
        }
        // 若没有为缩略图命名，则自动生成 
        if ( empty($dstImg) ) {
            
            $img_info = pathinfo($srcImg);
            $dstImg   = $img_info['dirname'].'/thumb_'.$img_info['basename'];
        
        }

        $src_info = @getimagesize($srcImg);
        $src_w    = $src_info[0];  // 源图片宽
        $src_h    = $src_info[1];  // 源图片高
        
        $img_str = file_get_contents($srcImg);
        if ( $src_info[2] == 6 ) { // bmp 不缩放
            
            file_put_contents($dstImg, $img_str, LOCK_EX);
        
        } else {

            $h_src = imagecreatefromstring($img_str);

            // 缩略图尺寸
            $thumb_size = $this->getThumbSize($srcImg, $width, $height);

            $dst_w = $thumb_size[0]; // 缩略图结束宽
            $dst_h = $thumb_size[1]; // 缩略图结束高
            
            $h_dst = imagecreatetruecolor($thumb_size[0], $thumb_size[1]);
            $rgb = imagecolorallocate($h_dst, 255, 255, 255);
            imagefilledrectangle($h_dst, 0, 0, $thumb_size[0], $thumb_size[1], $rgb);
            imagecopyresampled($h_dst, $h_src, 0, 0, 0, 0, $dst_w, $dst_h, $src_w, $src_h);
        
            $func = $this->image_command[$this->type_list[$src_info[2]]];
            $func($h_dst, $dstImg);
            
            imagedestroy($h_dst);  
            imagedestroy($h_src);
        
        }
        if (file_exists($dstImg)) {
            return true;
        } else {
            return false;
        }
         
    }

    /**
     * @功能：获得图片缩放尺寸($size[0]/$size[1] = $w/$h)
     * @参数：$picurl => 图片地址, $w => 要缩放的宽, $h => 要缩放的高
     * @返回：数组，$data[0] => 缩放后的宽, $data[1] => 缩放后的高
     */
    function getZoomSize( $picurl = '', $w = '', $h = '' ) {
        
        if (!$size = @getimagesize($picurl)) return false;

        $w = empty ($w) ? $this->dst_w : $w;
        $h = empty ($h) ? $this->dst_h : $h;
        
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

    /**
     * 获得图片缩放尺寸(将最大的边距缩放到限定大小)
     *
     * @param   string  $path   图片地址
     * @param   int     $w      限定的宽
     * @param   int     $h      限定的高
     * @return  array   $data   缩放后的尺寸数组,$data[0] => width, $data[1] => height
     */
    function getThumbSize($path = '', $w = '', $h = ''){
        
        if (!$size = @getimagesize($path)) return false; 
        
        $w = empty ($w) ? $this->dst_w : $w;
        $h = empty ($h) ? $this->dst_h : $h;

        if ( $size[0] <= $w && $size[1] <= $h ) {
            return $size; 
        }

        // 源图片宽大于等于高
        if ( $size[0] >= $size[1] ) {
            
            $data[0] = $w;
            $data[1] = $w * $size[1] / $size[0];

        } else { // 源图片高大于宽
            
            $data[0] = $h * $size[0] / $size[1];
            $data[1] = $h;

        }

        return $data;
    
    }
    
    /**
     * 获得图片后缀名
     *
     * @access public
     * @param  string $path 图片地址
     * @return string 文件后缀名
     */
    function getImgType($path){
        $pos_ext = strrpos($path, '.');
        if ( $pos_ext > 0  ) {
            return substr($path, $pos_ext);
        } else {
            return '';
        }
    }
    
    /**
     * @功能：获得服务器上的 GD 版本
     *
     * @access      public
     * @return      int         可能的值为0，1，2
     */
    function gd_version() {
        static $version = -1;

        if ($version >= 0) {
            return $version;
        }

        if (!extension_loaded('gd')) {
            $version = 0;
        } else {
            // 尝试使用gd_info函数
            if (PHP_VERSION >= '4.3') {
                if (function_exists('gd_info')) {
                    $ver_info = gd_info();
                    preg_match('/\d/', $ver_info['GD Version'], $match);
                    $version = $match[0];
                } else {
                    if (function_exists('imagecreatetruecolor')) {
                        $version = 2;
                    } elseif (function_exists('imagecreate')) {
                        $version = 1;
                    }
                }
            } else {
                if (preg_match('/phpinfo/', ini_get('disable_functions'))) {
                    /* 如果phpinfo被禁用，无法确定gd版本 */
                    $version = 1;
                } else {
                  // 使用phpinfo函数
                   ob_start();
                   phpinfo(8);
                   $info = ob_get_contents();
                   ob_end_clean();
                   $info = stristr($info, 'gd version');
                   preg_match('/\d/', $info, $match);
                   $version = $match[0];
                }
            }
        }
        return $version;
    }
    
}
