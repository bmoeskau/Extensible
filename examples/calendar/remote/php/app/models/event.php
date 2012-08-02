<?php
/**
 * @class Event
 */
class Event extends Model {
    
    // This is the maximum number of event instances per master recurring event to generate and return
    // when recurrence is in use. Generally the recurrence pattern defined on each event, in combination
    // with the supplied query date range, should already limit the instances returned to a reasonable
    // range. This value is a saftey check in case something is not specified correctly to avoid the
    // recurrence parser looping forever (e.g., no end date is supplied). This value should accommodate
    // the max realistic combination of events for the supported views and event frequency. For example,
    // by default the maximum frequency is daily, so given a maximum view range of 6 weeks and one
    // instance per day, the minimum required value would be 42. The default of 99 will handle any
    // views supported by Extensible out of the box, but if some custom view range was implemented
    // (e.g. year view) or if the recurrence resolution was increased (e.g., hourly) then you would
    // have to increase this value accordingly.
    public static $max_event_instances = 99;
    
    //=================================================================================================
    //
    // Event property mappings. The default values match the property names as used in the example
    // data (e.g. Extensible.example.calendar.data.Events) so if you customize the EventModel and/or
    // mappings being used you'd also want to update these properties so that the PHP matches. You
    // should only have to change the string values -- the $ variables are referenced in the PHP code
    // and should not need to be changed.
    //
    //=================================================================================================
    
    // Basic event properties. This is not all properties, only those needed explicitly
    // in the model code -- most standard properties are read and set generically.
    public static $event_id   = 'id';
    public static $start_date = 'start';
    public static $end_date   = 'end';
    public static $duration   = 'duration';
    
    // Recurrence-specific properties needed for processing recurring events:
    public static $rrule                = 'rrule';
    public static $orig_event_id        = 'origid';
    public static $recur_instance_id    = 'rid';
    public static $recur_edit_mode      = 'redit';
    public static $recur_instance_start = 'ristart';
    
    
    //=================================================================================================
    //
    // CRUD methods
    //
    //=================================================================================================
    
    /**
     * Retrieve all events that fall between two dates inclusively. Used when retrieving
     * events to display within a specific calendar view (basically a specialized READ method).
     */
    public static function range($startDate, $endDate) {
        global $dbh;
        $found = array();
        // add a day to the range end to include event times on that day
        $endDate = new DateTime($endDate);
        $endDate->modify('+1 day');
        $endDate = $endDate->format('c');
        $allRows = $dbh->rs();
        
        foreach ($allRows as $attr) {
            if (self::inRange($attr, $startDate, $endDate)) {
                if (isset($attr[Event::$rrule]) && $attr[Event::$rrule] != '') {
                    $found = array_merge($found, self::generateInstances($attr, $startDate, $endDate));
                }
                else {
                    // Only add the found event here if non-recurring since the
                    // same event will be calculated as a recurring instance above
                    array_push($found, $attr);
                }
            }
        }
        return $found;
    }
    
    /**
     * Helper method for range() that tests whether or not an event falls between two dates inclusively.
     */
    private static function inRange($attr, $startDate, $endDate) {
        $startTime = strtotime($startDate);
        $endTime = strtotime($endDate);
        $recStart = strtotime($attr[Event::$start_date]);
        $recEnd = strtotime($attr[Event::$end_date]);
        
        $startsInRange = ($recStart >= $startTime && $recStart <= $endTime);
        $endsInRange = ($recEnd >= $startTime && $recEnd <= $endTime);
        $spansRange = ($recStart < $startTime && $recEnd > $endTime);
        
        return $startsInRange || $endsInRange || $spansRange;
    }
    
    /**
     * Create a new event, returning multiple events if recurring
     */
    public static function create($params) {
        $rec = new self(is_array($params) ? $params : get_object_vars($params));
        
        if (isset($rec->attributes[Event::$rrule]) && $rec->attributes[Event::$rrule] != '') {
            // If this is a recurring event,first calculate the duration between
            // the start and end datetimes so that each recurring instance can
            // be properly calculated.
            $rec->attributes[Event::$duration] = self::calculateDuration($rec->attributes);
            
            // Now that duration is set, we have to update the event end date to
            // match the recurrence pattern end date (or max date if the recurring
            // pattern does not end) so that the stored record will be returned for
            // any query within the range of recurrence.
            $rec->attributes[Event::$end_date] = self::calculateEndDate($rec->attributes);
        }
        
        $rec->save();
        
        if (isset($rec->attributes[Event::$rrule]) && $rec->attributes[Event::$rrule] != '') {
            $recs = self::generateInstances($rec->attributes, $_SESSION[$GLOBALS['app_id']]['startDate'],
                $_SESSION[$GLOBALS['app_id']]['endDate']);
        }
        else {
            $recs = array($rec->attributes);
        }
        
        return $recs;
    }
    
