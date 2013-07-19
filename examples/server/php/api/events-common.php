<?php
    require(dirname(__FILE__).'/../init.php');
    require(dirname(__FILE__).'/../pretty-json.php');
    
    // Which CRUD action are we doing?
    $action = isset($_REQUEST['action']) ? strtolower($_REQUEST['action']) : 'load';
    
    // Any CUD action will include an event as JSON in the body
    $json = file_get_contents('php://input');
    $event = json_decode($json, TRUE);
    
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