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
 CREATE ROOM
*/


if(isset($_POST['create_room'])){


$room_name=trim($_POST['room_name']);

$room_id=trim($_POST['room_id']);

$password=trim($_POST['room_password']);

$map=$_POST['map_name'];

$time=$_POST['match_time'];





$stmt=$pdo->prepare("

INSERT INTO tournament_rooms

(

tournament_id,

room_name,

room_id,

room_password,

map_name,

match_time

)

VALUES(?,?,?,?,?,?)

");



$stmt->execute([

$tournament_id,

$room_name,

$room_id,

$password,

$map,

$time

]);



$message="Room created successfully";



}






/*
 UPDATE STATUS
*/


if(isset($_POST['status_update'])){


$id=intval($_POST['room_id']);

$status=$_POST['status'];



$stmt=$pdo->prepare("

UPDATE tournament_rooms

SET status=?

WHERE id=?

");


$stmt->execute([

$status,

$id

]);


$message="Room status updated";



}





/*
 GET ROOMS
*/


$stmt=$pdo->prepare("

SELECT *

FROM tournament_rooms

WHERE tournament_id=?

ORDER BY id DESC

");


$stmt->execute([$tournament_id]);


$rooms=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>

OPBattle Room Manager

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

padding:14px;

background:#ccff00;

color:black;

border:0;

border-radius:10px;

font-weight:900;

cursor:pointer;

width:100%;

}



.room{

background:#161b22;

padding:18px;

border-radius:12px;

margin-top:15px;

}



.status{

display:inline-block;

padding:6px 12px;

border-radius:20px;

background:#052e16;

color:#22c55e;

font-size:12px;

}



.alert{

background:#052e16;

color:#22c55e;

padding:15px;

border-radius:10px;

margin-bottom:15px;

}


</style>


</head>



<body>



<div class="container">



<h1>

🎮 PUBG Room Manager

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>





<div class="card">


<form method="post">



<input

type="text"

name="room_name"

placeholder="Room Name (Match 1)"

required

>



<input

type="text"

name="room_id"

placeholder="PUBG Room ID"

required

>



<input

type="text"

name="room_password"

placeholder="Room Password"

required

>




<select name="map_name">


<option>Erangel</option>

<option>Miramar</option>

<option>Livik</option>

<option>Sanhok</option>


</select>





<input

type="datetime-local"

name="match_time"

required

>




<button name="create_room">

CREATE ROOM

</button>



</form>


</div>







<div class="card">


<h2>

Created Rooms

</h2>




<?php foreach($rooms as $room): ?>


<div class="room">


<strong>

<?php echo htmlspecialchars($room['room_name']); ?>

</strong>


<br><br>


Room ID:

<?php echo htmlspecialchars($room['room_id']); ?>


<br>


Password:

<?php echo htmlspecialchars($room['room_password']); ?>


<br>


Map:

<?php echo $room['map_name']; ?>


<br>


Time:

<?php echo $room['match_time']; ?>


<br><br>



<span class="status">

<?php echo strtoupper($room['status']); ?>

</span>




<form method="post" style="margin-top:15px;">


<input type="hidden" name="room_id" value="<?php echo $room['id']; ?>">



<select name="status">


<option value="waiting">

WAITING

</option>


<option value="live">

LIVE

</option>


<option value="completed">

COMPLETED

</option>


</select>



<button name="status_update">

UPDATE STATUS

</button>



</form>



</div>



<?php endforeach; ?>



</div>



</div>


</body>

</html>