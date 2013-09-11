<?php
    require(dirname(__FILE__).'/../init.php');
    require(dirname(__FILE__).'/../pretty-json.php');
    
    // Which CRUD action are we doing?
    $action = isset($_REQUEST['action']) ? strtolower($_REQUEST['action']) : 'load';
    
    // Any CUD action will include an event as JSON in the body
    $json = file_get_contents('php://input');
    $event = json_decode($json, TRUE);
    
    // Clean the event.
    // MySQL doesn't really have a true boolean type, so convert to int for this demo
    $event['all_day'] = $event['all_day'] === TRUE ? 1 : 0;
    
    // Grab the requested start and end dates if supplied
    $start_dt = isset($_REQUEST['startDate']) ? strtolower($_REQUEST['startDate']) : null;
    $end_dt = isset($_REQUEST['endDate']) ? strtolower($_REQUEST['endDate']) : null;
    
    if (isset($end_dt)) {
        // Add a day to the end date to include event times on that day (since times are not passed)
        $endDate = new DateTime($end_dt);
        $endDate->modify('+1 day');
        $end_dt = $endDate->format('Y-m-d');
    }
    
    // Set the app_id to allow each example to reuse this API with its own data.
    // In a real application this would not be needed.
    $app_id = $event['app_id'] = isset($_REQUEST['app_id']) ? strtolower($_REQUEST['app_id']) : null;
    
    // The demos support simulating server failure for testing purposes
    $fail = isset($_REQUEST['fail']) ? TRUE : FALSE;

    // Helper function for outputting event resposnes consistently
    function out($result, $msg = null) {
        global $table;
        
        if (isset($result) && $result !== 0) {
            echo json_encode(array(
                'success' => true,
                'message' => isset($msg) ? $msg : 'Success',
                'data'    => $result
            ));
        }
        else {
            echo json_encode(array(
                'success' => false,
                'message' => isset($msg) ? $msg : 'No matching events found'
            ));
        }
    };
    
    if ($fail) {
        // The client requested a hard-coded failure, useful for testing
        echo json_encode(array(
            'success' => false,
            'message' => 'The server could not process the request'
        ));
        die();
    }
    
    function handleException($e) {
        $msg = $e->getMessage();
        
        if (preg_match('/table(.+)not found/i', $msg)) {
            out(0, 'Your database does not appear to be properly configured. '.
                    'Please see Extensible > examples > server > README.md. Details: '.$msg);
        }
        else if (preg_match('/can\'t connect/i', $msg)) {
            out(0, 'Cannot connect to the database. Please ensure that the database is started '.
                    'and configured per Extensible > examples > server > README.md. Details: '.$msg);
        }
        else {
            out(0, $msg);
        }
        die();
    }
