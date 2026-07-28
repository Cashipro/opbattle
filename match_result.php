<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$message="";


$room_id=intval($_GET['room'] ?? 0);



if(!$room_id){

die("Room ID Missing");

}





/*
 SAVE RESULT
*/


if(isset($_POST['save_result'])){


$team_id=intval($_POST['team_id']);

$position=intval($_POST['position']);

$kills=intval($_POST['kills']);





/*

Placement Points System

1 = 15
2 = 12
3 = 10
4 = 8
5 = 6
6-10 = 4
11+ = 0

*/



if($position==1){

$placement=15;

}

elseif($position==2){

$placement=12;

}

elseif($position==3){

$placement=10;

}

elseif($position==4){

$placement=8;

}

elseif($position==5){

$placement=6;

}

elseif($position>=6 && $position<=10){

$placement=4;

}

else{

$placement=0;

}



$kill_point=2;


$kill_score=$kills*$kill_point;


$total=$kill_score+$placement;





$stmt=$pdo->prepare("

INSERT INTO match_results

(

room_id,

team_id,

position,

kills,

kill_points,

placement_points,

total_points

)

VALUES(?,?,?,?,?,?,?)

");



$stmt->execute([

$room_id,

$team_id,

$position,

$kills,

$kill_point,

$placement,

$total

]);




$message="Match result saved successfully";


}







/*
 GET TEAMS IN ROOM
*/


$stmt=$pdo->prepare("

SELECT

rt.team_id,

t.team_name


FROM room_teams rt


JOIN teams t

ON rt.team_id=t.id


WHERE rt.room_id=?



");


$stmt->execute([$room_id]);


$teams=$stmt->fetchAll();




?>



<!DOCTYPE html>

<html>

<head>

<title>

OPBattle Match Result

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

border:0;

border-radius:12px;

font-weight:900;

color:black;

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

🏆 Enter Match Result

</h1>




<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>





<div class="card">


<form method="post">



<label>

Select Team

</label>



<select name="team_id">



<?php foreach($teams as $team): ?>

<option value="<?php echo $team['team_id']; ?>">


<?php echo htmlspecialchars($team['team_name']); ?>


</option>


<?php endforeach; ?>



</select>





<label>

Position

</label>


<input

type="number"

name="position"

placeholder="Example: 1"

required

>





<label>

Kills

</label>


<input

type="number"

name="kills"

value="0"

required

>




<button name="save_result">

SAVE RESULT

</button>



</form>



</div>



</div>


</body>

</html>