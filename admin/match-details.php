<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



$match_id=$_GET['id'] ?? '';

if(!$match_id){

die("Match ID Missing");

}



// SAVE MATCH DETAILS

if(isset($_POST['save'])){


$stmt=$pdo->prepare("

UPDATE matches

SET

room_id=?,
room_password=?,
match_time=?,
map_name=?,
status='live'

WHERE id=?

");


$stmt->execute([

$_POST['room_id'],
$_POST['room_password'],
$_POST['match_time'],
$_POST['map_name'],
$match_id

]);


header("Location: match-details.php?id=".$match_id);

exit;


}




// MATCH DATA

$stmt=$pdo->prepare("

SELECT *

FROM matches

WHERE id=?

");


$stmt->execute([$match_id]);


$match=$stmt->fetch();



if(!$match){

die("Match Not Found");

}



?>

<!DOCTYPE html>

<html>

<head>

<title>Match Details - OpBattle</title>

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



.card{

background:#111;

border:1px solid #222;

padding:25px;

border-radius:20px;

max-width:700px;

}



input,select{

width:100%;

padding:14px;

margin:10px 0 20px;

background:#000;

border:1px solid #444;

border-radius:12px;

color:white;

}



button{

background:#00ff84;

color:black;

border:0;

padding:14px 25px;

border-radius:12px;

font-weight:bold;

}



@media(max-width:1000px){

.main{

margin-left:0;

padding-top:80px;

}


}


</style>

</head>


<body>


<?php include "admin-sidebar.php"; ?>


<div class="main">


<h1>

Match <?=$match['match_number']?> Details

</h1>



<div class="card">


<form method="POST">


<label>
Room ID
</label>


<input

type="text"

name="room_id"

value="<?=htmlspecialchars($match['room_id'] ?? '')?>"

placeholder="Enter Room ID">





<label>
Room Password
</label>


<input

type="text"

name="room_password"

value="<?=htmlspecialchars($match['room_password'] ?? '')?>"

placeholder="Enter Password">





<label>
Match Time
</label>


<input

type="datetime-local"

name="match_time"

value="<?=

$match['match_time']

?

date('Y-m-d\TH:i',strtotime($match['match_time']))

:''

?>"

>




<label>
Map
</label>


<select name="map_name">


<option <?=($match['map_name']=="Erangel")?'selected':''?>>

Erangel

</option>


<option <?=($match['map_name']=="Miramar")?'selected':''?>>

Miramar

</option>


<option <?=($match['map_name']=="Sanhok")?'selected':''?>>

Sanhok

</option>


<option <?=($match['map_name']=="Livik")?'selected':''?>>

Livik

</option>


</select>



<button name="save">

Save Match Details

</button>



</form>


</div>


</div>


</body>

</html>