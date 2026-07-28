<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$player_id=intval($_GET['id'] ?? 0);


if(!$player_id){

die("Player ID Missing");

}



/*
 PLAYER DATA
*/


$stmt=$pdo->prepare("

SELECT *

FROM users

WHERE id=?

");


$stmt->execute([$player_id]);


$player=$stmt->fetch();



if(!$player){

die("Player Not Found");

}




/*
 TEAM DATA
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE

player_1=?

OR player_2=?

OR player_3=?

OR player_4=?

LIMIT 1

");


$stmt->execute([

$player_id,

$player_id,

$player_id,

$player_id

]);


$team=$stmt->fetch();





/*
 MATCH STATS
*/


$stats=$pdo->prepare("

SELECT

COUNT(*) matches,

SUM(kills) kills,

SUM(total_points) points,

SUM(CASE WHEN position=1 THEN 1 ELSE 0 END) wins


FROM match_results mr


JOIN teams t

ON mr.team_id=t.id



WHERE

t.player_1=?

OR t.player_2=?

OR t.player_3=?

OR t.player_4=?


");


$stats->execute([

$player_id,

$player_id,

$player_id,

$player_id

]);


$stat=$stats->fetch();





/*
 PAYMENTS
*/


$stmt=$pdo->prepare("

SELECT *

FROM transactions

WHERE user_id=?

ORDER BY id DESC

LIMIT 10

");


$stmt->execute([$player_id]);


$payments=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Player View

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



h1,h2{

color:#ccff00;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:25px;

margin-bottom:20px;

}



.grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(180px,1fr));

gap:15px;

}



.stat{

background:#161b22;

padding:20px;

border-radius:15px;

}



.number{

font-size:30px;

font-weight:900;

color:#22c55e;

}



.label{

color:#9ca3af;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:12px;

text-align:left;

}



td{

padding:12px;

border-bottom:1px solid #1f2937;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 Player Details

</h1>




<div class="card">


<h2>

<?php echo htmlspecialchars($player['name']); ?>

</h2>


<p>

Email:

<?php echo htmlspecialchars($player['email']); ?>

</p>


<p>

PUBG UID:

<?php echo htmlspecialchars($player['pubg_uid'] ?? 'N/A'); ?>

</p>


<p>

Status:

<?php echo strtoupper($player['account_status'] ?? 'active'); ?>

</p>



</div>





<div class="card">


<h2>

📊 Performance

</h2>



<div class="grid">



<div class="stat">

<div class="number">

<?php echo $stat['matches'] ?? 0; ?>

</div>

<div class="label">

Matches

</div>

</div>



<div class="stat">

<div class="number">

<?php echo $stat['kills'] ?? 0; ?>

</div>

<div class="label">

Kills

</div>

</div>



<div class="stat">

<div class="number">

<?php echo $stat['points'] ?? 0; ?>

</div>

<div class="label">

Points

</div>

</div>



<div class="stat">

<div class="number">

<?php echo $stat['wins'] ?? 0; ?>

</div>

<div class="label">

Wins

</div>

</div>


</div>


</div>







<div class="card">


<h2>

👥 Team

</h2>


<?php if($team): ?>


<?php echo htmlspecialchars($team['team_name']); ?>


<?php else: ?>


No Team


<?php endif; ?>


</div>






<div class="card">


<h2>

💳 Payment History

</h2>



<table>


<tr>

<th>

Amount

</th>

<th>

Type

</th>

<th>

Status

</th>

</tr>




<?php foreach($payments as $p): ?>

<tr>


<td>

<?php echo number_format($p['amount'],2); ?>

</td>


<td>

<?php echo strtoupper($p['transaction_type']); ?>

</td>


<td>

<?php echo strtoupper($p['payment_status']); ?>

</td>


</tr>


<?php endforeach; ?>


</table>



</div>




</div>


</body>

</html>