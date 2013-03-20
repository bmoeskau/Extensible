<?php
    //
    // This file gets included at the beginning of each file in /api
    //
    
    session_start();
    //session_unset();  // uncomment to clear current session
    
    // Return errors as message + call stack, not as the default
    // HTML page since our API is Ajax-based not page based
    ini_set('html_errors', 0);
    
    // The timezone to use for all datetimes. This seems to be required on
    // Windows or it will throw an error.
    date_default_timezone_set('UTC');

    // The db connection must be manually configured on first use -- see config-template.php for details.
    // The actual config.php is included in .gitignore and is not tracked in source control.
    require(dirname(__FILE__).'/config.php');
    require(dirname(__FILE__).'/db.php');
    
    $db = new Database();
