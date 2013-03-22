<?php
    //
    // This file is for API testing only. The application entry point is init.php.
    //
    
    // Return errors as message + call stack, not as the default
    // HTML page since our API is Ajax-based not page based
    ini_set('html_errors', 0);
    
    // The timezone to use for all datetimes. This seems to be required on
    // Windows or it will throw an error.
    date_default_timezone_set('UTC');
    
    require(dirname(__FILE__).'/config.php');
    require(dirname(__FILE__).'/db.php');
    require(dirname(__FILE__).'/pretty-json.php');
    
    $db = new Database();
    
    function out($data, $pretty = true) {
        $json = json_encode($data);
        echo $pretty ? pretty($json) : $json;
    };
    
    // READ
    //------------------------------------------------
    // Select all:
    //------------------------------------------------
    out($db->select('events'));
    // out($db->select('calendars'));
    
    // Select by id:
    // out($db->select('events', 45));
    // out($db->select('calendars', 3));
    
    //------------------------------------------------
    // Query by other cols:
    //------------------------------------------------
    // Single column:
    // out($db->query('events', array(
        // 'calendar_id' => 2
    // )));
    
    // Single column, custom comparator:
    // out($db->query('events', array(
        // 'calendar_id' => array(
            // 'value' => 2,
            // 'comparator' => '>='
        // )
    // )));
    
    // Multi-column, mixed styles:
    // out($db->query('events', array(
        // 'calendar_id' => 2,
        // 'start' => array(
            // 'value' => '2013-02-01',
            // 'comparator' => '>'
        // )
    // )));
    
    // Multi-column with custom comparator (defaults to =) and conjunction (defaults to AND):
    // out($db->query('events', array(
        // 'title' => array(
            // 'value' => 'lunch',
            // 'comparator' => 'LIKE'
        // ),
        // 'calendar_id' => array(
            // 'value' => 3,
            // 'conjunction' => 'OR'
        // )
    // )));
    
    // Multiple clauses for the same column:
    // out($db->query('events', array(
        // array(
            // 'column' => 'start', // must use the 'column' key
            // 'value' => '2013-01-01',
            // 'comparator' => '>='
        // ),
        // array(
            // 'column' => 'start', // must use the 'column' key
            // 'value' => '2013-03-31',
            // 'comparator' => '<='
        // )
    // )));
    
    // CREATE
    //------------------------------------------------
    // out($db->insert('events', array(
        // 'title' => 'Test event',
        // 'start' => '2013-02-15 12:00:00',
        // 'end' => '2013-02-15 13:00:00'
    // )));
    // out($db->insert('calendars', array(
        // 'id' => 5,
        // 'title' => 'Test calendar',
        // 'color' => 10
    // )));
    
    // UPDATE
    //------------------------------------------------
    // out($db->update('events', array(
        // 'id' => 45,
        // 'title' => 'Test event',
        // 'start' => '2013-02-15 12:00:00',
        // 'end' => '2013-02-15 13:00:00'
    // )));
    // out($db->update('calendars', array(
        // 'id' => 1,
        // 'title' => 'Test calendar',
        // 'color' => 10
    // )));
    
    // DELETE
    //------------------------------------------------
    // out($db->delete('events', 45));
    // out($db->delete('calendars', 1));
?>