<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once "../config.php";


$error="";


if(isset($_SESSION['user_id'])){

header("Location: dashboard.php");
exit;

}



if(isset($_POST['login'])){


$email = trim($_POST['email']);

$password = $_POST['password'];



$stmt=$pdo->prepare("

SELECT *

FROM users

WHERE email=?

LIMIT 1

");


$stmt->execute([$email]);


$user=$stmt->fetch();



if($user && $password == $user['password']){


$_SESSION['user_id']=$user['id'];

$_SESSION['user_name']=$user['name'];

$_SESSION['user_email']=$user['email'];



header("Location: dashboard.php");

exit;



}else{


$error="Invalid email or password";


}


}



?>



<!DOCTYPE html>

<html>

<head>

<title>OpBattle Login</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>

*{

box-sizing:border-box;

font-family:Arial;

}


body{

margin:0;

height:100vh;

display:flex;

align-items:center;

justify-content:center;

background:#050505;

color:white;

}



.box{

width:380px;

background:#111;

padding:35px;

border-radius:25px;

border:1px solid #222;

}



.logo{

text-align:center;

font-size:40px;

font-weight:bold;

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

}



button{

width:100%;

padding:15px;

background:#00ff84;

border:0;

border-radius:12px;

font-weight:bold;

cursor:pointer;

}



.error{

background:#500;

padding:12px;

border-radius:10px;

margin-bottom:15px;

text-align:center;

}



a{

color:#00ff84;

text-decoration:none;

}



</style>

</head>


<body>


<div class="box">


<div class="logo">

OpBattle

</div>


<?php if($error){ ?>

<div class="error">

<?=$error?>

</div>

<?php } ?>



<form method="POST">


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



<button name="login">

Login

</button>


</form>



<p style="text-align:center">

Don't have account?

<a href="register.php">

Register

</a>

</p>


</div>


</body>

</html>