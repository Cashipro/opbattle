<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$admin_id=$_SESSION['admin_id'];

$message="";

$error="";




if(isset($_POST['change'])){


$old_password=$_POST['old_password'];

$new_password=$_POST['new_password'];

$confirm_password=$_POST['confirm_password'];




$stmt=$pdo->prepare("

SELECT password

FROM admins

WHERE id=?

");


$stmt->execute([$admin_id]);


$admin=$stmt->fetch();



if(!$admin || !password_verify($old_password,$admin['password'])){


$error="Current password is incorrect";


}

elseif($new_password !== $confirm_password){


$error="New passwords do not match";


}

elseif(strlen($new_password)<6){


$error="Password must be at least 6 characters";


}

else{


$new_hash=password_hash(

$new_password,

PASSWORD_DEFAULT

);



$stmt=$pdo->prepare("

UPDATE admins

SET password=?

WHERE id=?

");


$stmt->execute([

$new_hash,

$admin_id

]);



$message="Password changed successfully";


}



}



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Change Password

</title>


<meta name="viewport" content="width=device-width,initial-scale=1">



<style>


*{

box-sizing:border-box;

font-family:Segoe UI,sans-serif;

}



body{

margin:0;

background:

radial-gradient(circle at top,#263800,#050505);

color:white;

}



.container{

max-width:600px;

margin:50px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:30px;

}



input{

width:100%;

padding:14px;

margin-bottom:15px;

background:#161b22;

border:1px solid #374151;

border-radius:12px;

color:white;

}



button{

width:100%;

padding:15px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:900;

cursor:pointer;

}



.alert{

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



.success{

background:#052e16;

color:#22c55e;

}



.error{

background:#450a0a;

color:#ef4444;

}



</style>


</head>



<body>



<div class="container">



<h1>

🔐 Change Password

</h1>




<?php if($message): ?>

<div class="alert success">

<?php echo $message; ?>

</div>

<?php endif; ?>



<?php if($error): ?>

<div class="alert error">

<?php echo $error; ?>

</div>

<?php endif; ?>





<div class="card">



<form method="post">



<input

type="password"

name="old_password"

placeholder="Current Password"

required

>




<input

type="password"

name="new_password"

placeholder="New Password"

required

>




<input

type="password"

name="confirm_password"

placeholder="Confirm New Password"

required

>




<button name="change">

UPDATE PASSWORD

</button>



</form>



</div>



</div>



</body>

</html>