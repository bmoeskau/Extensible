<?php
/**
 * @class Event
 */
class Event extends Model {
    
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
                if ($attr['rrule']) {
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
        $recStart = strtotime($attr['start']);
        $recEnd = strtotime($attr['end']);
        
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
        
        if ($rec->attributes['rrule']) {
            // If this is a recurring event,first calculate the duration between
            // the start and end datetimes so that each recurring instance can
            // be properly calculated.
            $rec->attributes['duration'] = self::calculateDuration($rec->attributes);
            
            // Now that duration is set, we have to update the event end date to
            // match the recurrence pattern end date (or max date if the recurring
            // pattern does not end) so that the stored record will be returned for
            // any query within the range of recurrence.
            $rec->attributes['end'] = self::calculateEndDate($rec->attributes);
        }
        
        $rec->save();
        
        if ($rec->attributes['rrule']) {
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
            if ($row['id'] == $id) {
        
                $attr = $rec->attributes;
                $params = get_object_vars($params);
                $recurrenceEditMode = $params['redit'];
                
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
                            self::addExceptionDate($id, $params['occstart']);
                            break;
                            
                        case 'future':
                            // In this sample code we're going to split the original event
                            // into two: the original up to the edit date and a new event
                            // from the edit date to the series end date. Because of this we
                            // only end-date the original event, don't update it otherwise.
                            // This could be done all within a single event as explained in
                            // the comments above, but for this example we're keeping it simple.
                            $endDate = new DateTime($params['occstart']);
                            // End-date the original series:
                            $endDate->modify('-1 second');
                            // Update the RRULE to have an end date also:
                            self::endDateRecurringSeries($rec, $endDate);
                            // Persist changes:
                            $dbh->update($idx, $rec->attributes);
                            
                            // Now create the new event for the updated future series:
                            $copy = $params;
                            // Update the recurrence start dates to the edited date:
                            $copy['rstart'] = $copy['occstart'] = $copy['start'];
                            // Don't reuse the existing instance id since we're creating a new event:
                            unset($copy['id']);
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
                            $attr['id'] = $id;
                            // Recalculate recurrence properties...
                            // Base duration off of the current instance start / end since the end
                            // date for the series will be some future date:
                            $attr['duration'] = self::calculateDuration($attr);
                            // Now update start to be the original series start since we are
                            // updating the original source event for the series:
                            $attr['start'] = $attr['rstart'];
                            // Finally recalculate the series end date:
                            $attr['end'] = self::calculateEndDate($attr);
                            // Update the record to save:
                            $rec->attributes = $attr;
                            
                            $dbh->update($idx, $rec->attributes);
                            break;
                    }
                }
                else {
                    // No recurrence, so just do a simple update
                    $attr = array_merge($rec->attributes, $params);
                    
                    if ($attr['rrule']) {
                        // There was no recurrence edit mode, but there is an rrule, so this was
                        // an existing non-recurring event that had recurrence added to it. Need
                        // to calculate the duration and end date for the series.
                        $attr['duration'] = self::calculateDuration($attr);
                        $attr['end'] = self::calculateEndDate($attr);
                        $attr['rstart'] = $attr['start'];
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
        
        if ($rec->attributes['rrule']) {
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
            if ($row['id'] == $id) {
                
                $params = get_object_vars($params);
                $recurrenceEditMode = $params['redit'];
                
                if ($recurrenceEditMode) {
                    switch ($recurrenceEditMode) {
                        case 'single':
                            // Not actually deleting, just adding an exception so that this
                            // date instance will no longer be returned in queries:
                            self::addExceptionDate($id, $params['occstart']);
                            break;
                            
                        case 'future':
                            // Not actually deleting, just updating the series end date so that
                            // any future dates beyond the edited date will no longer be returned:
                            $endDate = new DateTime($params['start']);
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
        $start = new DateTime($attr['start']);
        $end = new DateTime($attr['end']);
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
        $end = $attr['end'];
        
        if ($attr['rrule']) {
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
        $rec->attributes['end'] = $endDate->format('c');
        
        $parts = explode(';', $rec->attributes['rrule']);
        $newRrule = array();
        $untilFound = false;
        
        foreach($parts as $part) {
            if (strrpos($part, 'UNTIL=') === false) {
                array_push($newRrule, $part);
            }
        }
        array_push($newRrule, 'UNTIL='.$endDate->format($_SESSION['dtformat']).'Z');
        
        $rec->attributes['rrule'] = implode(';', $newRrule);
    }
    
    /**
     * Return a single, non-recurring copy of an event based on its attributes
     */
    private function createSingleCopy($attr) {
        $copy = $attr;
        
        unset($copy['id']);
        unset($copy['rrule']);
        unset($copy['rid']);
        unset($copy['redit']);
        unset($copy['origid']);
        
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
                if ($exDate['id'] == $eventId) {
                    $dates = $exDate['dates'];
                    if (!in_array($newExDate, $dates)) {
                        array_push($dates, $newExDate);
                    }
                    $_SESSION['exdates'][$idx] = array('id' => $eventId, 'dates' => $dates);
                    return;
                }
            }
            array_push($_SESSION['exdates'], array('id' => $eventId, 'dates' => array($newExDate)));
        }
        else {
            $_SESSION['exdates'] = array(
                array('id' => $eventId, 'dates' => array($newExDate))
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
                if ($exDate['id'] == $eventId) {
                    if ($delDate) {
                        $dates = $exDate['dates'];
                        if (in_array($delDate, $dates)) {
                            $key = array_search($delDate, $dates);
                            array_shift(array_splice($dates, $key, 1));
                        }
                        $_SESSION['exdates'][$idx] = array('id' => $eventId, 'dates' => $dates);
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
                if ($exDate['id'] == $eventId) {
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
        $rrule = $attr['rrule'];
        $instances = array();
        $counter = 0;
        
        if ($rrule) {
            $startTime = strtotime($startDate);
            $endTime = strtotime($endDate);
            $duration = $attr['duration'];
            $rangeEnd = min($endTime, strtotime($attr['end']));
            $recurrence = new When(); // from lib/recur.php
            $rdates = $recurrence->recur($attr['start'])->rrule($rrule);
            $idx = 1;
            
            while ($rdate = $rdates->next()) {
                $rtime = strtotime($rdate->format('c'));
                
                if (self::exceptionMatch($attr['id'], $rdate)) {
                    // The current instance falls on an exception date so skip it
                    continue;
                }
                if ($rtime < $startTime) {
                    // Instance falls before the range: skip, but keep trying
                    continue;
                }
                if ($rtime > $rangeEnd) {
                    // Instance falls after the range: the returned set is sorted in date
                    // order, so we can now exit and return the current set:
                    break;
                }
                
                // Make a copy of the original event and add the needed recurrence-specific stuff:
                $copy = $attr;
                // On the client side, Ext stores will require a unique id for all returned events.
                // The specific id format doesn't really matter ('origid' will be used to tie them
                // together) but all ids must be unique:
                $copy['id'] = $attr['id'].'-rid-'.$idx++;
                // Associate the instance to its master event for later editing:
                $copy['origid'] = $attr['id'];
                $copy['duration'] = $duration;
                $copy['start'] = $rdate->format($_SESSION['dtformat']);
                $copy['end'] = $rdate->add(new DateInterval('PT'.$duration.'M'))->format($_SESSION['dtformat']);
                
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
