<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$message="";



/*
 UPDATE WITHDRAWAL STATUS
*/


if(isset($_GET['action']) && isset($_GET['id'])){


$id=intval($_GET['id']);

$action=$_GET['action'];



if(in_array($action,['approved','rejected'])){


$stmt=$pdo->prepare("

UPDATE withdrawals

SET status=?

WHERE id=?

");


$stmt->execute([

$action,

$id

]);



$message="Withdrawal status updated";

}



}




/*
 GET WITHDRAWALS
*/


$stmt=$pdo->query("


SELECT

w.*,

u.name,

u.email


FROM withdrawals w


LEFT JOIN users u

ON w.user_id=u.id


ORDER BY w.id DESC


");


$withdrawals=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>

OPBattle Withdrawal Management

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

max-width:1200px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.alert{

background:#052e16;

color:#22c55e;

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:20px;

overflow:auto;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:15px;

color:#9ca3af;

text-align:left;

}



td{

padding:15px;

border-bottom:1px solid #1f2937;

}



.pending{

color:#fbbf24;

font-weight:bold;

}



.approved{

color:#22c55e;

font-weight:bold;

}



.rejected{

color:#ef4444;

font-weight:bold;

}



.btn{

padding:8px 12px;

border-radius:10px;

text-decoration:none;

font-weight:bold;

}



.approve{

background:#22c55e;

color:black;

}



.reject{

background:#ef4444;

color:white;

}



</style>


</head>



<body>



<div class="container">



<h1>

💸 Withdrawal Requests

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>




<div class="card">



<table>



<tr>

<th>

Player

</th>

<th>

Amount

</th>

<th>

Wallet

</th>

<th>

Network

</th>

<th>

Status

</th>

<th>

Action

</th>

</tr>




<?php foreach($withdrawals as $w): ?>

<tr>



<td>

<?php echo htmlspecialchars($w['name']); ?>

<br>

<small>

<?php echo htmlspecialchars($w['email']); ?>

</small>

</td>



<td>

<?php echo number_format($w['amount'],2); ?>

</td>



<td>

<?php echo htmlspecialchars($w['wallet_address']); ?>

</td>



<td>

<?php echo htmlspecialchars($w['network']); ?>

</td>



<td class="<?php echo $w['status']; ?>">

<?php echo strtoupper($w['status']); ?>

</td>



<td>



<?php if($w['status']=='pending'): ?>


<a class="btn approve"

href="?action=approved&id=<?php echo $w['id']; ?>">

APPROVE

</a>



<a class="btn reject"

href="?action=rejected&id=<?php echo $w['id']; ?>">

REJECT

</a>


<?php else: ?>


Completed


<?php endif; ?>



</td>



</tr>



<?php endforeach; ?>



</table>



</div>



</div>



</body>

</html>