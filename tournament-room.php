<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];


$tournament_id=$_GET['id'] ?? '';

if(!$tournament_id){

die("Tournament ID Missing");

}




// TOURNAMENT DATA

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





// JOIN / CHANGE SLOT

if(isset($_POST['join_slot'])){


$slot_id=$_POST['slot_id'];




// CHECK USER ALREADY JOINED

$stmt=$pdo->prepare("

SELECT id

FROM tournament_slots

WHERE tournament_id=?

AND user_id=?

");


$stmt->execute([

$tournament_id,

$user_id

]);


$already_joined=$stmt->fetch();






$pdo->beginTransaction();


try{



// FIRST TIME JOIN

if(!$already_joined){



// CHECK BALANCE

$stmt=$pdo->prepare("

SELECT balance

FROM users

WHERE id=?

");


$stmt->execute([$user_id]);

$user=$stmt->fetch();



if($user['balance'] < $tournament['entry_fee']){


throw new Exception("Insufficient Balance");


}






// CUT FEE

$stmt=$pdo->prepare("

UPDATE users

SET balance=balance-?

WHERE id=?

");


$stmt->execute([

$tournament['entry_fee'],

$user_id

]);






// TRANSACTION

$stmt=$pdo->prepare("

INSERT INTO wallet_transactions

(user_id,type,amount,description)

VALUES(?,?,?,?)

");


$stmt->execute([

$user_id,

'entry_fee',

$tournament['entry_fee'],

"Tournament Entry Fee"

]);





}



// REMOVE OLD SLOT IF EXISTS

$stmt=$pdo->prepare("

UPDATE tournament_slots

SET user_id=NULL,
joined_at=NULL

WHERE tournament_id=?

AND user_id=?

");


$stmt->execute([

$tournament_id,

$user_id

]);







// ASSIGN NEW SLOT

$stmt=$pdo->prepare("

UPDATE tournament_slots

SET user_id=?,
joined_at=NOW()

WHERE id=?

AND user_id IS NULL

");


$stmt->execute([

$user_id,

$slot_id

]);






$pdo->commit();



header("Location:tournament-room.php?id=".$tournament_id);

exit;



}

catch(Exception $e){


$pdo->rollBack();

die($e->getMessage());


}



}







// CREATE SLOTS IF EMPTY


$stmt=$pdo->prepare("

SELECT COUNT(*)

FROM tournament_slots

WHERE tournament_id=?

");


$stmt->execute([$tournament_id]);


$total_slots=$stmt->fetchColumn();



if($total_slots==0){


for($team=1;$team<=100;$team++){


for($slot=1;$slot<=4;$slot++){


$stmt=$pdo->prepare("

INSERT INTO tournament_slots

(
tournament_id,
team_number,
slot_number
)

VALUES(?,?,?)

");


$stmt->execute([

$tournament_id,

$team,

$slot

]);


}


}


}







// GET SLOTS


$stmt=$pdo->prepare("

SELECT

ts.*,

u.name,

u.profile_pic

FROM tournament_slots ts

LEFT JOIN users u

ON u.id=ts.user_id

WHERE ts.tournament_id=?

ORDER BY team_number,slot_number

");


$stmt->execute([$tournament_id]);


$slots=$stmt->fetchAll();



$teams=[];


foreach($slots as $s){

$teams[$s['team_number']][]=$s;

}



?>



<!DOCTYPE html>

<html>

<head>

<title>Team Room - OpBattle</title>


<meta name="viewport" content="width=device-width,initial-scale=1">


<style>

body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.container{

padding:25px;

}



.grid{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:18px;

}



.team{

background:#111;

border:1px solid #222;

border-radius:18px;

padding:15px;

}



.team h3{

color:#00ff84;

}



.slot{

background:#050505;

border-radius:12px;

padding:12px;

margin-top:10px;

min-height:40px;

}



.profile{

display:flex;

align-items:center;

gap:10px;

}



.profile img{

width:35px;

height:35px;

border-radius:50%;

}



button{

width:100%;

background:none;

border:0;

color:#00ff84;

cursor:pointer;

}



@media(max-width:900px){

.grid{

grid-template-columns:1fr;

}

}


</style>


</head>


<body>


<div class="container">


<h1>

<?=htmlspecialchars($tournament['name'])?>

</h1>


<p>

Entry Fee:

<b>

PKR <?=number_format($tournament['entry_fee'],2)?>

</b>

</p>





<div class="grid">


<?php foreach($teams as $number=>$team){ ?>


<div class="team">


<h3>

Team <?=$number?>

</h3>



<?php foreach($team as $slot){ ?>


<div class="slot">



<?php if($slot['user_id']){ ?>


<div class="profile">


<img src="../uploads/<?=$slot['profile_pic'] ?: 'default.png'?>">


<span>

<?=$slot['name']?>

</span>


</div>



<?php }else{ ?>


<form method="POST">


<input type="hidden" name="slot_id" value="<?=$slot['id']?>">


<button name="join_slot">

Select Slot

</button>


</form>


<?php } ?>


</div>



<?php } ?>


</div>


<?php } ?>



</div>


</div>


</body>

</html>