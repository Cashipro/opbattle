<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}


$message="";



/*
 APPROVE / REJECT PAYMENT
*/


if(isset($_GET['action']) && isset($_GET['id'])){


$id=intval($_GET['id']);

$action=$_GET['action'];



if(in_array($action,['approved','rejected'])){


$stmt=$pdo->prepare("

UPDATE transactions

SET payment_status=?

WHERE id=?

");


$stmt->execute([

$action,

$id

]);



$message="Payment status updated successfully";


}



}



/*
 GET PAYMENTS
*/


$stmt=$pdo->query("


SELECT


tr.*,


u.name,

u.email,


t.title AS tournament_name



FROM transactions tr



LEFT JOIN users u

ON tr.user_id=u.id



LEFT JOIN tournaments t

ON tr.tournament_id=t.id



WHERE tr.transaction_type='entry_fee'



ORDER BY tr.id DESC



");



$payments=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Payment Approval

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

padding:20px;

border-radius:20px;

border:1px solid #1f2937;

overflow:auto;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:15px;

text-align:left;

color:#9ca3af;

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

💳 Payment Approval

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
Tournament
</th>

<th>
Amount
</th>

<th>
Status
</th>

<th>
Action
</th>

</tr>




<?php foreach($payments as $p): ?>


<tr>



<td>

<?php echo htmlspecialchars($p['name']); ?>

<br>

<small>

<?php echo htmlspecialchars($p['email']); ?>

</small>

</td>



<td>

<?php echo htmlspecialchars($p['tournament_name']); ?>

</td>



<td>

<?php echo number_format($p['amount'],2); ?>

</td>



<td class="<?php echo $p['payment_status']; ?>">

<?php echo strtoupper($p['payment_status']); ?>

</td>



<td>


<?php if($p['payment_status']=='pending'): ?>


<a class="btn approve"

href="?action=approved&id=<?php echo $p['id']; ?>">

APPROVE

</a>



<a class="btn reject"

href="?action=rejected&id=<?php echo $p['id']; ?>">

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