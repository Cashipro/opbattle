<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];

$message="";


$tournament_id=intval($_GET['id'] ?? 0);



if(!$tournament_id){

die("Tournament Missing");

}




/*
 GET TOURNAMENT
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
 CREATE PAYMENT REQUEST
*/


if(isset($_POST['pay'])){


// check existing


$stmt=$pdo->prepare("

SELECT id

FROM transactions

WHERE user_id=?

AND tournament_id=?

AND transaction_type='entry_fee'

AND payment_status='pending'

");


$stmt->execute([

$user_id,

$tournament_id

]);




if($stmt->fetch()){



$message="Payment request already submitted";


}

else{



$stmt=$pdo->prepare("

INSERT INTO transactions

(

user_id,

tournament_id,

amount,

transaction_type,

payment_status

)

VALUES(?,?,?,?,?)

");


$stmt->execute([

$user_id,

$tournament_id,

$tournament['entry_fee'],

'entry_fee',

'pending'

]);



$message="Payment request submitted. Waiting for approval.";



}



}



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Tournament Payment
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

max-width:600px;

margin:50px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:22px;

padding:30px;

}



.info{

background:#161b22;

padding:20px;

border-radius:15px;

margin-bottom:20px;

}



.amount{

font-size:35px;

font-weight:900;

color:#22c55e;

}



button{

width:100%;

padding:15px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:900;

cursor:pointer;

}



.alert{

background:#052e16;

padding:15px;

border-radius:12px;

color:#22c55e;

margin-bottom:20px;

}


</style>


</head>


<body>



<div class="container">


<h1>

💳 Tournament Payment

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>




<div class="card">



<div class="info">


<h2>

<?php echo htmlspecialchars($tournament['title']); ?>

</h2>


Entry Fee:

<div class="amount">

<?php echo $tournament['entry_fee']; ?>

</div>



Prize Pool:

<?php echo $tournament['prize_pool']; ?>


</div>




<form method="post">


<button name="pay">

SUBMIT PAYMENT REQUEST

</button>


</form>



</div>


</div>


</body>

</html>