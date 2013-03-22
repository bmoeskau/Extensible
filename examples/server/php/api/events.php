<?php
    require(dirname(__FILE__).'/../init.php');
    require(dirname(__FILE__).'/../pretty-json.php');
    
    $table = 'events';
    
    $action = isset($_REQUEST['action']) ? strtolower($_REQUEST['action']) : 'load';
    $id = isset($_REQUEST['id']) ? strtolower($_REQUEST['id']) : null;
    $start_dt = isset($_REQUEST['startDate']) ? strtolower($_REQUEST['startDate']) : null;
    $end_dt = isset($_REQUEST['endDate']) ? strtolower($_REQUEST['endDate']) : null;
    
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
            if (isset($id)) {
                // Load single row by id
                out($db->select($table, $id));
            }
            else if (isset($start_dt) && isset($end_dt)) {
                // Query by date range
                out($db->query($table, array(
                    array(
                        'column' => 'start',
                        'value' => $start_dt,
                        'comparator' => '>='
                    ),
                    array(
                        'column' => 'end',
                        'value' => $end_dt,
                        'comparator' => '<='
                    )
                )));
            }
            break;

        case 'save':
            
            // TODO
            
            break;
        
        case 'delete':
            if (isset($id)) {
                $result = $db->delete($table, $id);
            }
            if ($result === 1) {
                // Return the deleted id instead of row count
                $result = $id;
            }
            out($result);
            break;
    }
