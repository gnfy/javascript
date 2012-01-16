<?php
/**
 * ********************************************
 * Description   : 获得数据
 * Filename      : getData.php
 * Create time   : 2012-01-11 12:35:00
 * Last modified : 2012-01-11 19:11:41
 * License       : MIT, GPL
 * ********************************************
 */

$config = include_once 'config/config.php';
$per    = 10;
$page   = intval($_REQUEST['page']);
$page   = $page > 0 ? $page : 1;
$type   = $config['base_type'][intval($_REQUEST['type'])];
$url    = $config['base_data_url'].'?per='.$per.'&page='.$page.'&from=web&type='.$type;
$data   = file_get_contents($url);
echo $data;
