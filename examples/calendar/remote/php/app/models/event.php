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
    
    private function adjustForRecurrence($rec) {
        $attr = $rec->attributes;
        
        if ($attr['rrule']) {
            // If this is a recurring event,first calculate the duration between
            // the start and end datetimes so that each recurring instance can
            // be properly calculated.
            $attr['duration'] = self::calculateDuration($attr);
            
            // Now that duration is set, we have to update the event end date to
            // match the recurrence pattern end date (or max date if the recurring
            // pattern does not end) so that the stored record will be returned for
            // any query within the range of recurrence.
            $attr['end'] = self::calculateEndDate($attr);
        }
        
        $rec->attributes = $attr;
        
        return $rec;
    }
    
    protected function beforeCreate($rec) {
        return self::adjustForRecurrence($rec);
    }
    
    protected function beforeUpdate($rec) {
        return self::adjustForRecurrence($rec);
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
        
        foreach ($dbh->rs() as $attr) {
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
    
    private function generateInstances($attr, $startTime, $endTime) {
        $rrule = $attr['rrule'];
        $instances = array();
        $counter = 0;
        
        if ($rrule) {
            $duration = $attr['duration'];
            $recurrence = new When();
            $rdates = $recurrence->recur($attr['start'])->rrule($rrule);
            $idx = 1;
            
            while ($rdate = $rdates->next()) {
                $rtime = strtotime($rdate->format('c'));
                
                if ($rtime < $startTime) {
                    // Instance falls before the range: skip, but keep trying
                    continue;
                }
                if ($rtime > $endTime) {
                    // Instance falls after the range: exit and return the current set
                    break;
                }
                
                $copy = $attr;
                $copy['id'] = $attr['id'].'-rid-'.$idx++;
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
