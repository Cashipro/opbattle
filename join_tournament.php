<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

session_start();

require_once 'config.php';



if(!isset($_SESSION['user_id'])){

    header("Location: login.php");
    exit;

}



$user_id = $_SESSION['user_id'];

$tournament_id = $_GET['tournament'] ?? 0;



if(!$tournament_id){

    die("Tournament not found.");

}



$message = "";

$error = "";



try{


/*
 GET TOURNAMENT
*/


$stmt = $pdo->prepare("

SELECT *

FROM tournaments

WHERE id=?

");


$stmt->execute([$tournament_id]);


$tournament = $stmt->fetch();



if(!$tournament){

    die("Tournament not found.");

}



/*
 CHECK LOCK
*/


if(isset($tournament['registration_status']) 
&& 
$tournament['registration_status']=='locked'){


    die("Tournament registration is closed.");

}





/*
 CHECK ALREADY JOINED
*/


$check = $pdo->prepare("

SELECT id

FROM transactions

WHERE user_id=?

AND tournament_id=?

AND transaction_type='entry_fee'

AND payment_status='approved'

");


$check->execute([

$user_id,
$tournament_id

]);



if($check->fetch()){


    header("Location: tournament_lobby.php?tournament=".$tournament_id);

    exit;


}





/*
 GET USER BALANCE
*/


$user = $pdo->prepare("

SELECT wallet_balance

FROM users

WHERE id=?

");


$user->execute([$user_id]);


$account = $user->fetch();



if(!$account){

    die("User not found.");

}




if(isset($_POST['join'])){


$fee = $tournament['entry_fee'];



if($account['wallet_balance'] < $fee){


$error = "Insufficient wallet balance.";


}

else{


$pdo->beginTransaction();


try{


/*
 DEDUCT WALLET
*/


$update = $pdo->prepare("

UPDATE users

SET wallet_balance = wallet_balance - ?

WHERE id=?

");


$update->execute([

$fee,
$user_id

]);




/*
 SAVE TRANSACTION
*/


$insert = $pdo->prepare("

INSERT INTO transactions

(
user_id,
tournament_id,
amount,
transaction_type,
payment_status,
transaction_note

)

VALUES

(?,?,?,?,?,?)

");



$insert->execute([

$user_id,
$tournament_id,
$fee,
'entry_fee',
'approved',
'Tournament entry fee'

]);




$pdo->commit();



header("Location: tournament_lobby.php?tournament=".$tournament_id);

exit;



}
catch(Exception $e){


$pdo->rollBack();

$error=$e->getMessage();


}



}


}




}
catch(PDOException $e){


$error=$e->getMessage();


}


?>



<!DOCTYPE html>

<html>

<head>

<title>
Join Tournament - OPBattle
</title>


<meta name="viewport" content="width=device-width,initial-scale=1">


<style>

body{

margin:0;

background:
radial-gradient(circle at top,#263800,#050505);

color:white;

font-family:Segoe UI,sans-serif;

}



.container{

max-width:600px;

margin:60px auto;

padding:20px;

}



.card{

background:#0f1319;

border:1px solid #333;

border-radius:20px;

padding:30px;

text-align:center;

}



h1{

color:#ccff00;

}



.info{

background:#161b22;

padding:15px;

border-radius:12px;

margin:15px 0;

}



button{

width:100%;

padding:15px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:bold;

cursor:pointer;

}



.error{

background:#450a0a;

padding:15px;

border-radius:10px;

color:#ff7777;

}


</style>


</head>



<body>


<div class="container">


<div class="card">


<h1>
🎮 Join Tournament
</h1>



<h2>

<?php echo htmlspecialchars($tournament['title']); ?>

</h2>



<div class="info">

Entry Fee:

<br>

<b>

PKR <?php echo number_format($tournament['entry_fee']); ?>

</b>

</div>



<div class="info">

Prize Pool:

<br>

<b>

PKR <?php echo number_format($tournament['prize_pool']); ?>

</b>

</div>




<div class="info">

Your Balance:

<br>

<b>

PKR <?php echo number_format($account['wallet_balance']); ?>

</b>

</div>




<?php if($error){ ?>

<div class="error">

<?php echo $error; ?>

</div>

<?php } ?>




<form method="post">


<button name="join">

JOIN NOW

</button>


</form>



</div>


</div>



</body>

</html>
