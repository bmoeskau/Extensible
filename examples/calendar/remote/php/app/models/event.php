<?php
/**
 * @class Event
 */
class Event extends Model {
    static function range($start, $end) {
        global $dbh;
        $found = array();
        $startTime = strtotime($start);
        // add a day to the range end to include event times on that day
        $endTime = new DateTime($end);
        $endTime->modify('+1 day');
        $endTime = strtotime($endTime->format('Y-m-d H:i:s'));
        
        foreach ($dbh->rs() as $rec) {
            //var_dump($rec);
            $recStart = strtotime($rec['start']);
            $recEnd = strtotime($rec['end']);
            
            $startsInRange = ($recStart >= $startTime && $recStart <= $endTime);
            $endsInRange = ($recEnd >= $startTime && $recEnd <= $endTime);
            $spansRange = ($recStart < $startTime && $recEnd > $endTime);
            
            if ($startsInRange || $endsInRange || $spansRange) {
                array_push($found, $rec);
            }
        }
        return $found;
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
