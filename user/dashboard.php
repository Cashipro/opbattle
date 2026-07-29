<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once "../config.php";



if(!isset($_SESSION['user_id'])){


header("Location: login.php");

exit;


}



$user_id=$_SESSION['user_id'];




// USER DATA

$stmt=$pdo->prepare("

SELECT *

FROM users

WHERE id=?

");


$stmt->execute([$user_id]);


$user=$stmt->fetch();



if(!$user){

header("Location: logout.php");

exit;

}




// TRANSACTIONS

$stmt=$pdo->prepare("

SELECT *

FROM wallet_transactions

WHERE user_id=?

ORDER BY id DESC

LIMIT 5

");


$stmt->execute([$user_id]);


$transactions=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>

<title>OpBattle Dashboard</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.main{

margin-left:260px;

padding:30px;

}



.card-box{

display:grid;

grid-template-columns:repeat(3,1fr);

gap:20px;

margin-top:30px;

}



.card{

background:#111;

padding:25px;

border-radius:20px;

border:1px solid #222;

}



.title{

color:#aaa;

}



.amount{

font-size:30px;

color:#00ff84;

font-weight:bold;

margin-top:15px;

}



.buttons{

margin-top:25px;

display:flex;

gap:15px;

}



.btn{

padding:15px 25px;

border-radius:15px;

text-decoration:none;

font-weight:bold;

}



.deposit{

background:#00ff84;

color:#000;

}



.withdraw{

background:#111;

border:1px solid #00ff84;

color:white;

}



table{

width:100%;

margin-top:25px;

border-collapse:collapse;

}



td,th{

padding:12px;

border-bottom:1px solid #222;

}



@media(max-width:900px){


.main{

margin-left:0;

padding-top:80px;

}



.card-box{

grid-template-columns:1fr;

}



.buttons{

flex-direction:column;

}


}


</style>


</head>


<body>


<?php include "user-sidebar.php"; ?>



<div class="main">


<h1>

Welcome 

<span style="color:#00ff84">

<?=htmlspecialchars($user['name'])?>

</span>

</h1>



<div class="card-box">


<div class="card">

<div class="title">

Balance

</div>


<div class="amount">

$<?=number_format($user['balance'],2)?>

</div>


</div>



<div class="card">

<div class="title">

PUBG UID

</div>


<div class="amount">

<?=$user['pubg_uid'] ?? 'N/A'?>

</div>


</div>




<div class="card">

<div class="title">

Status

</div>


<div class="amount">

Active

</div>


</div>



</div>





<div class="buttons">


<a href="deposit.php" class="btn deposit">

Deposit

</a>


<a href="withdraw.php" class="btn withdraw">

Withdraw

</a>



</div>





<div class="card" style="margin-top:30px;">


<h2>

Transactions

</h2>


<table>


<tr>

<th>Type</th>

<th>Amount</th>

<th>Status</th>

</tr>



<?php foreach($transactions as $t){ ?>


<tr>

<td>

<?=$t['type']?>

</td>


<td>

$<?=$t['amount']?>

</td>


<td>

<?=$t['status']?>

</td>


</tr>


<?php } ?>



</table>


</div>



</div>


</body>

</html>