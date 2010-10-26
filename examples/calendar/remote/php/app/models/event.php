<?php
/**
 * @class Event
 */
class Event extends Model {
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
