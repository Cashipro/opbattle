<?php

session_start();


// Remove all session data

$_SESSION=[];



// Destroy session

session_destroy();



// Redirect to login

header("Location: admin_login.php");

exit;

?>