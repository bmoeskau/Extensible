<?php
    require(dirname(__FILE__).'/../init.php');
    require(dirname(__FILE__).'/../pretty-json.php');
    
    $table = 'events';
    
    $action = isset($_REQUEST['action']) ? strtolower($_REQUEST['action']) : 'load';
    // $id = isset($_REQUEST['id']) ? strtolower($_REQUEST['id']) : null;
    $start_dt = isset($_REQUEST['startDate']) ? strtolower($_REQUEST['startDate']) : null;
    $end_dt = isset($_REQUEST['endDate']) ? strtolower($_REQUEST['endDate']) : null;
    
    $json = file_get_contents('php://input');
    $event = json_decode($json, TRUE);

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
    
    switch ($action) {
        case 'load':
            if (isset($event) && isset($event['id'])) {
                // Load single row by id
                out($db->select($table, $event['id']));
            }
            else if (isset($start_dt) && isset($end_dt)) {
                $sql = 'SELECT * FROM events'.
                        ' WHERE (start >= :start AND start <= :end)'. // starts in range
                        ' OR (end >= :start AND end <= :end)'.        // ends in range
                        ' OR (start <= :start AND end >= :end)';      // spans range
                
                out($db->querySql($sql, array(
                    ':start' => $start_dt,
                    ':end'   => $end_dt
                )));
            }
            break;

        case 'save':
            
            // TODO
            
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
