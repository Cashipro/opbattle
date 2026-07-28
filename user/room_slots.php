<?php

require_once '../config.php';
require_once '../includes/auth.php';

checkUserLogin();


$user_id = $_SESSION['user_id'];

$tournament_id = intval($_GET['tournament_id'] ?? 0);



/* USER */

$stmt=$pdo->prepare("
SELECT name,balance,pubg_uid
FROM users
WHERE id=?
");

$stmt->execute([$user_id]);

$user=$stmt->fetch();



/* TOURNAMENT */

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



$totalTeams=$tournament['maximum_teams'];



/* CREATE EMPTY TEAMS AUTOMATIC */

for($i=1;$i<=$totalTeams;$i++){


$check=$pdo->prepare("
SELECT id 
FROM teams
WHERE tournament_id=? 
AND slot_number=?
");


$check->execute([
$tournament_id,
$i
]);


if(!$check->fetch()){


$insert=$pdo->prepare("
INSERT INTO teams
(
tournament_id,
team_name,
slot_number
)
VALUES(?,?,?)
");


$insert->execute([

$tournament_id,
"Team ".$i,
$i

]);


}


}





/* ALL TEAMS */


$stmt=$pdo->prepare("
SELECT *
FROM teams
WHERE tournament_id=?
ORDER BY slot_number ASC
");


$stmt->execute([$tournament_id]);

$teams=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle | Team Slots
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
radial-gradient(circle at top,#263800,#050505 55%);

color:white;

}




.header{


background:#0b0f19;

padding:25px 40px;

border-bottom:1px solid #1f2937;

display:flex;

justify-content:space-between;

align-items:center;


}




.logo{

font-size:28px;
font-weight:1000;

}


.logo span{

background:#ccff00;

color:black;

padding:5px 10px;

border-radius:8px;

}




.wallet{

color:#ccff00;

font-weight:bold;

}



.container{

max-width:1300px;

margin:40px auto;

padding:0 20px;

}




.title{

background:#0f1319;

border:1px solid #1f2937;

padding:25px;

border-radius:18px;

margin-bottom:30px;

}



.title h1{

margin:0;

font-size:32px;

}



.title p{

color:#9ca3af;

}





.grid{


display:grid;

grid-template-columns:
repeat(auto-fit,minmax(300px,1fr));

gap:20px;


}




.team{


background:#0f1319;

border:1px solid #1f2937;

border-radius:18px;

padding:20px;

}



.team:hover{

border-color:#ccff00;

}





.team-head{

display:flex;

justify-content:space-between;

margin-bottom:15px;

font-weight:900;

}



.team-head span{

color:#ccff00;

}





.players{


display:grid;

grid-template-columns:repeat(4,1fr);

gap:10px;

}



.slot{


height:80px;

border-radius:12px;

background:#161b22;

border:1px dashed #374151;

display:flex;

align-items:center;

justify-content:center;

flex-direction:column;

text-decoration:none;

color:#9ca3af;

font-size:12px;

text-align:center;


}



.slot:hover{

border-color:#ccff00;

color:#ccff00;

}





.full{

background:
rgba(204,255,0,.1);

border:1px solid #ccff00;

color:#ccff00;

}



.uid{

font-size:10px;

color:#fff;

margin-top:4px;

}



@media(max-width:600px){


.players{

grid-template-columns:repeat(2,1fr);

}


.header{

padding:20px;

}


}




</style>

</head>



<body>



<div class="header">


<div class="logo">

<span>OP</span>BATTLE

</div>


<div class="wallet">

💰 PKR <?php echo number_format($user['balance'],2); ?>

</div>


</div>






<div class="container">


<div class="title">

<h1>

<?php echo htmlspecialchars($tournament['title']); ?>

</h1>


<p>

Select your squad position

|

<?php echo $totalTeams; ?> Teams

</p>


</div>





<div class="grid">



<?php foreach($teams as $team): ?>



<div class="team">


<div class="team-head">


Team #<?php echo $team['slot_number']; ?>


<span>

SQUAD

</span>


</div>





<div class="players">


<?php


$players=[
'player_1',
'player_2',
'player_3',
'player_4'
];



foreach($players as $index=>$p):



if(!empty($team[$p])){


$get=$pdo->prepare("
SELECT name,pubg_uid
FROM users
WHERE id=?
");

$get->execute([$team[$p]]);

$player=$get->fetch();



?>


<div class="slot full">

🎮

<br>

<?php echo htmlspecialchars($player['name']); ?>


<div class="uid">

UID:
<?php echo $player['pubg_uid']; ?>

</div>


</div>



<?php

}else{

?>


<a class="slot"
href="join_team.php?team=<?php echo $team['slot_number']; ?>&pos=<?php echo $p; ?>&tournament_id=<?php echo $tournament_id; ?>">


➕

<br>

Player <?php echo $index+1; ?>


</a>



<?php } endforeach; ?>



</div>


</div>



<?php endforeach; ?>



</div>


</div>



</body>

</html>