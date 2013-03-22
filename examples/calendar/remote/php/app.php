<?php

    // Set default time zone: UTC. This is requried in PHP 5.3+
    date_default_timezone_set('UTC');

    require('init.php');

    // Get Request
    $request = new Request(array('restful' => true));

    // Get Controller
    require('app/controllers/' . $request->controller . '.php');
    $controller_name = ucfirst($request->controller);
    $controller = new $controller_name;

    // Dispatch request
    echo $controller->dispatch($request);