    /**
     * Update an event or recurring series
     */
    public static function update($id, $params) {
        global $dbh;
        $rec = self::find($id);

        if ($rec == null) {
            return $rec;
        }
        
        $rs = $dbh->rs();

        foreach ($rs as $idx => $row) {
            if ($row[Event::$event_id] == $id) {
        
                $attr = $rec->attributes;
                $params = get_object_vars($params);
                $recurrenceEditMode = $params[Event::$recur_edit_mode];
                
                if ($recurrenceEditMode) {
                    switch ($recurrenceEditMode) {
                        // NOTE: Both the "single" and "future" cases currently create new
                        // events in order to represent edited versions of recurrence instances.
                        // This could more flexibly be handled within a single master
                        // event by supporting multiple RRULE and EXRULE definitions per
                        // event. This would be a bit more complex to implement and would
                        // also require more processing code to arrive at the final event
                        // series to return when querying. For this example (which is already
                        // complex enough) we're sticking to the simpler edit implementations
                        // which can simply go through the existing default event logic, but
                        // you are free to implement these however you'd like in real projects.
                        
                        case 'single':
                            // Create a new event based on the data passed in (the
                            // original event does not need to be updated in this case):
                            $rec = self::createSingleCopy($params);
                            // Add an exception for the original occurrence start date
                            // so that the original instance will not be displayed:
                            self::addExceptionDate($id, $params[Event::$recur_instance_start]);
                            break;
                            
                        case 'future':
                            // In this sample code we're going to split the original event
                            // into two: the original up to the edit date and a new event
                            // from the edit date to the series end date. Because of this we
                            // only end-date the original event, don't update it otherwise.
                            // This could be done all within a single event as explained in
                            // the comments above, but for this example we're keeping it simple.
                            $endDate = new DateTime($params[Event::$recur_instance_start]);
                            // End-date the original series:
                            $endDate->modify('-1 second');
                            // Update the RRULE to have an end date also:
                            self::endDateRecurringSeries($rec, $endDate);
                            // Persist changes:
                            $dbh->update($idx, $rec->attributes);
                            
                            // Now create the new event for the updated future series:
                            $copy = $params;
                            // Update the recurrence start dates to the edited date:
                            $copy[Event::$recur_instance_start] = $copy[Event::$start_date];
                            // Don't reuse the existing instance id since we're creating a new event:
                            unset($copy[Event::$event_id]);
                            // Create the new event (which also persists it) -- note that this method
                            // returns an array of events when it's a recurring series:
                            $copy = self::create($copy);
                            
                            // We want to return the union of both series, so first generate the
                            // instances from the original event based on the new end date:
                            $result = self::generateInstances($rec->attributes,
                                $_SESSION[$GLOBALS['app_id']]['startDate'],
                                $_SESSION[$GLOBALS['app_id']]['endDate']);
                            // Then merge the results ($copy is already an array since self::create
                            // returns the created recurrence set):
                            $rec = array_merge($result, $copy);
                            break;
                            
                        case 'all':
                            // This is the simplest case to handle since there is no need to
                            // split the event or deal with exceptions -- we're just updating
                            // the original master event. First merge the updated fields:
                            $attr = array_merge($attr, $params);
                            // Make sure the id is the original id, not the recurrence instance id:
                            $attr[Event::$event_id] = $id;
                            // Base duration off of the current instance start / end since the end
                            // date for the series will be some future date:
                            $attr[Event::$duration] = self::calculateDuration($attr);
                            // In case the start date was edited by the user, we need to recalculate
                            // the updated start date based on the time difference between the original
                            // and current values:
                            $instanceStart = new DateTime($params[Event::$recur_instance_start]);
                            $newStart = new DateTime($params[Event::$start_date]);
                            $diff = $instanceStart->diff($newStart);
                            // Now apply the diff timespan to the original start date:
                            $origStart = new DateTime($rec->attributes[Event::$start_date]);
                            $attr[Event::$start_date] = $origStart->add($diff)->format('c');
                            // Finally update the end date to the original series end date. This is
                            // important in the case where the series may have been split previously
                            // (e.g. by a "future" edit) so we want to preserve that:
                            //$attr[Event::$end_date] = $rec->attributes[Event::$end_date];
                            $attr[Event::$end_date] = self::calculateEndDate($attr);
                            // Update the record and save it:
                            $rec->attributes = $attr;
                            $dbh->update($idx, $rec->attributes);
                            break;
                    }
                }
                else {
                    // No recurrence, so just do a simple update
                    $attr = array_merge($rec->attributes, $params);
                    
                    if ($attr[Event::$rrule]) {
                        // There was no recurrence edit mode, but there is an rrule, so this was
                        // an existing non-recurring event that had recurrence added to it. Need
                        // to calculate the duration and end date for the series.
                        $attr[Event::$duration] = self::calculateDuration($attr);
                        $attr[Event::$end_date] = self::calculateEndDate($attr);
                    }
                    
                    $rec->attributes = $attr;
                    $dbh->update($idx, $rec->attributes);
                }
                
                break;
            }
        }

        if (is_array($rec)) {
            return $rec;
        }
        
        if ($rec->attributes[Event::$rrule]) {
            $recs = self::generateInstances($rec->attributes, $_SESSION[$GLOBALS['app_id']]['startDate'], $_SESSION[$GLOBALS['app_id']]['endDate']);
        }
        else {
            $recs = array($rec->attributes);
        }
        
        return $recs;
    }

