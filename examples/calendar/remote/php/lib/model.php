<?php
/**
 * @class Model
 * Baseclass for Models in this imaginary ORM
 */
class Model {
    
    public $id, $attributes;
    
    static function find($id) {
        global $dbh;
        $found = null;
        foreach ($dbh->rs() as $rec) {
            if ($rec['id'] == $id) {
                $found = new self($rec);
                break;
            }
        }
        return $found;
    }
    
    static function all() {
        global $dbh;
        return $dbh->rs();
    }

    public function __construct($params) {
        $this->id = isset($params['id']) ? $params['id'] : null;
        $this->attributes = $params;
    }
    
    public function save() {
        global $dbh;
        $this->attributes['id'] = $dbh->pk();
        $dbh->insert($this->attributes);
    }
    
    public function to_hash() {
        return $this->attributes;
    }
}