<?php
/**
 * @class Events
 * A simple application controller extension
 */
class TestData {
    /**
     * Helper method to generate dates relative to the current date
     */
    private static function getDt($format) {
        // Today (date only with no time component so everything starts consistently).
        // Use the passed start date if provided (for consistent unit test results).
        $today = isset($_REQUEST['app_start_dt']) ? $_REQUEST['app_start_dt'] : date('Y-m-d');
        // Add/subtract from today based on the format passed in, e.g. "+5 days"
        $newDate = strtotime($today.$format);
        // Convert the new timestamp back to a properly-formatted date to return
        return date($_SESSION['dtformat'], $newDate);
    }
    
    /**
     * Helper that returns the max supported date (e.g., "no end date")
     */
    private static function getMaxDt() {
        return date($_SESSION['dtformat'], PHP_INT_MAX);
    }
    
    /**
     * Called from the example code to get the default starting set of events
     * to display. The "app_id" key can be set by any example to load a different
     * set of data from the default as shown below.
     */
    public static function getEvents() {
        if (isset($GLOBALS['app_id']) && substr($GLOBALS['app_id'], 0, 11) === 'recurrence_') {
            return self::getRecurringEvents();
        }
        return self::getStandardEvents();
    }
    
    /**
     * Generate test data for standard (non-recurring) events
     */
    public static function getStandardEvents() {
        return array(
            array(
                'id' => 1001,
                'cid' => 1,
                'start' => self::getDt('-20 day +10 hour'),
                'end' => self::getDt('-10 day +15 hour'),
                'title' => 'Vacation',
                'notes' => 'Have fun'
            ),
            array('id' => 1002,
                'cid' => 2,
                'start' => self::getDt('+11 hour +30 minute'),
                'end' => self::getDt('+13 hour'),
                'title' => 'Lunch with Matt',
                'loc' => 'Chuy\'s',
                'url' => 'http://chuys.com',
                'notes' => 'Order the queso'
            ),
            array('id' => 1003,
                'cid' => 3,
                'start' => self::getDt('+15 hour'),
                'end' => self::getDt('+15 hour'),
                'title' => 'Project due'
            ),
            array('id' => 1004,
                'cid' => 1,
                'start' => self::getDt(''),
                'end' => self::getDt(''),
                'title' => 'Sarah\'s birthday',
                'ad' => true,
                'notes' => 'Need to get a gift'
            ),
            array('id' => 1005,
                'cid' => 2,
                'start' => self::getDt('-12 day'),
                'end' => self::getDt('+10 day -1 second'),
                'title' => 'A long one...',
                'ad' => true
            ),
            array('id' => 1006,
                'cid' => 3,
                'start' => self::getDt('+5 day'),
                'end' => self::getDt('+7 day -1 second'),
                'title' => 'School holiday'
            ),
            array('id' => 1007,
                'cid' => 1,
                'start' => self::getDt('+9 hour'),
                'end' => self::getDt('+9 hour +30 minute'),
                'title' => 'Haircut',
                'notes' => 'Get cash on the way',
                'rem' => 60
            ),
            array('id' => 1008,
                'cid' => 3,
                'start' => self::getDt('-30 day'),
                'end' => self::getDt('-28 day'),
                'title' => 'An old event',
                'ad' => true
            ),
            array('id' => 1009,
                'cid' => 2,
                'start' => self::getDt('-2 day +13 hour'),
                'end' => self::getDt('-2 day +18 hour'),
                'title' => 'Board meeting',
                'loc' => 'ABC Inc.',
                'rem' => 60
            ),
            array('id' => 1010,
                'cid' => 3,
                'start' => self::getDt('-2 day'),
                'end' => self::getDt('+3 day -1 second'),
                'title' => 'Jenny\'s final exams',
                'ad' => true
            ),
            array('id' => 1011,
                'cid' => 1,
                'start' => self::getDt('+2 day +19 hour'),
                'end' => self::getDt('+2 day +23 hour'),
                'title' => 'Movie night',
                'note' => 'Don\'t forget the tickets!',
                'rem' => 60
            )
        );
    }
    
    /**
     * Generate recurrence test data.
     * 
     * 'duration' and 'rrule' are required (in addition to the 'end' date representing the series
     * end date) to make a recurring event. All other recurrence-specific attributes you may see in
     * code or defined in the EventMappings are used only at runtime to handle editing.
     */
    public static function getRecurringEvents() {
        return array(
            array(
                'id' => 1001,
                'cid' => 1,
                'title' => 'Recur daily 10 times',
                'start' => self::getDt('+8 hour'),
                'end' => self::getDt('+10 day'),
                'duration' => 120,
                'rrule' => 'FREQ=DAILY;COUNT=10'
            ),
            array(
                'id' => 1002,
                'cid' => 2,
                'title' => 'Recur weekly 8 times',
                'start' => self::getDt('+1 hour'),
                'end' => self::getDt('+8 week'),
                'duration' => 0,
                'ad' => true,
                'rrule' => 'FREQ=WEEKLY;COUNT=8'
            ),
            array(
                'id' => 1003,
                'cid' => 3,
                'title' => 'Recur weekdays',
                'start' => self::getDt('-3 week +13 hour'),
                'end' => self::getMaxDt(),
                'duration' => 60,
                'rrule' => 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR'
            ),
            array(
                'id' => 1004,
                'cid' => 4,
                'title' => 'Recur last Friday of month',
                'start' => self::getDt('-5 week'),
                'end' => self::getMaxDt(),
                'duration' => 0,
                'ad' => true,
                'rrule' => 'FREQ=MONTHLY;BYDAY=-1FR'
            ),
            array(
                'id' => 1005,
                'cid' => 1,
                'title' => 'Recur weekend days',
                'start' => self::getDt('-3 week'),
                'end' => self::getMaxDt(),
                'duration' => 0,
                'ad' => true,
                'rrule' => 'FREQ=WEEKLY;BYDAY=SU,SA'
            ),
            array(
                'id' => 1006,
                'cid' => 4,
                'title' => 'Multi-day, recur every Tuesday',
                'start' => self::getDt('-5 week'),
                'end' => self::getMaxDt(),
                'duration' => 2879,
                'ad' => true,
                'rrule' => 'FREQ=WEEKLY;BYDAY=TU'
            ),
            array(
                'id' => 1007,
                'cid' => 2,
                'title' => 'Recur first day of each month',
                'start' => self::getDt('-5 week'),
                'end' => self::getMaxDt(),
                'duration' => 60,
                'ad' => true,
                'rrule' => 'FREQ=MONTHLY;BYMONTHDAY=1'
            ),
            array(
                'id' => 1008,
                'cid' => 3,
                'title' => 'Recur every third Wednesday',
                'start' => self::getDt('-5 week'),
                'end' => self::getMaxDt(),
                'duration' => 0,
                'ad' => true,
                'rrule' => 'FREQ=MONTHLY;BYDAY=3WE'
            )
        );
    }
}