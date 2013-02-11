<?php
    require(dirname(__FILE__).'/../init.php');
    
    $table = 'events';
    
    $action = isset($_REQUEST['action']) ? strtolower($_REQUEST['action']) : 'load';
    $id = isset($_REQUEST['id']) ? strtolower($_REQUEST['id']) : null;
    
    $processResult = function($result, $msg = null) {
        global $table;
        
        if (isset($result) && $result !== 0) {
            echo json_encode(array(
                'success' => true,
                'message' => is_null($msg) ? 'Success' : $msg,
                'data'    => $result
            ));
        }
        else {
            echo json_encode(array(
                'success'   => false,
                'message' => is_null($msg) ? 'No matching '.$table.' found' : $msg
            ));
        }
    };
    
    switch ($action) {
        case 'load':
            if (!is_null($id)) {
                // Load single row by id
                $result = $db->select($table, $id);
            }
            $processResult($result);
            break;

        case 'save':
            
            // TODO
            
            break;
        
        case 'delete':
            if (!is_null($id)) {
                $result = $db->delete($table, $id);
            }
            if ($result === 1) {
                // Return the deleted id instead of row count
                $result = $id;
            }
            $processResult($result);
            break;
    }
