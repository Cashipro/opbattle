<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



$stmt=$pdo->query("
SELECT *
FROM users
ORDER BY id DESC
");


$users=$stmt->fetchAll();


?>


<!DOCTYPE html>

<html>

<head>

<title>OpBattle Users</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;
background:#050505;
color:white;
font-family:Arial;

}



.main{

margin-left:270px;
padding:35px;

}



.box{

background:rgba(255,255,255,.06);

border:1px solid rgba(255,255,255,.1);

border-radius:20px;

padding:25px;

}



h1{

margin-bottom:25px;

}



table{

width:100%;

border-collapse:collapse;

}



th{

text-align:left;

color:#00ff84;

padding:15px;

border-bottom:1px solid #333;

}



td{

padding:15px;

border-bottom:1px solid #222;

}



.profile{

width:45px;

height:45px;

border-radius:50%;

object-fit:cover;

}



.empty{

width:45px;

height:45px;

border-radius:50%;

background:#222;

display:flex;

align-items:center;

justify-content:center;

font-weight:bold;

}



.balance{

color:#00ff84;

font-weight:bold;

}



@media(max-width:1000px){


.main{

margin-left:0;

padding-top:80px;

}


table{

font-size:13px;

}



}


</style>


</head>


<body>


<?php include "admin-sidebar.php"; ?>



<div class="main">


<h1>
Users
</h1>



<div class="box">



<table>


<tr>

<th>
Profile
</th>

<th>
Name
</th>

<th>
Email
</th>

<th>
Balance
</th>

<th>
Joined
</th>

</tr>



<?php foreach($users as $user){ ?>


<tr>


<td>


<?php if(!empty($user['profile_pic'])){ ?>


<img class="profile"
src="../uploads/<?=$user['profile_pic']?>">


<?php }else{ ?>


<div class="empty">
<?=strtoupper(substr($user['name'],0,1))?>
</div>


<?php } ?>


</td>




<td>

<?=htmlspecialchars($user['name'])?>

</td>



<td>

<?=htmlspecialchars($user['email'])?>

</td>



<td class="balance">

$ <?=$user['balance']?>

</td>



<td>

<?=date(
"d M Y",
strtotime($user['created_at'])
)?>

</td>


</tr>


<?php } ?>



</table>



</div>



</div>



</body>

</html>