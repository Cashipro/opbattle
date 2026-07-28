<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$message="";


$tournament_id=intval($_GET['id'] ?? 0);



if(!$tournament_id){

die("Tournament ID Missing");

}




/*
 REMOVE PLAYER FROM TEAM
*/


if(isset($_GET['remove'])){


$team_id=intval($_GET['team']);

$position=$_GET['remove'];



$allowed=[

'player_1',

'player_2',

'player_3',

'player_4'

];



if(in_array($position,$allowed)){


$stmt=$pdo->prepare("

UPDATE teams

SET $position=NULL

WHERE id=?

");


$stmt->execute([$team_id]);



$message="Player removed from team";

}


}





/*
 LOCK ALL TEAMS
*/


if(isset($_POST['lock_teams'])){


$stmt=$pdo->prepare("

UPDATE teams

SET team_status='locked'

WHERE tournament_id=?

");


$stmt->execute([$tournament_id]);



$message="All teams locked successfully";

}




/*
 GET TEAMS
*/


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

OPBattle Team Management

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

max-width:1200px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.alert{

background:#052e16;

border:1px solid #22c55e;

color:#22c55e;

padding:15px;

border-radius:10px;

margin-bottom:20px;

}





.grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(320px,1fr));

gap:20px;

}





.team-card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:18px;

padding:20px;

}



.team-title{

font-size:22px;

font-weight:900;

color:#ccff00;

margin-bottom:15px;

}



.status{

display:inline-block;

padding:7px 12px;

background:#161b22;

border-radius:20px;

font-size:12px;

margin-bottom:15px;

}



.player{

background:#161b22;

border-radius:10px;

padding:12px;

margin-bottom:10px;

}



.player strong{

display:block;

}



.uid{

font-size:12px;

color:#60a5fa;

}



.remove{

color:#ef4444;

text-decoration:none;

font-size:12px;

float:right;

}





.lock-btn{

margin-top:30px;

background:#ccff00;

color:black;

border:0;

padding:15px 30px;

border-radius:12px;

font-weight:900;

cursor:pointer;

}





</style>


</head>



<body>



<div class="container">



<h1>

🎮 OPBattle Team Management

</h1>



<?php if($message): ?>


<div class="alert">

<?php echo $message; ?>

</div>


<?php endif; ?>





<form method="post">

<button class="lock-btn" name="lock_teams">

🔒 LOCK ALL TEAMS

</button>

</form>





<br>





<div class="grid">



<?php foreach($teams as $team): ?>


<div class="team-card">



<div class="team-title">

<?php echo htmlspecialchars($team['team_name']); ?>

</div>



<div class="status">

<?php echo strtoupper($team['team_status'] ?? 'OPEN'); ?>

</div>





<?php


$players=[

'player_1',

'player_2',

'player_3',

'player_4'

];



foreach($players as $index=>$pos):



$pid=$team[$pos];


?>



<div class="player">


<?php if($pid): ?>


<a class="remove"

href="?id=<?php echo $tournament_id; ?>&team=<?php echo $team['id']; ?>&remove=<?php echo $pos; ?>"

onclick="return confirm('Remove this player?')">

REMOVE

</a>



<?php


$stmt=$pdo->prepare("

SELECT name,pubg_uid

FROM users

WHERE id=?

");


$stmt->execute([$pid]);


$p=$stmt->fetch();


?>


<strong>

Player <?php echo $index+1; ?>:

<?php echo htmlspecialchars($p['name'] ?? 'Unknown'); ?>

</strong>



<div class="uid">

PUBG UID:

<?php echo htmlspecialchars($p['pubg_uid'] ?? 'N/A'); ?>

</div>



<?php else: ?>


<strong>

Player <?php echo $index+1; ?>

</strong>


<div class="uid">

Empty Slot

</div>



<?php endif; ?>



</div>



<?php endforeach; ?>




</div>



<?php endforeach; ?>


</div>



</div>



</body>

</html>