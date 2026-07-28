<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: login.php");
exit;

}



$message="";



$tournament_id=intval($_GET['id'] ?? 0);



if(!$tournament_id){

die("Tournament ID Missing");

}




/*
 SAVE PRIZE DISTRIBUTION
*/


if(isset($_POST['distribute'])){


try{


$pdo->beginTransaction();



$winner_team=intval($_POST['winner']);

$second_team=intval($_POST['second']);

$third_team=intval($_POST['third']);



$prize_pool=floatval($_POST['prize_pool']);



$first_percent=floatval($_POST['first_percent']);

$second_percent=floatval($_POST['second_percent']);

$third_percent=floatval($_POST['third_percent']);





$first_prize=
$prize_pool*$first_percent/100;


$second_prize=
$prize_pool*$second_percent/100;


$third_prize=
$prize_pool*$third_percent/100;






$positions=[


[
$winner_team,
1,
$first_prize
],


[
$second_team,
2,
$second_prize
],


[
$third_team,
3,
$third_prize
]


];





foreach($positions as $p){



$team_id=$p[0];

$position=$p[1];

$amount=$p[2];





/*
 SAVE PRIZE HISTORY
*/


$stmt=$pdo->prepare("

INSERT INTO prizes

(

tournament_id,

team_id,

position,

amount

)

VALUES(?,?,?,?)

");


$stmt->execute([

$tournament_id,

$team_id,

$position,

$amount

]);





/*
 GET TEAM PLAYERS
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE id=?

");


$stmt->execute([$team_id]);


$team=$stmt->fetch();




$players=[

$team['player_1'],

$team['player_2'],

$team['player_3'],

$team['player_4']

];




$player_prize=$amount/count(array_filter($players));





foreach(array_filter($players) as $player){



$pdo->prepare("

UPDATE users

SET balance = balance + ?

WHERE id=?

")->execute([

$player_prize,

$player

]);



}





}



$pdo->prepare("

UPDATE tournaments

SET status='completed'

WHERE id=?

")->execute([

$tournament_id

]);




$pdo->commit();


$message="Prize distributed successfully";



}

catch(Exception $e){


if($pdo->inTransaction()){

$pdo->rollBack();

}


$message=$e->getMessage();


}



}







/*
 GET TEAMS
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE tournament_id=?

");


$stmt->execute([$tournament_id]);


$teams=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Prize Distribution
</title>


<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


*{

box-sizing:border-box;

font-family:Segoe UI,sans-serif;

}



body{

margin:0;

background:#050505;

color:white;

}



.container{

max-width:800px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:18px;

padding:25px;

}



input,select{

width:100%;

padding:14px;

margin-bottom:15px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

}



button{

width:100%;

padding:15px;

background:#ccff00;

color:black;

border:0;

border-radius:10px;

font-weight:900;

}



.alert{

background:#052e16;

color:#22c55e;

padding:15px;

border-radius:10px;

margin-bottom:20px;

}



</style>

</head>


<body>



<div class="container">


<h1>

🏆 Prize Distribution

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>




<div class="card">


<form method="post">


<label>

Prize Pool

</label>


<input

type="number"

name="prize_pool"

placeholder="Enter Prize Pool"

required

>




<label>

Winner Team

</label>


<select name="winner">


<?php foreach($teams as $t): ?>

<option value="<?php echo $t['id']; ?>">

<?php echo htmlspecialchars($t['team_name']); ?>

</option>

<?php endforeach; ?>


</select>





<label>

Second Position

</label>


<select name="second">


<?php foreach($teams as $t): ?>

<option value="<?php echo $t['id']; ?>">

<?php echo htmlspecialchars($t['team_name']); ?>

</option>

<?php endforeach; ?>


</select>





<label>

Third Position

</label>


<select name="third">


<?php foreach($teams as $t): ?>

<option value="<?php echo $t['id']; ?>">

<?php echo htmlspecialchars($t['team_name']); ?>

</option>

<?php endforeach; ?>


</select>






<label>

1st Prize %

</label>


<input

name="first_percent"

value="50"

>



<label>

2nd Prize %

</label>


<input

name="second_percent"

value="30"

>



<label>

3rd Prize %

</label>


<input

name="third_percent"

value="20"

>




<button name="distribute">

DISTRIBUTE PRIZE

</button>



</form>


</div>


</div>


</body>

</html>