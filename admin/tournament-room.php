<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



$tournament_id=$_GET['id'] ?? '';

if(!$tournament_id){

die("Tournament ID Missing");

}



// GET TEAMS

$stmt=$pdo->prepare("

SELECT

team_number,
team_name,
slot_number,
user_id

FROM tournament_slots

WHERE tournament_id=?

ORDER BY team_number,slot_number

");


$stmt->execute([$tournament_id]);


$slots=$stmt->fetchAll();




// GROUP TEAMS

$teams=[];


foreach($slots as $slot){

$teams[$slot['team_number']][]=$slot;

}


?>

<!DOCTYPE html>

<html>

<head>

<title>Tournament Room - OpBattle</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.main{

margin-left:270px;

padding:35px;

}



.grid{

display:grid;

grid-template-columns:repeat(3,1fr);

gap:20px;

}



.team{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:20px;

}



.team h3{

color:#00ff84;

margin-top:0;

}



.name{

background:#000;

border:1px solid #333;

padding:10px;

border-radius:10px;

margin-bottom:15px;

}



.slot{

display:flex;

align-items:center;

gap:12px;

background:#050505;

padding:10px;

border-radius:12px;

margin-bottom:8px;

}



.pic{

width:35px;

height:35px;

border-radius:50%;

background:#222;

display:flex;

align-items:center;

justify-content:center;

}



.empty{

color:#777;

}



@media(max-width:1000px){

.main{

margin-left:0;

padding-top:80px;

}


.grid{

grid-template-columns:1fr;

}


}



</style>

</head>


<body>


<?php include "admin-sidebar.php"; ?>


<div class="main">


<h1>

Tournament Room

</h1>


<div class="grid">


<?php foreach($teams as $number=>$team){ ?>


<div class="team">


<h3>

Team <?=$number?>

</h3>



<div class="name">

<?=

$team[0]['team_name']

?

htmlspecialchars($team[0]['team_name'])

:

'No Name'

?>

</div>



<?php foreach($team as $player){ ?>



<div class="slot">


<div class="pic">

👤

</div>



<?php if($player['user_id']){ ?>


Player ID:
<?=$player['user_id']?>


<?php }else{ ?>


<span class="empty">

Empty Slot

</span>


<?php } ?>


</div>



<?php } ?>



</div>


<?php } ?>



</div>


</div>


</body>

</html>