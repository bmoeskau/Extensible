<?php
    require(dirname(__FILE__).'/events-common.php');
    
    // This file only supports basic, non-recurring events.
    // For recurrence support see events-recurrence.php
    
    $table = 'events';
    
    try {
        switch ($action) {
            case 'load':
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
                    // The id column is auto-increment, so remove if passed in
                    unset($event['id']);
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
    }
    catch (Exception $e) {
        handleException($e);
    }