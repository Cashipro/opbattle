<?php

require_once 'config.php';


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];

$message="";

$error="";



/*
 UPDATE PROFILE
*/


if(isset($_POST['update'])){


$name=trim($_POST['name']);

$pubg_uid=trim($_POST['pubg_uid']);

$game_name=trim($_POST['game_name']);

$country=trim($_POST['country']);




if(empty($name) || empty($pubg_uid)){


$error="Name and PUBG UID are required";


}else{



$stmt=$pdo->prepare("

UPDATE users

SET

name=?,

pubg_uid=?,

game_name=?,

country=?

WHERE id=?

");


$stmt->execute([


$name,

$pubg_uid,

$game_name,

$country,

$user_id


]);



$message="Profile updated successfully";


}



}






/*
 GET USER DATA
*/


$stmt=$pdo->prepare("

SELECT *

FROM users

WHERE id=?

");


$stmt->execute([$user_id]);


$user=$stmt->fetch();



?>



<!DOCTYPE html>

<html>

<head>


<title>
OPBattle Edit Profile
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




.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:30px;

}





h1{

color:#ccff00;

margin-bottom:25px;

}





label{

display:block;

color:#9ca3af;

font-size:13px;

margin-bottom:7px;

}



input,select{


width:100%;

padding:14px;

margin-bottom:18px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

}



button{

width:100%;

padding:15px;

background:#ccff00;

color:black;

border:0;

border-radius:12px;

font-weight:900;

cursor:pointer;

font-size:15px;

}




.success{

background:#052e16;

border:1px solid #22c55e;

padding:15px;

border-radius:10px;

color:#22c55e;

margin-bottom:20px;

}



.error{

background:#450a0a;

border:1px solid #ef4444;

padding:15px;

border-radius:10px;

color:#ef4444;

margin-bottom:20px;

}



.avatar{

width:90px;

height:90px;

border-radius:50%;

background:#ccff00;

color:black;

display:flex;

align-items:center;

justify-content:center;

font-size:35px;

font-weight:900;

margin:auto auto 20px;

}



</style>


</head>


<body>



<div class="container">


<div class="card">



<div class="avatar">

<?php echo strtoupper(substr($user['name'],0,1)); ?>

</div>



<h1>

Edit Gaming Profile

</h1>





<?php if($message): ?>

<div class="success">

<?php echo $message; ?>

</div>

<?php endif; ?>



<?php if($error): ?>

<div class="error">

<?php echo $error; ?>

</div>

<?php endif; ?>





<form method="post">



<label>

Player Name

</label>


<input

type="text"

name="name"

value="<?php echo htmlspecialchars($user['name']); ?>"

>





<label>

PUBG UID

</label>


<input

type="text"

name="pubg_uid"

value="<?php echo htmlspecialchars($user['pubg_uid'] ?? ''); ?>"

placeholder="Enter PUBG UID"

>





<label>

In Game Name

</label>


<input

type="text"

name="game_name"

value="<?php echo htmlspecialchars($user['game_name'] ?? ''); ?>"

placeholder="PUBG Name"

>





<label>

Country

</label>


<select name="country">


<option value="Pakistan">

Pakistan

</option>


<option value="Oman">

Oman

</option>


<option value="India">

India

</option>


<option value="Other">

Other

</option>


</select>





<button name="update">

SAVE PROFILE

</button>



</form>



</div>


</div>


</body>

</html>