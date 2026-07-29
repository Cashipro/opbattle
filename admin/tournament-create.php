<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}


$msg="";



if(isset($_POST['create'])){


$name=$_POST['name'];

$entry_fee=$_POST['entry_fee'];

$prize_pool=$_POST['prize_pool'];





$pdo->beginTransaction();


try{


// CREATE TOURNAMENT


$stmt=$pdo->prepare("

INSERT INTO tournaments

(
name,
entry_fee,
prize_pool,
status
)

VALUES(?,?,?,'upcoming')

");



$stmt->execute([

$name,

$entry_fee,

$prize_pool

]);



$tournament_id=$pdo->lastInsertId();




// CREATE 100 TEAMS × 4 SLOTS



$slot=$pdo->prepare("

INSERT INTO tournament_slots

(
tournament_id,
team_number,
slot_number
)

VALUES(?,?,?)

");



for($team=1;$team<=100;$team++){


for($number=1;$number<=4;$number++){


$slot->execute([

$tournament_id,

$team,

$number

]);


}


}



$pdo->commit();


$msg="Tournament Created Successfully";



}catch(Exception $e){


$pdo->rollBack();

$msg=$e->getMessage();


}



}



?>



<!DOCTYPE html>

<html>

<head>

<title>Create Tournament - OpBattle</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.main{

margin-left:280px;

padding:35px;

}



.box{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:30px;

max-width:600px;

}



input{

width:100%;

padding:15px;

margin:10px 0;

background:#000;

border:1px solid #333;

border-radius:12px;

color:white;

}



button{

padding:15px 25px;

background:#00ff84;

border:0;

border-radius:12px;

font-weight:bold;

}



.msg{

background:#063;

padding:12px;

border-radius:10px;

margin-bottom:15px;

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

Create Tournament

</h1>



<div class="box">


<?php if($msg){ ?>

<div class="msg">

<?=$msg?>

</div>

<?php } ?>



<form method="POST">


<input

type="text"

name="name"

placeholder="Tournament Name"

required>



<input

type="number"

name="entry_fee"

placeholder="Entry Fee"

required>



<input

type="number"

name="prize_pool"

placeholder="Prize Pool"

required>



<button name="create">

Create Tournament

</button>



</form>



</div>


</div>


</body>

</html>