    /**
     * Destroy the event, or possibly add an exception for a recurring instance
     */
    public static function destroy($id, $params) {
        global $dbh;
        $rec = self::find($id);

        if ($rec == null) {
            return $rec;
        }
        
        $rs = $dbh->rs();
        
        foreach ($rs as $idx => $row) {
            if ($row[Event::$event_id] == $id) {
                
                $params = get_object_vars($params);
                $recurrenceEditMode = $params[Event::$recur_edit_mode];
                
                if ($recurrenceEditMode) {
                    switch ($recurrenceEditMode) {
                        case 'single':
                            // Not actually deleting, just adding an exception so that this
                            // date instance will no longer be returned in queries:
                            self::addExceptionDate($id, $params[Event::$recur_instance_start]);
                            break;
                            
                        case 'future':
                            // Not actually deleting, just updating the series end date so that
                            // any future dates beyond the edited date will no longer be returned:
                            $endDate = new DateTime($params[Event::$start_date]);
                            $endDate->modify('-1 second');
                            self::endDateRecurringSeries($rec, $endDate);
                            $dbh->update($idx, $rec->attributes);
                            break;
                            
                        case 'all':
                            // Actually destroy the master event:
                            $rec = new self($dbh->destroy($idx));
                            self::removeExceptionDates($id);
                            break;
                    }
                }
                else {
                    $rec = new self($dbh->destroy($idx));
                    self::removeExceptionDates($id);
                    break;
                }
            }
        }
        
        return $rec;
    }


    //=================================================================================================
    //
    // Pretty much everything below here is specific to supporting recurrence. PLEASE take this code
    // as a very basic example -- it is NOT intended to be used as production code, but only as an
    // example of the logic behind implemneting recurrence and some of the things you'll need to
    // consider when doing it yourself. Please keep the following in mind:
    //
    // - Most importantly, there are MANY valid ways to implement recurrence, depending on how
    //   sophisticated your requirements are. Where possible I've tried to indicate some of the
    //   trade-offs I considered in this example, but you should also consult and understand the
    //   original iCal recurrence specs before undertaking your own implementation:
    //
    //   http://www.kanzaki.com/docs/ical/rrule.html
    //
    // - This code currently uses session -- any real DB/ORM implementation would necessarily be
    //   structured differently (read: better) and in some ways would actually be simpler. I may
    //   try to add a DB implementation in the future, but for now, it is what it is.
    //
    //=================================================================================================
    
