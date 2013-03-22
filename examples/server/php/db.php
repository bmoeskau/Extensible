<?php
    
    Class Database {
        
        private $db;
        private $config;
        
        private $error_mode = PDO::ERRMODE_EXCEPTION;
        private $fetch_type = PDO::FETCH_OBJ;
        
        public function __construct($config = null) {
            $this->config = isset($config) ? $config : new Config();
        }
        
        public function connect() {
            if (!isset($db)) {
                $cfg = $this->config;
                try {
                    $this->db = new PDO('mysql:host='.$cfg->host.';dbname='.$cfg->dbname, $cfg->username, $cfg->password);
                    $this->db->setAttribute(PDO::ATTR_ERRMODE, $this->error_mode);
                }
                catch (PDOException $e) {
                    echo 'ERROR: ' . $e->getMessage();
                }
            }
            return $this->db;
        }
        
        public function select($table, $id = null, $id_col = null) {
            $sql = 'SELECT * FROM '.$table;
            $id_col = isset($id_col) ? $id_col : 'id';
            
            try {
                $this->connect();
                
                if (isset($id)) {
                    $query = $this->db->prepare($sql.' WHERE '.$id_col.' = :id');
                    $query->bindParam(':id', $id);
                    $query->execute();
                }
                else {
                    $query = $this->db->prepare($sql);
                    $query->execute();
                }
                $result = $query->fetchAll($this->fetch_type);
                
                return $result;
            }
            catch (PDOException $e) {
                echo 'ERROR: ' . $e->getMessage();
            }
        }
        
        public function query($table, array $values) {
            $sql = 'SELECT * FROM '.$table;
            $param_mappings = array();
            $col_mappings = array();
            $count = 1;
            
            foreach ($values as $col => $value) {
                // $param is auto-numbered rather than named to support querying
                // multiple times on the same column easily
                $param = ':'.$count++;
                
                if (is_array($value)) {
                    $col = isset($value['column']) ? $value['column'] : $col;
                    $param_mappings[$param] = $value['value'];
                    $comparator = isset($value['comparator']) ? $value['comparator'] : '=';
                    $conjunction = isset($value['conjunction']) ? $value['conjunction'] : 'AND';
                }
                else {
                    $param_mappings[$param] = $value;
                    $comparator = '=';
                    $conjunction = 'AND';
                }
                if (count($col_mappings) === 0) {
                    $conjunction = '';
                }
                if (strtoupper($comparator) === 'LIKE') {
                    // Enable partial matching:
                    $param_mappings[$param] = '%'.$param_mappings[$param].'%';
                }
                array_push($col_mappings, $conjunction.' '.$col.' '.$comparator.' '.$param);
            }
            
            if (count($col_mappings) > 0) {
                $param_list = implode(' ', $col_mappings);
                $sql = $sql.' WHERE '.$param_list;
            }
            //echo $sql.'<br>';
            //print_r($param_mappings);
            
            try {
                $this->connect();
                $query = $this->db->prepare($sql);
                $query->execute($param_mappings);
                $result = $query->fetchAll($this->fetch_type);
                
                return $result;
            }
            catch (PDOException $e) {
                echo 'ERROR: ' . $e->getMessage();
            }
        }
        
        private function save($action, $table, array $values) {
            $param_names = array();
            $param_mappings = array();
            $col_mappings = array();
            
            foreach ($values as $col => $value) {
                $param = ':'.$col;
                array_push($param_names, $param);
                $param_mappings[$param] = $value;
                array_push($col_mappings, $col.'='.$param);
            }
            
            if ($action === 'INSERT') {
                $cols = implode(',', array_keys($values));
                $param_list = implode(',', $param_names);
                $sql = 'INSERT INTO '.$table.' ('.$cols.') VALUES ('.$param_list.')';
            }
            else {
                $cols = implode(',', $col_mappings);
                $sql = 'UPDATE '.$table.' SET '.$cols.' WHERE id = '.$values['id'];
            }
            
            try {
                $this->connect();
                $query = $this->db->prepare($sql);
                $query->execute($param_mappings);
                $result = $query->rowCount();
                
                return $result;
            }
            catch (PDOException $e) {
                echo 'ERROR: ' . $e->getMessage();
            }
        }
        
        public function insert($table, array $values) {
            return $this->save('INSERT', $table, $values);
        }
        
        public function update($table, array $values) {
            return $this->save('UPDATE', $table, $values);
        }
        
        public function delete($table, $id, $id_col = null) {
            $id_col = isset($id_col) ? $id_col : 'id';
            $sql = 'DELETE FROM '.$table.' WHERE '.$id_col.' = :id';
            
            try {
                $this->connect();
                $query = $this->db->prepare($sql);
                $query->bindParam(':id', $id);
                $query->execute();
                $result = $query->rowCount();
                
                return $result;
            }
            catch (PDOException $e) {
                echo 'ERROR: ' . $e->getMessage();
            }
        }
    }

?>