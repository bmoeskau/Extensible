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
    
    // private function adjustForRecurrence($rec) {
        // $attr = $rec->attributes;
//         
        // if ($attr['rrule']) {
            // if ($attr['redit']) {
                // //$origId = explode('-rid-', $attr['id']);
                // //$attr['id'] = $origId[0];
                // $attr['id'] = $attr['origid'];
//                 
                // $editMode = $attr['redit'];
//                 
                // if ($editMode == 'single') {
                    // $copy = $attr;
                    // $copy['id'] = '';
                    // $copy['rrule'] = '';
                    // $copy['rid'] = '';
                    // $copy['redit'] = '';
                    // $copy['origid'] = '';
                    // self::create($copy);
//                     
                    // self::addExceptionDate($attr['id'], $attr['start']);
//                     
                    // return $rec;
                // }
            // }
            // // If this is a recurring event,first calculate the duration between
            // // the start and end datetimes so that each recurring instance can
            // // be properly calculated.
            // $attr['duration'] = self::calculateDuration($attr);
//             
            // // Now that duration is set, we have to update the event end date to
            // // match the recurrence pattern end date (or max date if the recurring
            // // pattern does not end) so that the stored record will be returned for
            // // any query within the range of recurrence.
            // $attr['end'] = self::calculateEndDate($attr);
        // }
//         
        // $rec->attributes = $attr;
//         
        // return $rec;
    // }
    
    static function create($params) {
        $rec = new self(is_array($params) ? $params : get_object_vars($params));
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
                $recurrenceEditMode = $params->redit;
                
                if ($recurrenceEditMode) {
                    switch ($recurrenceEditMode) {
                        case 'single':
                            self::createSingleCopy($attr);
                            self::addExceptionDate($id, $attr['start']);
                            break;
                            
                        case 'future':
                            break;
                            
                        case 'all':
                            $attr = array_merge($attr, get_object_vars($params));
                            $attr['id'] = $id;
                            $attr['duration'] = self::calculateDuration($attr);
                            $attr['end'] = self::calculateEndDate($attr);
                            $rec->attributes = $attr;
                            break;
                    }
                }
                else {
                    $rec->attributes = array_merge($rec->attributes, get_object_vars($params));
                }
                
                //$updated = self::adjustForRecurrence($rec);
                
                $dbh->update($idx, $rec->attributes);
                break;
            }
        }
        return $rec;
    }
    
    private function createSingleCopy($attr) {
        $copy = $attr;
        
        $copy['id'] = '';
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
                    $separator = strlen($dates) > 0 ? ',' : '';
                    $dates .= $separator.$newExDate;
                    $_SESSION['exdates'][$idx] = array('id' => $eventId, 'dates' => $dates);
                    return;
                }
            }
            array_push($_SESSION['exdates'], array('id' => $eventId, 'dates' => $newExDate));
        }
        else {
            $_SESSION['exdates'] = array(
                array('id' => $eventId, 'dates' => $newExDate)
            );
        }
    }
    
    private function exceptionMatch($eventId, $dt) {
        $dateString = $dt->format($_SESSION['exceptionFormat']);
        $exDates = $_SESSION['exdates'];
        
        if ($exDates) {
            foreach ($exDates as $idx => $exDate) {
                if ($exDate['id'] == $eventId) {
                    $dates = explode(',', $exDate['dates']);
                    
                    foreach ($dates as $date) {
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
            $recurrence = new When();
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
                if ($rtime > $endTime) {
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