    /**
     * Returns the duration of the event in minutes
     */
    private static function calculateDuration($attr) {
        $start = new DateTime($attr[Event::$start_date]);
        $end = new DateTime($attr[Event::$end_date]);
        $interval = $start->diff($end);
        
        $minutes = ($interval->days * 24 * 60) +
                   ($interval->h * 60) +
                   ($interval->i);
        
        return $minutes;
    }
    
    /**
     * If the event is recurring, returns the maximum end date
     * supported by PHP so that the event will fall within future
     * query ranges as possibly having matching instances. Note
     * that in a real implementation it would be better to calculate
     * the actual recurrence pattern end date if possible. The current
     * recurrence class used in this example does not make it convenient
     * to do that, so for demo purposes we'll just use the PHP max date.
     * The generateInstances() method will still limit results based on
     * any end date specified, so it will work as expected -- it simply
     * means that in a real-world implementation querying might be slightly
     * less efficient (which does not apply in this example).
     */
    private static function calculateEndDate($attr) {
        $end = $attr[Event::$end_date];
        
        if (isset($attr[Event::$rrule]) && $attr[Event::$rrule] != '') {
            $max_date = new DateTime('9999-12-31');
            $recurrence = new When();
            $recurrence->rrule($attr[Event::$rrule]);
            
            if (isset($recurrence->end_date) && $recurrence->end_date < $max_date) {
                $end = $recurrence->end_date->format($_SESSION['dtformat']).'Z';
            }
            else if (isset($recurrence->count) && $recurrence->count > 0) {
                $count = 0;
                $newEnd;
                $rdates = $recurrence->recur($attr[Event::$start_date])->rrule($attr[Event::$rrule]);
                
                while ($rdate = $rdates->next()) {
                    $newEnd = $rdate;
                    if (++$count > $recurrence->count) {
                        break;
                    }
                }
                // The 'minutes' portion should match Extensible.calendar.data.EventModel.resolution:
                $newEnd->modify('+'.$attr[Event::$duration].' minutes');
                $end = $newEnd->format($_SESSION['dtformat']).'Z';
            }
            else {
                // default to max date if nothing else
                $end = date($_SESSION['dtformat'], PHP_INT_MAX).'Z';
            }
        }
        return $end;
    }

    /**
     * Helper method that updates the UNTIL portion of a recurring event's RRULE
     * such that the passed end date becomes the new UNTIL value. It handles updating
     * an existing UNTIL value or adding it if needed so that there is only one
     * unqiue UNTIL value when this method returns.
     */
    private static function endDateRecurringSeries($rec, $endDate) {
        $rec->attributes[Event::$end_date] = $endDate->format('c');
        
        $parts = explode(';', $rec->attributes[Event::$rrule]);
        $newRrule = array();
        $untilFound = false;
        
        foreach ($parts as $part) {
            if (strrpos($part, 'UNTIL=') === false) {
                array_push($newRrule, $part);
            }
        }
        array_push($newRrule, 'UNTIL='.$endDate->format($_SESSION['dtformat']).'Z');
        
        $rec->attributes[Event::$rrule] = implode(';', $newRrule);
    }
    
    /**
     * Return a single, non-recurring copy of an event based on its attributes
     */
    private static function createSingleCopy($attr) {
        $copy = $attr;
        
        unset($copy[Event::$event_id]);
        unset($copy[Event::$rrule]);
        unset($copy[Event::$recur_instance_id]);
        unset($copy[Event::$recur_edit_mode]);
        unset($copy[Event::$orig_event_id]);
        
        $new = self::create($copy);
        
        return $new;
    }
    
    /**
     * Add an exception date for a recurring event so that the recurring instance for that
     * date/time will no longer be returned as part of the series. For this example exceptions
     * are simply stored in session using the event's id as the key. A real implementation would
     * persist exceptions to a DB, and possibly would use standard EXRULE and/or EXDATE syntax.
     */
    private static function addExceptionDate($eventId, $dt) {
        $newExDate = new DateTime($dt);
        $newExDate = $newExDate->format($_SESSION['exceptionFormat']);
        
        if (isset($_SESSION[$GLOBALS['app_id']]['exdates'])) {
            $exDates = $_SESSION[$GLOBALS['app_id']]['exdates'];
            
            foreach ($exDates as $idx => $exDate) {
                if ($exDate[Event::$event_id] == $eventId) {
                    $dates = $exDate['dates'];
                    if (!in_array($newExDate, $dates)) {
                        array_push($dates, $newExDate);
                    }
                    $_SESSION[$GLOBALS['app_id']]['exdates'][$idx] = array(Event::$event_id => $eventId, 'dates' => $dates);
                    return;
                }
            }
            array_push($_SESSION[$GLOBALS['app_id']]['exdates'], array(Event::$event_id => $eventId, 'dates' => array($newExDate)));
        }
        else {
            $_SESSION[$GLOBALS['app_id']]['exdates'] = array(
                array(Event::$event_id => $eventId, 'dates' => array($newExDate))
            );
        }
    }
    
