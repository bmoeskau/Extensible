<?php
    session_start();
    //session_unset();  // uncomment to clear current session
    
    // Return errors as message + call stack, not as the default
    // HTML page since our API is Ajax-based not page based
    ini_set('html_errors', 0);
    
    // Format all datetime values explicitly without timezone
    // so that dates will be displayed as user-local. In a real
    // implementation you'd want to store and query as UTC then
    // convert to/from the user's actual local timezone for display.
    // For demo purposes this is good enough.
    $_SESSION['dtformat'] = 'Y-m-d\TH:i:s';
    
    // Format for recurrence exception dates.
    $_SESSION['exceptionFormat'] = 'Y-m-d\TH:i:s';
    
    // This will be the current example's session key so that multiple
    // examples can use this same server code without stepping on each other.
    $GLOBALS['app_id'] = isset($_REQUEST['app_id']) ? $_REQUEST['app_id'] : 'default';
    
    // If this is the first time this example has run init its session container.
    if (!isset($_SESSION[$GLOBALS['app_id']])) {
        $_SESSION[$GLOBALS['app_id']] = array();
    }
    
    // The timezone to use for all datetimes. This seems to be required on
    // Windows or it will throw an error.
    date_default_timezone_set('UTC');

    // base framework
    require(dirname(__FILE__).'/lib/test_data.php');
    require(dirname(__FILE__).'/lib/session_db.php');
    require(dirname(__FILE__).'/lib/application_controller.php');
    require(dirname(__FILE__).'/lib/model.php');
    require(dirname(__FILE__).'/lib/request.php');
    require(dirname(__FILE__).'/lib/response.php');
    require(dirname(__FILE__).'/lib/recur.php');

    // require /models (Should iterate app/models and auto-include all files there)
    require(dirname(__FILE__).'/app/models/event.php');

    // Fake a database connection using _SESSION
    $dbh = new SessionDB();
