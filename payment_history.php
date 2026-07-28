<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];



$stmt=$pdo->prepare("


SELECT


tr.*,


t.title AS tournament_name



FROM transactions tr



LEFT JOIN tournaments t

ON tr.tournament_id=t.id



WHERE tr.user_id=?



AND tr.transaction_type='entry_fee'



ORDER BY tr.id DESC



");


$stmt->execute([$user_id]);


$payments=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Payment History

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

max-width:1000px;

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



.amount{

color:#60a5fa;

font-weight:900;

}



.empty{

text-align:center;

padding:40px;

}



</style>


</head>



<body>



<div class="container">



<h1>

💳 My Payment History

</h1>




<div class="card">



<?php if(count($payments)>0): ?>



<table>



<tr>

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

Date

</th>


</tr>





<?php foreach($payments as $p): ?>



<tr>



<td>

<?php echo htmlspecialchars($p['tournament_name'] ?? 'N/A'); ?>

</td>




<td class="amount">

<?php echo number_format($p['amount'],2); ?>

</td>




<td class="<?php echo $p['payment_status']; ?>">

<?php echo strtoupper($p['payment_status']); ?>

</td>




<td>

<?php echo date('d M Y h:i A',strtotime($p['created_at'])); ?>

</td>



</tr>



<?php endforeach; ?>



</table>




<?php else: ?>



<div class="empty">

<h2>

No Payments Found

</h2>

<p>

Your tournament payments will appear here.

</p>

</div>



<?php endif; ?>



</div>



</div>



</body>

</html>