    /**
     * Remove exception dates added by addExceptionDate(). Currently this is only done
     * as a cleanup step after deleting recurring events that have existing exceptions.
     */
    private static function removeExceptionDates($eventId, $dt = false) {
        if (isset($_SESSION[$GLOBALS['app_id']]['exdates'])) {
            $exDates = $_SESSION[$GLOBALS['app_id']]['exdates'];
            
            if ($dt) {
                $delDate = new DateTime($dt);
                $delDate = $delDate->format($_SESSION['exceptionFormat']);
            }
            foreach ($exDates as $idx => $exDate) {
                if ($exDate[Event::$event_id] == $eventId) {
                    if (isset($delDate)) {
                        $dates = $exDate['dates'];
                        if (in_array($delDate, $dates)) {
                            $key = array_search($delDate, $dates);
                            $spliced = array_splice($dates, $key, 1);
                            array_shift($spliced);
                        }
                        $_SESSION[$GLOBALS['app_id']]['exdates'][$idx] = array(Event::$event_id => $eventId, 'dates' => $dates);
                    }
                    else {
                        $spliced = array_splice($_SESSION[$GLOBALS['app_id']]['exdates'], $idx, 1);
                        array_shift($spliced);
                    }
                    return;
                }
            }
        }
    }
    
    /**
     * Helper method to verify whether or not an exception date already exists for a given
     * event to avoid adding duplicate exception dates.
     */
    private static function exceptionMatch($eventId, $dt) {
        $dateString = $dt->format($_SESSION['exceptionFormat']);
        
        if (isset($_SESSION[$GLOBALS['app_id']]['exdates'])) {
            $exDates = $_SESSION[$GLOBALS['app_id']]['exdates'];
            
            foreach ($exDates as $idx => $exDate) {
                if ($exDate[Event::$event_id] == $eventId) {
                    foreach ($exDate['dates'] as $date) {
                        if ($dateString == $date) {
                            // Yes, this exception date already exists
                            return true;
                        }
                    }
                }
            }
        }
        // No match
        return false;
    }
    
    /**
     * Utility function used by generateInstances() to ensure that the starting date used for
     * parsing the recurrence pattern is set to the correct day of week.
     */
    // private static function adjustRecurrenceRangeStart($rangeStart, $attr) {
        // if (preg_match('/INTERVAL/', $attr[Event::$rrule])) {
            // // If an interval is specified, there is no way to safely use the view start
            // // date. In order to calculate dates that are valid for the recurrence pattern
            // // you MUST parse beginning with the event start date in this case.
            // return $attr[Event::$start_date];
        // }
//         
        // $hasByDay = preg_match('/(BYDAY|BYMONTHDAY|BYYEARDAY)/', $attr[Event::$rrule]);
//         
        // if (!$hasByDay) {
            // // When the recurrence pattern does not define the day of week, it defaults to the
            // // day of week of the start date passed into the parser. Since we may be using the
            // // view start date for efficiency reasons, we have to manually ensure that the start
            // // date used for parsing the pattern is the same day of week as the event's start
            // // date, otherwise event instances will be returned on the wrong days. Note that this
            // // is actually a weakness of the current parser library used in this example -- ideally
            // // the parser itself would handle filtering by view range so we could avoid this.
            // $rangeStartDay = date('w', strtotime($rangeStart));
            // $eventStartDay = date('w', strtotime($attr[Event::$start_date]));
//             
            // if ($rangeStartDay < $eventStartDay) {
                // // The days of week are different, so adjust the view start date to match the
                // // event start date's day of the week. That way we can parse efficiently and
                // // still return the correct dates. 
                // $diff = $eventStartDay - $rangeStartDay;
                // $newStart = new DateTime($rangeStart);
                // $newStart->modify('+'.$diff.' days');
                // return $newStart->format('c');
            // }
        // }
// 
        // // Nothing to do in this case, just return the given range start date
        // return $rangeStart;
    // }
    
