<?php

session_start();

require_once "../config.php";



if(isset($_SESSION['admin_id'])){

header("Location: admin-dashboard.php");
exit;

}




$error="";



if(isset($_POST['login'])){


$username = $_POST['username'];

$password = $_POST['password'];




$stmt=$pdo->prepare("

SELECT *

FROM admins

WHERE username=?

LIMIT 1

");


$stmt->execute([$username]);


$admin=$stmt->fetch();




if($admin && $password == $admin['password']){


$_SESSION['admin_id']=$admin['id'];

$_SESSION['admin_username']=$admin['username'];



header("Location: admin-dashboard.php");

exit;



}else{


$error="Invalid Username or Password";


}



}



?>



<!DOCTYPE html>

<html>

<head>


<title>OpBattle Admin Login</title>


<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{


margin:0;

height:100vh;

display:flex;

align-items:center;

justify-content:center;

background:#050505;

color:white;

font-family:Arial;


}



.login-box{


width:350px;

background:#111;

border:1px solid #222;

padding:35px;

border-radius:25px;

box-shadow:0 0 40px rgba(0,255,132,.15);


}



h1{


text-align:center;

color:#00ff84;

margin-bottom:30px;


}



input{


width:100%;

padding:15px;

margin-bottom:18px;

background:#000;

border:1px solid #333;

border-radius:12px;

color:white;


}



button{


width:100%;

padding:15px;

background:#00ff84;

color:#000;

border:0;

border-radius:12px;

font-weight:bold;

font-size:16px;

cursor:pointer;


}



.error{


background:#300;

padding:12px;

border-radius:10px;

margin-bottom:15px;

text-align:center;


}



</style>


</head>



<body>



<div class="login-box">


<h1>

OpBattle

</h1>



<?php if($error){ ?>

<div class="error">

<?=$error?>

</div>

<?php } ?>



<form method="POST">


<input

type="text"

name="username"

placeholder="Admin Username"

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



</div>



</body>

</html>