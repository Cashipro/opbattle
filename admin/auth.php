<?php

session_start();

require_once "../config.php";


if(isset($_SESSION['admin_id'])){

    header("Location: dashboard.php");
    exit;

}


if($_SERVER['REQUEST_METHOD']=="POST"){


$username = $_POST['username'];
$password = $_POST['password'];



$stmt = $pdo->prepare("
SELECT *
FROM admins
WHERE username=?
");


$stmt->execute([$username]);


$admin = $stmt->fetch();



if($admin && $password == $admin['password']){


$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_username'] = $admin['username'];


header("Location: dashboard.php");
exit;


}else{


$_SESSION['error']="Invalid Username or Password";

header("Location: admin_login.php");
exit;


}



}

?>