    /**
     * Return all recurring event instances that fall between two dates.
     */
    private static function generateInstances($attr, $viewStartDate, $viewEndDate) {
        $rrule = $attr[Event::$rrule];
        $instances = array();
        $counter = 0;
        
        if ($rrule) {
            $duration = $attr[Event::$duration];
            
            if (!isset($duration)) {
                // Duration is required to calculate the end date of each instance. You could raise
                // an error here if appropriate, but we'll just be nice and default it to 0 (i.e.
                // same start and end dates):
                $duration = 0;
            }
            
            // Start parsing at the later of event start or current view start:
            $rangeStart = max($viewStartDate, $attr[Event::$start_date]);
            //$rangeStart = self::adjustRecurrenceRangeStart($rangeStart, $attr);
            $rangeStartTime = strtotime($rangeStart);
            
            // Stop parsing at the earlier of event end or current view end:
            $rangeEnd = min($viewEndDate, $attr[Event::$end_date]);
            $rangeEndTime = strtotime($rangeEnd);
            
            // Third-party recurrence parser -- see: lib/recur.php
            $recurrence = new When();
            
            // TODO: Using the event start date here is the correct approach, but is inefficient
            // based on the current recurrence library in use, which does not accept a starting
            // date other than the event start date. The farther in the future the view range is,
            // the more processing is required and the slower performance will be. If you can parse
            // only relative to the current view range, parsing speed is much faster, but it
            // introduces a lot more complexity to ensure that the returned dates are valid for the
            // recurrence pattern. For now we'll sacrifice performance to ensure validity, but this
            // may need to be revisited in the future.
            //$rdates = $recurrence->recur($rangeStart)->rrule($rrule);
            $rdates = $recurrence->recur($attr[Event::$start_date])->rrule($rrule);
            
            // Counter used for generating simple unique instance ids below
            $idx = 1;
            
            // Loop through all valid recurrence instances as determined by the parser
            // and validate that they are within the valid view range (and not exceptions).
            while ($rdate = $rdates->next()) {
                $rtime = strtotime($rdate->format('c'));
                
                // When there is no end date or maximum count as part of the recurrence RRULE
                // pattern, the parser by default will simply loop until the end of time. For
                // this reason it is critical to have these boundary checks in place:
                if ($rtime < $rangeStartTime) {
                    // Instance falls before the range: skip, but keep trying
                    continue;
                }
                if ($rtime > $rangeEndTime) {
                    // Instance falls after the range: the returned set is sorted in date
                    // order, so we can now exit and return the current event set
                    break;
                }
                
                if (self::exceptionMatch($attr[Event::$event_id], $rdate)) {
                    // The current instance falls on an exception date so skip it
                    continue;
                }
                
                // Make a copy of the original event and add the needed recurrence-specific stuff:
                $copy = $attr;
                
                // On the client side, Ext stores will require a unique id for all returned events.
                // The specific id format doesn't really matter (Event::$orig_event_id will be used
                // to tie them together) but all ids must be unique:
                $copy[Event::$event_id] = $attr[Event::$event_id].'-rid-'.$idx++;
                
                // Associate the instance to its master event for later editing:
                $copy[Event::$orig_event_id] = $attr[Event::$event_id];
                // Save the duration in case it wasn't already set:
                $copy[Event::$duration] = $duration;
                // Replace the series start date with the current instance start date:
                $copy[Event::$start_date] = $rdate->format($_SESSION['dtformat']);
                // By default the master event's end date will be the end date of the entire series.
                // For each instance, we actually want to calculate a proper instance end date from
                // the duration value so that the view can simply treat them as standard events:
                $copy[Event::$end_date] = $rdate->add(new DateInterval('PT'.$duration.'M'))->format($_SESSION['dtformat']);
                
                // Add the instance to the set to be returned:
                array_push($instances, $copy);
                
                if (++$counter > Event::$max_event_instances) {
                    // Should never get here, but it's our safety valve against infinite looping.
                    // You'd probably want to raise an application error if this happens.
                    break;
                }
            }
        }
        return $instances;
    }
}
