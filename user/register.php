<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once "../config.php";


$error = "";
$success = "";



if(isset($_POST['register'])){


$name = trim($_POST['name']);

$pubg_uid = trim($_POST['pubg_uid']);

$email = trim($_POST['email']);

$password = $_POST['password'];

$confirm_password = $_POST['confirm_password'];





if($password !== $confirm_password){


$error = "Password and confirm password do not match";


}else{



$stmt = $pdo->prepare("

SELECT id 

FROM users 

WHERE email = ? OR pubg_uid = ?

");


$stmt->execute([

$email,

$pubg_uid

]);



if($stmt->fetch()){


$error = "Email or PUBG UID already exists";


}else{



$stmt = $pdo->prepare("

INSERT INTO users

(
name,
pubg_uid,
email,
password
)

VALUES
(?,?,?,?)

");



$stmt->execute([

$name,

$pubg_uid,

$email,

$password

]);



$success = "Account created successfully. You can login now.";



}



}



}



?>



<!DOCTYPE html>

<html lang="en">

<head>


<meta charset="UTF-8">

<meta name="viewport" content="width=device-width,initial-scale=1.0">


<title>OpBattle Register</title>



<style>


*{

margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;

}



body{

min-height:100vh;

display:flex;

align-items:center;

justify-content:center;

background:#050505;

color:white;

}



.register-box{

width:390px;

padding:35px;

background:#111;

border-radius:25px;

border:1px solid rgba(255,255,255,.08);

box-shadow:0 0 40px rgba(0,255,132,.08);

}



.logo{

text-align:center;

font-size:38px;

font-weight:900;

color:#00ff84;

margin-bottom:25px;

}



input{

width:100%;

padding:15px;

margin-bottom:15px;

background:#050505;

border:1px solid #333;

border-radius:12px;

color:white;

font-size:14px;

}



input:focus{

outline:none;

border-color:#00ff84;

}



button{

width:100%;

padding:15px;

border:none;

border-radius:12px;

background:#00ff84;

color:#000;

font-weight:bold;

font-size:16px;

cursor:pointer;

}



.message{

padding:12px;

border-radius:10px;

margin-bottom:15px;

text-align:center;

font-size:14px;

}



.error{

background:#400;

}



.success{

background:#063;

}



.login{

text-align:center;

margin-top:20px;

color:#aaa;

}



.login a{

color:#00ff84;

text-decoration:none;

}



</style>



</head>


<body>



<div class="register-box">



<div class="logo">

OpBattle

</div>



<?php if($error){ ?>

<div class="message error">

<?=$error?>

</div>

<?php } ?>



<?php if($success){ ?>

<div class="message success">

<?=$success?>

</div>

<?php } ?>





<form method="POST">



<input

type="text"

name="name"

placeholder="Full Name"

required>




<input

type="text"

name="pubg_uid"

placeholder="PUBG UID"

required>




<input

type="email"

name="email"

placeholder="Email Address"

required>




<input

type="password"

name="password"

placeholder="Password"

required>




<input

type="password"

name="confirm_password"

placeholder="Confirm Password"

required>




<button name="register">

Create Account

</button>



</form>



<div class="login">

Already have account?

<a href="login.php">

Login

</a>

</div>



</div>



</body>

</html>