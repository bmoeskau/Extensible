<?php
/**
 * @class User
 */
class Event extends Model {
    static function all() {
        global $dbh;
        $rs = array();
        foreach ($dbh->rs() as $rec) {
        	array_push($rs, $rec);
            if (isset($rec['rr'])) {
                $start = $new->attributes['start'];
                $rrule = $new->attributes['rr'];
                $idx = 1;
                
                $r = new When();
                $r->recur($start)->rrule($rrule);
                
	            while($result = $r->next()) {
				    $new = new self($rec);
				    $new->attributes['rinst'] = 1;
	                $new->attributes['id'] = $new->attributes['id'] . '-' . $idx++;
	                $new->attributes['start'] = $result->format('c');
	                $new->attributes['end'] = $new->attributes['start'];
	                array_push($rs, $new->attributes);
	                
	                if ($idx > 31) break;
				}
            }
        }
        return $rs;
    }
}
