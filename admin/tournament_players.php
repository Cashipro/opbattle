<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$tournament_id=intval($_GET['id'] ?? 0);


if(!$tournament_id){

die("Tournament ID Missing");

}



/*
 TOURNAMENT DATA
*/

$stmt=$pdo->prepare("

SELECT *

FROM tournaments

WHERE id=?

");


$stmt->execute([$tournament_id]);


$tournament=$stmt->fetch();


if(!$tournament){

die("Tournament Not Found");

}




/*
 PLAYERS LIST
*/


$stmt=$pdo->prepare("


SELECT


tr.*,


u.name,

u.email,

u.pubg_uid



FROM transactions tr



JOIN users u

ON tr.user_id=u.id



WHERE

tr.tournament_id=?

AND tr.transaction_type='entry_fee'



ORDER BY tr.id DESC



");


$stmt->execute([$tournament_id]);


$players=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>

Tournament Players

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

max-width:1100px;

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

overflow:auto;

}



.info{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(200px,1fr));

gap:15px;

}



.box{

background:#161b22;

padding:20px;

border-radius:15px;

}



.number{

font-size:28px;

font-weight:900;

color:#22c55e;

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


</style>


</head>



<body>



<div class="container">



<h1>

👥 Tournament Players

</h1>




<div class="card">



<h2>

<?php echo htmlspecialchars($tournament['title']); ?>

</h2>


<div class="info">



<div class="box">

<div class="number">

<?php echo count($players); ?>

</div>

Joined Players

</div>



<div class="box">

Entry Fee

<br>

<?php echo number_format($tournament['entry_fee'],2); ?>

</div>



<div class="box">

Prize Pool

<br>

<?php echo number_format($tournament['prize_pool'],2); ?>

</div>



</div>


</div>







<div class="card">



<table>



<tr>

<th>

Player

</th>


<th>

PUBG UID

</th>


<th>

Email

</th>


<th>

Payment Status

</th>


</tr>




<?php foreach($players as $p): ?>



<tr>



<td>

<?php echo htmlspecialchars($p['name']); ?>

</td>



<td>

<?php echo htmlspecialchars($p['pubg_uid'] ?? 'N/A'); ?>

</td>



<td>

<?php echo htmlspecialchars($p['email']); ?>

</td>



<td class="<?php echo $p['payment_status']; ?>">

<?php echo strtoupper($p['payment_status']); ?>

</td>



</tr>



<?php endforeach; ?>



</table>



</div>




</div>



</body>

</html>