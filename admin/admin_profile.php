<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$admin_id=$_SESSION['admin_id'];

$message="";



/*
 UPDATE PROFILE
*/


if(isset($_POST['update'])){


$name=trim($_POST['name']);

$email=trim($_POST['email']);



$stmt=$pdo->prepare("

UPDATE admins

SET name=?,

email=?

WHERE id=?

");



$stmt->execute([

$name,

$email,

$admin_id

]);



$message="Profile updated successfully";


}




/*
 CHANGE PASSWORD
*/


if(isset($_POST['password'])){


$new_password=$_POST['new_password'];



$hash=password_hash(

$new_password,

PASSWORD_DEFAULT

);



$stmt=$pdo->prepare("

UPDATE admins

SET password=?

WHERE id=?

");



$stmt->execute([

$hash,

$admin_id

]);



$message="Password changed successfully";


}





/*
 GET ADMIN

*/


$stmt=$pdo->prepare("

SELECT *

FROM admins

WHERE id=?

");


$stmt->execute([$admin_id]);


$admin=$stmt->fetch();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Admin Profile

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

max-width:700px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:25px;

margin-bottom:20px;

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



label{

color:#9ca3af;

display:block;

margin-bottom:8px;

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

background:#052e16;

padding:15px;

border-radius:12px;

color:#22c55e;

margin-bottom:20px;

}



</style>


</head>



<body>



<div class="container">



<h1>

🛡️ Admin Profile

</h1>




<?php if($message): ?>


<div class="alert">

<?php echo $message; ?>

</div>


<?php endif; ?>





<div class="card">



<h2>

Update Profile

</h2>



<form method="post">



<label>

Admin Name

</label>


<input

type="text"

name="name"

value="<?php echo htmlspecialchars($admin['name']); ?>"

required

>




<label>

Email

</label>


<input

type="email"

name="email"

value="<?php echo htmlspecialchars($admin['email']); ?>"

required

>



<button name="update">

SAVE PROFILE

</button>



</form>



</div>







<div class="card">



<h2>

Change Password

</h2>



<form method="post">



<label>

New Password

</label>


<input

type="password"

name="new_password"

required

>



<button name="password">

CHANGE PASSWORD

</button>



</form>



</div>






</div>


</body>

</html>