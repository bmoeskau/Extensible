<?php
/**
 * @class Event
 */
class Event extends Model {
    private function calculateDuration($attr) {
        // Calculate duration if there's a recurrence rule so that the
        // end date of each recurring instance can be calculated later.
        $start = new DateTime($attr['start']);
        $end = new DateTime($attr['end']);
        $interval = $start->diff($end);
        
        $minutes = ($interval->days * 24 * 60) +
                   ($interval->h * 60) +
                   ($interval->i);
        
        if ($attr['ad']) {
            // All day event end times are always midnight starting on the end date, so
            // we need to add a day to account for the duration of the end date itself.
            $minutes += 1440;
        }
        
        $attr['duration'] = $minutes;
        return $minutes;
    }
    
    private function beforeCreate($rec) {
        self::calculateDuration($rec->attributes);
        return $rec;
    }
    
    private function beforeUpdate($rec) {
        self::calculateDuration($rec->attributes);
        return $rec;
    }
    
    static function range($start, $end) {
        global $dbh;
        $found = array();
        $startTime = strtotime($start);
        // add a day to the range end to include event times on that day
        $endTime = new DateTime($end);
        $endTime->modify('+1 day');
        $endTime = strtotime($endTime->format('Y-m-d H:i:s'));
        
        foreach ($dbh->rs() as $attr) {
            $recStart = strtotime($attr['start']);
            $recEnd = strtotime($attr['end']);
            
            $startsInRange = ($recStart >= $startTime && $recStart <= $endTime);
            $endsInRange = ($recEnd >= $startTime && $recEnd <= $endTime);
            $spansRange = ($recStart < $startTime && $recEnd > $endTime);
            
            if ($startsInRange || $endsInRange || $spansRange) {
                array_push($found, $attr);
                if ($attr['rrule']) {
                    $found = array_merge($found, self::generateInstances($attr));
                }
            }
        }
        return $found;
    }
    
    private function generateInstances($attr) {
        $rrule = $attr['rrule'];
        $instances = array();
        
        if ($rrule) {
            $duration = self::calculateDuration($attr);
            $recurrence = new When();
            $rdates = $recurrence->recur($attr['start'])->rrule($rrule);
            
            while ($rdate = $rdates->next()) {
                $copy = $attr;
                $copy['duration'] = $duration;
                $copy['start'] = $rdate->format('c');
                $copy['end'] = $rdate->add(new DateInterval('PT'.$duration.'M'))->format('c');
                array_push($instances, $copy);
            }
        }
        return $instances;
    }
    
//    static function all() {
//        global $dbh;
//        $rs = array();
//        foreach ($dbh->rs() as $rec) {
//            if (isset($rec['rr'])) {
//                $idx = 1;
//                $r = new When();
//                $r->recur($rec['start'])->rrule($rec['rr']);
//                $start = new DateTime($rec['start']);
//                $end = new DateTime($rec['end']);
//                $diff = $start->diff($end);
//                
//	            while($result = $r->next()) {
//				    $new = new self($rec);
//				    $new->attributes['id'] = $new->attributes['id'].'-r_'.$idx;
//	                $new->attributes['rid'] = $idx++; // recurring instance id, must be unique per event
//	                $new->attributes['start'] = $result->format('c');
//	                $new->attributes['end'] = $result->add($diff)->format('c');
//	                
//	                array_push($rs, $new->attributes);
//	                if ($idx > 31) break;
//				}
//            }
//            else {
//            	array_push($rs, $rec);
//            }
//        }
//        return $rs;
//    }
}
