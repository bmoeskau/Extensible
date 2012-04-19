<?php
/**
 * @class Event
 */
class Event extends Model {
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
     */
    private function calculateEndDate($attr) {
        $end = $attr['end'];
        
        if ($attr['rrule']) {
            $end = date($_SESSION['dtformat'], PHP_INT_MAX);
        }
        return $end;
    }
    
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
        return $rec;
    }
    
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
                        case 'single':
                            // Create a new event based on the data passed in (the
                            // original event does not need to be updated in this case):
                            self::createSingleCopy($params);
                            // Add an exception date for the start date passed in
                            // (not the original event start date, which could be different):
                            self::addExceptionDate($id, $params['start']);
                            break;
                            
                        case 'future':
                            // Only end-date the original event, don't update it otherwise:
                            $endDate = new DateTime($params['start']);
                            $endDate->modify('-1 second');
                            $rec->attributes['end'] = $endDate->format('c');
                            $dbh->update($idx, $rec->attributes);
                            
                            // Create a new event for the updated future recurrence series:
                            $copy = array_merge($attr, $params);
                            $copy['start'] = $copy['rstart'] = $params['start'];
                            unset($copy['id']);
                            
                            self::create($copy);
                            break;
                            
                        case 'all':
                            // Update the original source event:
                            $attr = array_merge($attr, $params);
                            // Make sure the id is the original id, not the recurrence instance id:
                            $attr['id'] = $id;
                            // Recalculate recurrence properties...
                            // Base duration off of the current instance start / end:
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
                    $rec->attributes = array_merge($rec->attributes, $params);
                }
                
                //$updated = self::adjustForRecurrence($rec);
                
                //$dbh->update($idx, $rec->attributes);
        
                break;
            }
        }
        return $rec;
    }

    static function destroy($id) {
        global $dbh;
        $rec = null;
        $rs = $dbh->rs();
        
        foreach ($rs as $idx => $row) {
            if ($row['id'] == $id) {
                $rec = new self($dbh->destroy($idx));
                break;
            }
        }
        
        self::removeExceptionDates($id);
        
        return $rec;
    }
    
    private function createSingleCopy($attr) {
        $copy = $attr;
        
        unset($copy['id']);
        $copy['rrule'] = '';
        $copy['rid'] = '';
        $copy['redit'] = '';
        $copy['origid'] = '';
        
        $new = self::create($copy);
        
        return $new;
    }
     
    private function inRange($attr, $startTime, $endTime) {
        $recStart = strtotime($attr['start']);
        $recEnd = strtotime($attr['end']);
        
        $startsInRange = ($recStart >= $startTime && $recStart <= $endTime);
        $endsInRange = ($recEnd >= $startTime && $recEnd <= $endTime);
        $spansRange = ($recStart < $startTime && $recEnd > $endTime);
        
        return $startsInRange || $endsInRange || $spansRange;
    }
    
    static function range($start, $end) {
        global $dbh;
        $found = array();
        $startTime = strtotime($start);
        // add a day to the range end to include event times on that day
        $endTime = new DateTime($end);
        $endTime->modify('+1 day');
        $endTime = strtotime($endTime->format('c'));
        $allRows = $dbh->rs();
        
        foreach ($allRows as $attr) {
            if (self::inRange($attr, $startTime, $endTime)) {
                if ($attr['rrule']) {
                    $found = array_merge($found, self::generateInstances($attr, $startTime, $endTime));
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
    
    private function exceptionMatch($eventId, $dt) {
        $dateString = $dt->format($_SESSION['exceptionFormat']);
        $exDates = $_SESSION['exdates'];
        
        if ($exDates) {
            foreach ($exDates as $idx => $exDate) {
                if ($exDate['id'] == $eventId) {
                    foreach ($exDate['dates'] as $date) {
                        if ($dateString == $date) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    private function generateInstances($attr, $startTime, $endTime) {
        $rrule = $attr['rrule'];
        $instances = array();
        $counter = 0;
        
        if ($rrule) {
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
                    // Instance falls after the range: exit and return the current set
                    break;
                }
                
                $copy = $attr;
                $copy['id'] = $attr['id'].'-rid-'.$idx++;
                $copy['origid'] = $attr['id'];
                $copy['duration'] = $duration;
                $copy['start'] = $rdate->format($_SESSION['dtformat']);
                $copy['end'] = $rdate->add(new DateInterval('PT'.$duration.'M'))->format($_SESSION['dtformat']);
                
                array_push($instances, $copy);
                
                if (++$counter > 99) {
                    break;
                }
            }
        }
        return $instances;
    }
}
