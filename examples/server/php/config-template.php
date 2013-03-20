<?php

    //
    // NOTE: Rename this file to config.php and update the values below as needed
    //
    
    class Config
    {
        /**
         * These are used when connecting to the database like this:
         * 
         *   new PDO('mysql:host={$host};dbname={$dbname}', {$username}, {$password});
         * 
         * To create the test database structure see ../setup.sql
         */
        public $host     = 'your_host_name';
        public $dbname   = 'your_database_name';
        public $username = 'your_database_user';
        public $password = 'your_password';
    }
    
?>