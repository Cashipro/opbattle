<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once "../config.php";


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];



// USER

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
LIMIT 10
");

$stmt->execute([$user_id]);

$transactions=$stmt->fetchAll();




// MY TOURNAMENTS

$stmt=$pdo->prepare("

SELECT

ts.team_number,
ts.slot_number,

t.name,
t.room_id,
t.room_password

FROM tournament_slots ts

JOIN tournaments t

ON t.id = ts.tournament_id


WHERE ts.user_id=?

ORDER BY ts.id DESC

");


$stmt->execute([$user_id]);


$my_tournaments=$stmt->fetchAll();



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



.card{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:25px;

margin-top:25px;

}



.grid{

display:grid;

grid-template-columns:repeat(3,1fr);

gap:20px;

margin-top:25px;

}



.amount{

font-size:30px;

font-weight:bold;

color:#00ff84;

}



.title{

color:#aaa;

}



.tournament{

background:#050505;

border:1px solid #333;

border-radius:15px;

padding:15px;

margin-top:15px;

}



table{

width:100%;

border-collapse:collapse;

}


td,th{

padding:12px;

border-bottom:1px solid #222;

text-align:left;

}



@media(max-width:900px){

.main{

margin-left:0;

padding-top:80px;

}


.grid{

grid-template-columns:1fr;

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




<div class="grid">



<div class="card">

<div class="title">

Balance

</div>


<div class="amount">

PKR <?=number_format($user['balance'],2)?>

</div>


</div>





<div class="card">

<div class="title">

PUBG UID

</div>


<div class="amount">

<?=htmlspecialchars($user['pubg_uid'] ?? 'N/A')?>

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






<div class="card">


<h2>

My Tournaments

</h2>




<?php if($my_tournaments){ ?>



<?php foreach($my_tournaments as $tour){ ?>



<div class="tournament">


<h3>

<?=htmlspecialchars($tour['name'])?>

</h3>


<p>

Status: 

<span style="color:#00ff84">

Joined

</span>

</p>


<p>

Team:

<b>

<?=$tour['team_number']?>

</b>

</p>



<p>

Slot:

<b>

<?=$tour['slot_number']?>

</b>

</p>




<p>

Room ID:

<b>

<?=$tour['room_id'] ?: 'Not Added Yet'?>

</b>

</p>




<p>

Room Password:

<b>

<?=$tour['room_password'] ?: 'Not Added Yet'?>

</b>

</p>



</div>



<?php } ?>



<?php }else{ ?>


<p>

No tournament joined yet.

</p>


<?php } ?>




</div>







<div class="card">


<h2>

Transactions

</h2>




<table>


<tr>

<th>

Type

</th>


<th>

Amount

</th>


<th>

Status

</th>

</tr>




<?php foreach($transactions as $t){ ?>


<tr>


<td>

<?=htmlspecialchars($t['type'])?>

</td>


<td>

PKR <?=number_format($t['amount'],2)?>

</td>


<td>

<?=htmlspecialchars($t['status'] ?? 'completed')?>

</td>


</tr>


<?php } ?>



</table>



</div>






</div>


</body>

</html>