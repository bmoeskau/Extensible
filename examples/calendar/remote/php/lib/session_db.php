<?php
 /**
 * @class SessionDB
 * Fake Database.  Stores records in $_SESSION
 */
class SessionDB {
    public function __construct() {
        if (!isset($_SESSION['pk'])) {
            $_SESSION['pk'] = 1020;         // <-- start fake pks at 1020
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
    public function update($idx, $rec) {
        $_SESSION['rs'][$idx] = $rec;
    }
    public function destroy($idx) {
        return array_shift(array_splice($_SESSION['rs'], $idx, 1));
    }
}

function getDT($format) {
	return date('c', strtotime(date('Y-m-d', strtotime(date('Y-m-d'))).$format));
}

function getData() {
	// Load the default starting data. Should match the data in examples/calendar/event-list.js
    return array(
        array('id' => 1001, 'cid' => 1, 'start' => getDT('-20 day +10 hour'), 'end' => getDT('-10 day +15 hour'), 'title' => 'Vacation', 'notes' => 'Have fun'),
        array('id' => 1002, 'cid' => 2, 'start' => getDT('+11 hour +30 minute'), 'end' => getDT('+13 hour'), 'title' => 'Lunch with Matt', 'loc' => 'Chuy\'s', 'url' => 'http://chuys.com', 'notes' => 'Order the queso'),
        array('id' => 1003, 'cid' => 3, 'start' => getDT('+15 hour'), 'end' => getDT('+15 hour'), 'title' => 'Project due'),
        array('id' => 1004, 'cid' => 1, 'start' => getDT(''), 'end' => getDT(''), 'title' => 'Sarah\'s birthday', 'ad' => true, 'notes' => 'Need to get a gift'),
        array('id' => 1005, 'cid' => 2, 'start' => getDT('-12 day'), 'end' => getDT('+10 day -1 second'), 'title' => 'A long one...', 'ad' => true),
        array('id' => 1006, 'cid' => 3, 'start' => getDT('+5 day'), 'end' => getDT('+7 day -1 second'), 'title' => 'School holiday'),
        array('id' => 1007, 'cid' => 1, 'start' => getDT('+9 hour'), 'end' => getDT('+9 hour +30 minute'), 'title' => 'Haircut', 'notes' => 'Get cash on the way', 'rem' => 60),
        array('id' => 1008, 'cid' => 3, 'start' => getDT('-30 day'), 'end' => getDT('-28 day'), 'title' => 'An old event', 'ad' => true),
        array('id' => 1009, 'cid' => 2, 'start' => getDT('-2 day +13 hour'), 'end' => getDT('-2 day +18 hour'), 'title' => 'Board meeting', 'loc' => 'ABC Inc.', 'rem' => 60),
        array('id' => 1010, 'cid' => 3, 'start' => getDT('-2 day'), 'end' => getDT('+3 day -1 second'), 'title' => 'Jenny\'s final exams', 'ad' => true),
        array('id' => 1011, 'cid' => 1, 'start' => getDT('+2 day +19 hour'), 'end' => getDT('+2 day +23 hour'), 'title' => 'Movie night', 'note' => 'Don\'t forget the tickets!', 'rem' => 60)
    );
}