<?php

require_once '../config.php';
require_once '../includes/auth.php';

checkUserLogin();


$user_id = $_SESSION['user_id'];



$team_number = intval($_GET['team'] ?? 0);

$position = $_GET['pos'] ?? '';

$tournament_id = intval($_GET['tournament_id'] ?? 0);



$allowed = [
    'player_1',
    'player_2',
    'player_3',
    'player_4'
];



if(
    $team_number <= 0 ||
    !in_array($position,$allowed) ||
    $tournament_id <=0
){

die("Invalid Request");

}




try{


/* USER DATA */


$stmt=$pdo->prepare("
SELECT *
FROM users
WHERE id=?
");


$stmt->execute([$user_id]);

$user=$stmt->fetch();



if(!$user){

die("User not found");

}




/* TOURNAMENT */


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





/* CHECK ALREADY JOINED */


$stmt=$pdo->prepare("
SELECT id
FROM teams
WHERE tournament_id=?
AND 
(
player_1=?
OR player_2=?
OR player_3=?
OR player_4=?
)

");


$stmt->execute([

$tournament_id,
$user_id,
$user_id,
$user_id,
$user_id

]);



if($stmt->fetch()){


die("
<script>
alert('You already joined this tournament');
window.location='room_slots.php?tournament_id=$tournament_id';
</script>
");


}





/* CHECK BALANCE */


if($user['balance'] < $tournament['entry_fee']){


die("
<script>
alert('Insufficient Balance');
window.location='deposit.php';
</script>
");


}





/* CHECK SLOT */


$stmt=$pdo->prepare("
SELECT *
FROM teams
WHERE tournament_id=?
AND slot_number=?
");


$stmt->execute([

$tournament_id,
$team_number

]);


$team=$stmt->fetch();



if(!$team){


die("Team not found");


}



if(!empty($team[$position])){


die("
<script>
alert('Slot already occupied');
window.location='room_slots.php?tournament_id=$tournament_id';
</script>
");


}





/* START TRANSACTION */


$pdo->beginTransaction();




/* REMOVE OLD EMPTY DATA */


$new_balance =
$user['balance'] - $tournament['entry_fee'];



/* UPDATE BALANCE */


$stmt=$pdo->prepare("
UPDATE users

SET

balance=?,
total_spent=total_spent+?

WHERE id=?

");


$stmt->execute([

$new_balance,
$tournament['entry_fee'],
$user_id

]);






/* TRANSACTION HISTORY */


$stmt=$pdo->prepare("
INSERT INTO transactions
(
user_id,
amount,
type,
status,
transaction_id
)

VALUES
(
?,
?,
?,
?,
?
)

");


$stmt->execute([

$user_id,

$tournament['entry_fee'],

"tournament_entry",

"approved",

"OPBATTLE-".$tournament_id."-".$user_id

]);







/* JOIN TEAM */


$stmt=$pdo->prepare("
UPDATE teams

SET

$position=?

WHERE tournament_id=?

AND slot_number=?

");


$stmt->execute([

$user_id,

$tournament_id,

$team_number

]);





$pdo->commit();





echo "

<script>

alert('Successfully Joined Team $team_number');

window.location='room_slots.php?tournament_id=$tournament_id';

</script>

";



}

catch(Exception $e){


if($pdo->inTransaction()){

$pdo->rollBack();

}


die(
"Error: ".$e->getMessage()
);


}



?>