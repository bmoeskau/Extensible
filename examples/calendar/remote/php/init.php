<?php
    session_start();
    //session_unset();  // uncomment to clear current session
    
    // Return errors as message + call stack, not as the default
    // HTML page since our API is Ajax-based not page based
    ini_set(html_errors, 0);
    
    // Format all datetime values explicitly without timezone
    // so that dates will be displayed as user-local. In a real
    // implementation you'd want to store and query as UTC then
    // convert to/from the user's actual local timezone for display.
    // For demo purposes this is good enough.
    $_SESSION['dtformat'] = 'Y-m-d\TH:i:s';
    
    // Format for recurrence exception dates. For hourly recurrence
    // time would also be required, but since the minimum recurrence
    // resolution supported by the calendar is daily, storing exceptions
    // as dates with no time is good enough for now.
    $_SESSION['exceptionFormat'] = 'Y-m-d';
    
    // The timezone to use for all datetimes so they are set consistently
    //date_default_timezone_set('America/Chicago');

    // base framework
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
