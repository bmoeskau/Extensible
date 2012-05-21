<?php
/**
 * @class Event
 */
class Event extends Model {
    
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
    public static $recur_instance_start = 'occstart';
    
    
    //=================================================================================================
    //
    // CRUD methods
    //
    //=================================================================================================
    
    /**
     * Retrieve all events that fall between two dates inclusively. Used when retrieving
     * events to display within a specific calendar view (basically a specialized READ method).
     */
    static function range($startDate, $endDate) {
        global $dbh;
        $found = array();
        // add a day to the range end to include event times on that day
        $endDate = new DateTime($endDate);
        $endDate->modify('+1 day');
        $endDate = $endDate->format('c');
        $allRows = $dbh->rs();
        
        foreach ($allRows as $attr) {
            if (self::inRange($attr, $startDate, $endDate)) {
                if ($attr[Event::$rrule]) {
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
    private function inRange($attr, $startDate, $endDate) {
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
    static function create($params) {
        $rec = new self(is_array($params) ? $params : get_object_vars($params));
        
        if ($rec->attributes[Event::$rrule]) {
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
        
        if ($rec->attributes[Event::$rrule]) {
            $recs = self::generateInstances($rec->attributes, $_SESSION['startDate'], $_SESSION['endDate']);
        }
        else {
            $recs = array($rec->attributes);
        }
        
        return $recs;
    }
    
    /**
     * Update an event or recurring series
     */
    static function update($id, $params) {
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
                            $result = self::generateInstances($rec->attributes, $_SESSION['startDate'], $_SESSION['endDate']);
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
                            // Since we are updating the original master event (not an instance) make
                            // sure we still have the original series start and end dates:
                            $attr[Event::$start_date] = $rec->attributes[Event::$start_date];
                            $attr[Event::$end_date] = $rec->attributes[Event::$end_date];
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
            $recs = self::generateInstances($rec->attributes, $_SESSION['startDate'], $_SESSION['endDate']);
        }
        else {
            $recs = array($rec->attributes);
        }
        
        return $recs;
    }

    /**
     * Destroy the event, or possibly add an exception for a recurring instance
     */
    static function destroy($id, $params) {
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
    private function calculateDuration($attr) {
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
    private function calculateEndDate($attr) {
        $end = $attr[Event::$end_date];
        
        if ($attr[Event::$rrule]) {
            $end = date($_SESSION['dtformat'], PHP_INT_MAX);
        }
        return $end;
    }

    /**
     * Helper method that updates the UNTIL portion of a recurring event's RRULE
     * such that the passed end date becomes the new UNTIL value. It handles updating
     * an existing UNTIL value or adding it if needed so that there is only one
     * unqiue UNTIL value when this method returns.
     */
    private function endDateRecurringSeries($rec, $endDate) {
        $rec->attributes[Event::$end_date] = $endDate->format('c');
        
        $parts = explode(';', $rec->attributes[Event::$rrule]);
        $newRrule = array();
        $untilFound = false;
        
        foreach($parts as $part) {
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
    private function createSingleCopy($attr) {
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
    private function addExceptionDate($eventId, $dt) {
        $exDates = $_SESSION['exdates'];
        $newExDate = new DateTime($dt);
        
        $newExDate = $newExDate->format($_SESSION['exceptionFormat']);
        
        if ($exDates) {
            foreach ($exDates as $idx => $exDate) {
                if ($exDate[Event::$event_id] == $eventId) {
                    $dates = $exDate['dates'];
                    if (!in_array($newExDate, $dates)) {
                        array_push($dates, $newExDate);
                    }
                    $_SESSION['exdates'][$idx] = array(Event::$event_id => $eventId, 'dates' => $dates);
                    return;
                }
            }
            array_push($_SESSION['exdates'], array(Event::$event_id => $eventId, 'dates' => array($newExDate)));
        }
        else {
            $_SESSION['exdates'] = array(
                array(Event::$event_id => $eventId, 'dates' => array($newExDate))
            );
        }
    }
    
    /**
     * Remove exception dates added by addExceptionDate(). Currently this is only done
     * as a cleanup step after deleting recurring events that have existing exceptions.
     */
    private function removeExceptionDates($eventId, $dt = false) {
        $exDates = $_SESSION['exdates'];
        
        if ($exDates) {
            if ($dt) {
                $delDate = new DateTime($dt);
                $delDate = $delDate->format($_SESSION['exceptionFormat']);
            }
            foreach ($exDates as $idx => $exDate) {
                if ($exDate[Event::$event_id] == $eventId) {
                    if ($delDate) {
                        $dates = $exDate['dates'];
                        if (in_array($delDate, $dates)) {
                            $key = array_search($delDate, $dates);
                            array_shift(array_splice($dates, $key, 1));
                        }
                        $_SESSION['exdates'][$idx] = array(Event::$event_id => $eventId, 'dates' => $dates);
                    }
                    else {
                        array_shift(array_splice($_SESSION['exdates'], $idx, 1));
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
    private function exceptionMatch($eventId, $dt) {
        $dateString = $dt->format($_SESSION['exceptionFormat']);
        $exDates = $_SESSION['exdates'];
        
        if ($exDates) {
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
     * Return all recurring event instances that fall between two dates.
     */
    private function generateInstances($attr, $startDate, $endDate) {
        $rrule = $attr[Event::$rrule];
        $instances = array();
        $counter = 0;
        
        if ($rrule) {
            $duration = $attr[Event::$duration];
            
            if (!$duration) {
                // Duration is required to calculate the end date of each instance. You could raise
                // an error here if appropriate, but we'll just be nice and default it to 0 (i.e.
                // same start and end dates):
                $duration = 0;
            }
            
            // Only parse to the earlier of event end or current view end:
            $rangeEnd = min($endDate, $attr[Event::$end_date]);
            
            // Third-party recurrence parser -- see: lib/recur.php
            $recurrence = new When();
            
            // Make sure to pass the "until" portion to limit the search -- in cases where the RRULE has no
            // end date or count, the parser will keep looping without this. We are also checking the results
            // below, but limiting the parser when possible should help a bit with efficiency.
            $rdates = $recurrence->recur($attr[Event::$start_date])->rrule($rrule)->until($rangeEnd);
            $idx = 1;
            
            while ($rdate = $rdates->next()) {
                $rtime = strtotime($rdate->format('c'));
                
                if (self::exceptionMatch($attr[Event::$event_id], $rdate)) {
                    // The current instance falls on an exception date so skip it
                    continue;
                }
                if ($rtime < strtotime($attr[Event::$start_date])) {
                    // Instance falls before the range: skip, but keep trying
                    continue;
                }
                if ($rtime > strtotime($rangeEnd)) {
                    // Instance falls after the range: the returned set is sorted in date
                    // order, so we can now exit and return the current set:
                    break;
                }
                
                // Make a copy of the original event and add the needed recurrence-specific stuff:
                $copy = $attr;
                // On the client side, Ext stores will require a unique id for all returned events.
                // The specific id format doesn't really matter (Event::$orig_event_id will be used to tie them
                // together) but all ids must be unique:
                $copy[Event::$event_id] = $attr[Event::$event_id].'-rid-'.$idx++;
                // Associate the instance to its master event for later editing:
                $copy[Event::$orig_event_id] = $attr[Event::$event_id];
                $copy[Event::$duration] = $duration;
                $copy[Event::$start_date] = $rdate->format($_SESSION['dtformat']);
                $copy[Event::$end_date] = $rdate->add(new DateInterval('PT'.$duration.'M'))->format($_SESSION['dtformat']);
                
                array_push($instances, $copy);
                
                if (++$counter > 99) {
                    // Should never get here, but it's our safety valve against infinite looping.
                    // You'd probably want to raise an application error if this happens.
                    break;
                }
            }
        }
        return $instances;
    }
}
