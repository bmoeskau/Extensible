<?php
 /**
 * @class SessionDB
 * Fake Database.  Stores records in $_SESSION
 */
class SessionDB {
    public function __construct() {
        if (!isset($_SESSION['pk'])) {
            $_SESSION['pk'] = 10;           // <-- start fake pks at 10
            $_SESSION['rs'] = getData();    // <-- populate $_SESSION with data.
        }
    }
    // fake a database pk
    public function pk() {
        return $_SESSION['pk']++;
    }
    // fake a resultset
    public function rs() {
        return $_SESSION['rs'];
    }
    public function insert($rec) {
        array_push($_SESSION['rs'], $rec);
    }
    public function update($idx, $attributes) {
        $_SESSION['rs'][$idx] = $attributes;
    }
    public function destroy($idx) {
        return array_shift(array_splice($_SESSION['rs'], $idx, 1));
    }
}

// Sample data.
function getData() {
    return array(
        array('id' => 1, 'cid' => 1, 'title' => "Vacation", 'start' => '2010-09-15', 'end' => '2010-09-24', 'ad' => false, 'notes' => 'Have fun')
    );
}


//        "id":1001,
//        "cid":1,
//        "t":"Vacation",
//        "start":today.add(Date.DAY, -20).add(Date.HOUR, 10),
//        "end":today.add(Date.DAY, -10).add(Date.HOUR, 15),
//        "ad":false,
//        "notes":"Have fun"