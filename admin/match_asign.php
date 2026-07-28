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
 ASSIGN TEAM
*/


if(isset($_POST['assign_team'])){


$team_id=intval($_POST['team_id']);

$slot=intval($_POST['slot_number']);





// check duplicate team

$stmt=$pdo->prepare("

SELECT id

FROM room_teams

WHERE room_id=?

AND team_id=?

");


$stmt->execute([

$room_id,

$team_id

]);




if($stmt->fetch()){


$message="Team already assigned";


}

else{



$stmt=$pdo->prepare("

INSERT INTO room_teams

(

room_id,

team_id,

slot_number

)

VALUES(?,?,?)

");



$stmt->execute([

$room_id,

$team_id,

$slot

]);



$message="Team assigned successfully";


}



}






/*
 REMOVE TEAM
*/


if(isset($_GET['remove'])){


$id=intval($_GET['remove']);



$stmt=$pdo->prepare("

DELETE FROM room_teams

WHERE id=?

");


$stmt->execute([$id]);


$message="Team removed";



}






/*
 GET ROOM
*/


$stmt=$pdo->prepare("

SELECT *

FROM tournament_rooms

WHERE id=?

");


$stmt->execute([$room_id]);


$room=$stmt->fetch();





if(!$room){

die("Room not found");

}






/*
 AVAILABLE TEAMS
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE tournament_id=?

AND team_status='locked'

");


$stmt->execute([

$room['tournament_id']

]);


$teams=$stmt->fetchAll();







/*
 ASSIGNED TEAMS
*/


$stmt=$pdo->prepare("

SELECT

rt.*,

t.team_name


FROM room_teams rt


JOIN teams t

ON rt.team_id=t.id



WHERE rt.room_id=?


ORDER BY rt.slot_number ASC

");


$stmt->execute([$room_id]);


$assigned=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>

OPBattle Match Assignment

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

max-width:1000px;

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

margin-bottom:20px;

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

padding:14px;

background:#ccff00;

color:black;

border:0;

border-radius:10px;

font-weight:900;

}



.alert{

background:#052e16;

padding:15px;

border-radius:10px;

color:#22c55e;

}



.team{

background:#161b22;

padding:15px;

border-radius:12px;

margin-top:10px;

}



.remove{

color:#ef4444;

float:right;

text-decoration:none;

}



</style>


</head>


<body>



<div class="container">



<h1>

🎮 Match Team Assignment

</h1>



<div class="card">


<h3>

Room:

<?php echo htmlspecialchars($room['room_name']); ?>

</h3>


Room ID:

<?php echo $room['room_id']; ?>


</div>





<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>







<div class="card">


<form method="post">


<select name="team_id">


<?php foreach($teams as $team): ?>


<option value="<?php echo $team['id']; ?>">

<?php echo htmlspecialchars($team['team_name']); ?>

</option>


<?php endforeach; ?>


</select>





<input

type="number"

name="slot_number"

placeholder="Slot Number"

required

>




<button name="assign_team">

ASSIGN TEAM

</button>



</form>


</div>








<div class="card">


<h2>

Assigned Teams

</h2>



<?php foreach($assigned as $a): ?>


<div class="team">


<a class="remove"

href="?room=<?php echo $room_id; ?>&remove=<?php echo $a['id']; ?>">

REMOVE

</a>


Slot #<?php echo $a['slot_number']; ?>

<br>


<strong>

<?php echo htmlspecialchars($a['team_name']); ?>

</strong>



</div>



<?php endforeach; ?>



</div>





</div>


</body>

</html>