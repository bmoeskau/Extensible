<?php
    $doctype = '';
    
    if (isset($_REQUEST['dtd']) && $_REQUEST['dtd'] != '') {
        if ($_REQUEST['dtd'] == 'html5') {
            $doctype = '<!DOCTYPE html>';
        }
        else {
            $doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD '.$_REQUEST['doctype'].
                       '//EN" "http://www.w3.org/TR/'.$_REQUEST['dtd'].'.dtd">';
        }
    }
    echo $doctype;
?>
<html>
<head>
    <title>Extensible : Doctype Tester</title>
    <!-- Sets up all Ext and Extensible includes: -->
    <script type="text/javascript" src="../../Extensible-config.js"></script>
    
    <!-- Page-specific includes -->
    <script type="text/javascript" src="doc-types.js"></script>
    <style>
        .sample-ct {
            /* pre-size the container for smoother rendering, should match the panel's height config */
            height: 700px;
        }
        .combo-ct {
            padding-bottom: 20px;
        }
    </style>
</head>
<body>
    <div id="sample-overview">
        <h1>Doctype Tester</h1>
        <p><strong>NOTE:</strong> PHP is required to run this example.</p>
        <p>This example simply allows you to test the calendar layout using most of the common HTML doc types. The "Doctype Markup"
        shown below is exactly the doc type rendered into the page, which you can see if you view source.</p>
        
        <p class="view-src"><a target="_blank" href="doc-types.js">View the source</a></p>
        
        <div class="combo-ct">
            <div style="float:left;padding:5px 10px 0 0;">Selected Doctype:</div>
            <div id="doctypes" style="float:left;"></div>
            <div style="clear:left;"></div>
            
            <div style="float:left;padding:5px 10px 0 0;margin-top:10px;">Doctype Markup:</div>
            <div id="markup" style="float:left;margin-top:15px;color:#555;"><tt><?php echo $doctype != '' ? htmlentities($doctype) : '(none)'; ?></tt></div>
            <div style="clear:left;"></div>
        </div>
    </div>
    
    <div id="cal" class="sample-ct"></div>
</body>
</html>