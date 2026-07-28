<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

session_start();

require_once 'config.php';



if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}



$tournament_id = $_GET['tournament'] ?? 0;


if(!$tournament_id){

die("Tournament not found");

}



$user_id=$_SESSION['user_id'];




// JOIN SLOT


if(isset($_POST['join'])){


$team_id=$_POST['team_id'];

$slot=$_POST['slot'];



// check already joined

$check=$pdo->prepare("

SELECT id

FROM tournament_team_players

WHERE tournament_id=?

AND user_id=?

");


$check->execute([

$tournament_id,
$user_id

]);



if($check->fetch()){


$message="You already joined a team.";


}

else{


$insert=$pdo->prepare("

INSERT INTO tournament_team_players

(
tournament_id,
team_id,
user_id,
slot_number
)

VALUES

(?,?,?,?)

");


$insert->execute([

$tournament_id,
$team_id,
$user_id,
$slot

]);



$message="Joined successfully";


}



}





// GET TEAMS


$stmt=$pdo->prepare("

SELECT *

FROM tournament_teams

WHERE tournament_id=?

ORDER BY team_number ASC

");


$stmt->execute([$tournament_id]);


$teams=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>


<title>
OPBattle Lobby
</title>


<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:
radial-gradient(circle at top,#263800,#050505);

color:white;

font-family:Segoe UI;

}



.container{

max-width:1200px;

margin:auto;

padding:20px;

}



h1{

color:#ccff00;

}



.grid{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(260px,1fr));

gap:20px;

}



.team{

background:#0f1319;

border:1px solid #333;

border-radius:20px;

padding:20px;

}



.team h2{

color:#ccff00;

}



.slot{

background:#161b22;

padding:12px;

margin:8px 0;

border-radius:10px;

}



.empty{

color:#22c55e;

cursor:pointer;

}



button{

width:100%;

padding:10px;

background:#ccff00;

border:0;

border-radius:10px;

font-weight:bold;

}



.alert{

background:#052e16;

padding:15px;

border-radius:10px;

margin-bottom:20px;

}



</style>


</head>


<body>


<div class="container">



<h1>
🎮 OPBattle Tournament Lobby
</h1>



<?php if(isset($message)){ ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php } ?>



<div class="grid">


<?php foreach($teams as $team){ ?>


<div class="team">


<h2>

TEAM <?php echo $team['team_number']; ?>

</h2>



<?php


$p=$pdo->prepare("

SELECT 

tp.slot_number,
u.name

FROM tournament_team_players tp

LEFT JOIN users u

ON tp.user_id=u.id

WHERE tp.team_id=?

ORDER BY tp.slot_number

");


$p->execute([$team['id']]);


$players=$p->fetchAll();



for($i=1;$i<=4;$i++){


$found=false;


foreach($players as $pl){


if($pl['slot_number']==$i){

$found=true;


echo "

<div class='slot'>

🟢 ".$pl['name']."

</div>

";


}


}



if(!$found){


?>

<form method="post">

<div class="slot empty">

<input type="hidden" name="team_id" value="<?php echo $team['id']; ?>">

<input type="hidden" name="slot" value="<?php echo $i; ?>">


<button name="join">

+ JOIN SLOT <?php echo $i; ?>

</button>


</div>

</form>


<?php


}



}



?>



</div>



<?php } ?>



</div>



</div>



</body>

</html>
