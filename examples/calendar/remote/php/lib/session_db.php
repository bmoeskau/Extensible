<?php
 /**
 * @class SessionDB
 * Fake Database.  Stores records in $_SESSION
 */
class SessionDB {
    public function __construct() {
        if (!isset($_SESSION[$GLOBALS['app_id']]['pk'])) {
            // start fake pks at 1020, after the hard-coded getData() events
    	    $_SESSION[$GLOBALS['app_id']]['pk'] = 1020;
    	    // populate $_SESSION with default data
            $_SESSION[$GLOBALS['app_id']]['rs'] = TestData::getEvents();
        }
    }
    // fake a database pk
    public function pk() {
        return $_SESSION[$GLOBALS['app_id']]['pk']++;
    }
    // fake a resultset
    public function rs() {
        return $_SESSION[$GLOBALS['app_id']]['rs'];
    }
    public function insert($rec) {
        array_push($_SESSION[$GLOBALS['app_id']]['rs'], $rec);
    }
    public function update($idx, $rec) {
        $_SESSION[$GLOBALS['app_id']]['rs'][$idx] = $rec;
    }
    public function destroy($idx) {
        $tmp = array_splice($_SESSION[$GLOBALS['app_id']]['rs'], $idx, 1);
        $newarray = array_shift($tmp);
        return $newarray;
    }
}