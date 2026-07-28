<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$status=$_GET['status'] ?? '';



if($status){


$stmt=$pdo->prepare("

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


WHERE tr.payment_status=?


ORDER BY tr.id DESC


");


$stmt->execute([$status]);



}else{


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


ORDER BY tr.id DESC


");


}



$transactions=$stmt->fetchAll();



$total=$pdo->query("

SELECT SUM(amount)

FROM transactions

WHERE payment_status='approved'

")->fetchColumn();


?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Transactions
</title>


<meta name="viewport" content="width=device-width,initial-scale=1">



<style>


*{

box-sizing:border-box;

font-family:Segoe UI,sans-serif;

}



body{

margin:0;

background:#050505;

color:white;

}



.container{

max-width:1100px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.summary{

background:#0f1319;

padding:20px;

border-radius:20px;

margin-bottom:20px;

}



.amount{

font-size:30px;

font-weight:900;

color:#22c55e;

}



.card{

background:#0f1319;

padding:20px;

border-radius:20px;

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



.approved{

color:#22c55e;

font-weight:bold;

}



.pending{

color:#fbbf24;

font-weight:bold;

}



.rejected{

color:#ef4444;

font-weight:bold;

}



.filter a{

padding:10px 15px;

background:#ccff00;

color:black;

border-radius:10px;

text-decoration:none;

font-weight:bold;

margin-right:5px;

}


</style>


</head>



<body>



<div class="container">



<h1>

💰 Transaction Management

</h1>



<div class="summary">


Total Approved Collection:

<br>

<div class="amount">

<?php echo number_format($total ?? 0,2); ?>

</div>


</div>




<div class="filter">


<a href="transaction_management.php">

ALL

</a>


<a href="?status=approved">

APPROVED

</a>


<a href="?status=pending">

PENDING

</a>


<a href="?status=rejected">

REJECTED

</a>


</div>

<br>




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
Type
</th>

<th>
Status
</th>

<th>
Date
</th>

</tr>



<?php foreach($transactions as $tr): ?>

<tr>


<td>

<?php echo htmlspecialchars($tr['name'] ?? 'Unknown'); ?>

<br>

<small>

<?php echo htmlspecialchars($tr['email'] ?? ''); ?>

</small>

</td>



<td>

<?php echo htmlspecialchars($tr['tournament_name'] ?? 'N/A'); ?>

</td>



<td>

<?php echo number_format($tr['amount'],2); ?>

</td>



<td>

<?php echo strtoupper($tr['transaction_type']); ?>

</td>



<td class="<?php echo $tr['payment_status']; ?>">

<?php echo strtoupper($tr['payment_status']); ?>

</td>



<td>

<?php echo date('d M Y',strtotime($tr['created_at'])); ?>

</td>


</tr>


<?php endforeach; ?>


</table>


</div>



</div>


</body>

</html>