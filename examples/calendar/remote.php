<?php 
    if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    	$action = stripslashes($_POST['action']);
    	echo $action;
    }
?>