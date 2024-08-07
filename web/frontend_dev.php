<?php
@ini_set('display_errors', 'on');
@ini_set('upload_max_filesize', '1000M');
@ini_set('default_charset', 'utf-8');
// this check prevents access to debug front controllers that are deployed by accident to production servers.
// feel free to remove this, extend it or make something more sophisticated.
if (!in_array(@$_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'), true))
{
  //die('You are not allowed to access this file. Check '.basename(__FILE__).' for more information.');
}

require_once __DIR__.'/../config/ProjectConfiguration.class.php';

$configuration = ProjectConfiguration::getApplicationConfiguration('frontend', 'dev', true);
sfContext::createInstance($configuration)->dispatch();


