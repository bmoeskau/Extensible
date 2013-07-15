<?php
    require(dirname(__FILE__).'/../init.php');
    require(dirname(__FILE__).'/../pretty-json.php');
    
    $table = 'events';
    
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
                'message' => isset($msg) ? $msg : 'No matching '.$table.' found'
            ));
        }
    };
    
    if ($fail) {
        echo json_encode(array(
            'success' => false,
            'message' => 'The server could not process the request'
        ));
        die();
    }
    
    switch ($action) {
        case 'load':
            $start_dt = isset($_REQUEST['startDate']) ? strtolower($_REQUEST['startDate']) : null;
            $end_dt = isset($_REQUEST['endDate']) ? strtolower($_REQUEST['endDate']) : null;
            
            if (isset($event) && isset($event['id'])) {
                // Load single row by id
                out($db->select($table, $event['id']));
            }
            else if (isset($start_dt) && isset($end_dt)) {
                // Query by date range for displaying a calendar view
                $sql = 'SELECT * FROM events WHERE app_id = :app_id'.
                        ' AND ((start >= :start AND start <= :end)'. // starts in range
                        ' OR (end >= :start AND end <= :end)'.        // ends in range
                        ' OR (start <= :start AND end >= :end))';      // spans range
                
                out($db->querySql($sql, array(
                    ':app_id' => $app_id,
                    ':start'  => $start_dt,
                    ':end'    => $end_dt
                )));
            }
            break;

        case 'add':
            if (isset($event)) {
                $result = $db->insert($table, $event);
            }
            out($result);
            break;
        
        case 'update':
            if (isset($event)) {
                $result = $db->update($table, $event);
            }
            out($result);
            break;
        
        case 'delete':
            if (isset($event)) {
                $result = $db->delete($table, $event['id']);
            }
            if ($result === 1) {
                // Return the deleted id instead of row count
                $result = $event['id'];
            }
            out($result);
            break;
    }
