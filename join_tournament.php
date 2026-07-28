<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

session_start();

require_once 'config.php';


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}



$user_id=$_SESSION['user_id'];

$tournament_id=$_GET['tournament'] ?? 0;


if(!$tournament_id){

die("Tournament not found");

}



// tournament details

$stmt=$pdo->prepare("

SELECT *

FROM tournaments

WHERE id=?

");

$stmt->execute([$tournament_id]);

$tournament=$stmt->fetch();



if(!$tournament){

die("Tournament not found");

}



// user balance

$user=$pdo->prepare("

SELECT wallet_balance

FROM users

WHERE id=?

");

$user->execute([$user_id]);

$account=$user->fetch();



if($account['wallet_balance'] < $tournament['entry_fee']){


die("Insufficient balance");


}




// check already paid

$check=$pdo->prepare("

SELECT id

FROM tournament_entries

WHERE tournament_id=?

AND user_id=?

");


$check->execute([

$tournament_id,
$user_id

]);



if($check->fetch()){


header("Location: tournament_lobby.php?tournament=".$tournament_id);

exit;


}





$pdo->beginTransaction();



try{


// deduct balance

$update=$pdo->prepare("

UPDATE users

SET wallet_balance = wallet_balance - ?

WHERE id=?

");


$update->execute([

$tournament['entry_fee'],
$user_id

]);





// save entry

$entry=$pdo->prepare("

INSERT INTO tournament_entries

(
tournament_id,
user_id,
amount,
status

)

VALUES

(?,?,?,'paid')

");


$entry->execute([

$tournament_id,
$user_id,
$tournament['entry_fee']

]);





// transaction history

$trans=$pdo->prepare("

INSERT INTO transactions

(
user_id,
amount,
transaction_type,
payment_status

)

VALUES

(?,?,?,?)

");


$trans->execute([

$user_id,
$tournament['entry_fee'],
'Tournament Entry',
'approved'

]);





$pdo->commit();



header("Location: tournament_lobby.php?tournament=".$tournament_id);

exit;



}

catch(Exception $e){


$pdo->rollBack();

echo $e->getMessage();


}

?>
