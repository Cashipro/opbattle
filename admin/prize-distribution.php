<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



$tournament_id=$_GET['tournament_id'] ?? '';

if(!$tournament_id){

die("Tournament ID Missing");

}




// SEND PRIZE

if(isset($_POST['send_prize'])){


$team_name=$_POST['team_name'];

$amount=$_POST['amount'];



// FIND TEAM MEMBERS

$stmt=$pdo->prepare("

SELECT 

ts.user_id

FROM tournament_slots ts

WHERE ts.tournament_id=?

AND ts.team_name=?

AND ts.user_id IS NOT NULL

");


$stmt->execute([

$tournament_id,

$team_name

]);


$members=$stmt->fetchAll();



if($members){



foreach($members as $m){



// ADD BALANCE

$add=$pdo->prepare("

UPDATE users

SET balance = balance + ?

WHERE id=?

");


$add->execute([

$amount,

$m['user_id']

]);




// TRANSACTION

$trans=$pdo->prepare("

INSERT INTO wallet_transactions

(user_id,type,amount,description)

VALUES(?,?,?,?)

");


$trans->execute([

$m['user_id'],

'prize',

$amount,

'Tournament Prize Received'

]);



}



}



header("Location: prize-distribution.php?tournament_id=".$tournament_id);

exit;


}







// WINNERS


$stmt=$pdo->prepare("

SELECT

team_name,

SUM(total_points) total_points

FROM match_results mr

JOIN matches m

ON m.id=mr.match_id

WHERE m.tournament_id=?

GROUP BY team_name

ORDER BY total_points DESC

LIMIT 3

");


$stmt->execute([$tournament_id]);


$winners=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>

<title>Prize Distribution - OpBattle</title>

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



.card{

background:#111;

border:1px solid #222;

padding:25px;

border-radius:20px;

margin-bottom:20px;

}



input{

width:100%;

padding:14px;

background:#000;

border:1px solid #444;

color:white;

border-radius:12px;

margin:10px 0;

}



button{

background:#00ff84;

border:0;

padding:12px 20px;

border-radius:12px;

font-weight:bold;

}



.rank{

color:#00ff84;

font-size:22px;

font-weight:bold;

}



@media(max-width:1000px){

.main{

margin-left:0;

padding-top:80px;

}

}


</style>

</head>


<body>


<?php include "admin-sidebar.php"; ?>



<div class="main">


<h1>

Prize Distribution

</h1>



<?php foreach($winners as $key=>$w){ ?>


<div class="card">


<h2>

<span class="rank">

<?=($key+1)?> Place

</span>

</h2>


<p>

Team:

<?=$w['team_name']?>

</p>


<p>

Points:

<?=$w['total_points']?>

</p>



<form method="POST">


<input type="hidden"

name="team_name"

value="<?=$w['team_name']?>">



<input

type="number"

name="amount"

placeholder="Prize Amount"

required>



<button name="send_prize">

Send Prize

</button>


</form>



</div>



<?php } ?>



</div>


</body>

</html>