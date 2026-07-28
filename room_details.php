<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}



$user_id=$_SESSION['user_id'];



/*
 FIND PLAYER TEAM
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE 

player_1=?

OR player_2=?

OR player_3=?

OR player_4=?

LIMIT 1

");


$stmt->execute([

$user_id,

$user_id,

$user_id,

$user_id

]);


$team=$stmt->fetch();



?>



<!DOCTYPE html>

<html>

<head>

<title>

OPBattle Room Details

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

radial-gradient(circle at top,#263800,#050505);

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

border-radius:20px;

padding:25px;

margin-bottom:20px;

}



.title{

font-size:28px;

font-weight:900;

color:#ccff00;

}





.box{

background:#161b22;

padding:15px;

border-radius:12px;

margin-top:12px;

}



.label{

color:#9ca3af;

font-size:12px;

}



.value{

font-size:20px;

font-weight:bold;

margin-top:5px;

}



.status{

display:inline-block;

padding:8px 15px;

border-radius:20px;

background:#052e16;

color:#22c55e;

font-weight:bold;

font-size:12px;

}




.empty{

background:#0f1319;

padding:40px;

border-radius:20px;

text-align:center;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 Match Room Details

</h1>





<?php if(!$team): ?>



<div class="empty">

<h2>

No Team Found

</h2>


<p>

Join a tournament first.

</p>

</div>



<?php else: ?>





<?php



$stmt=$pdo->prepare("

SELECT

tr.*,

rt.slot_number


FROM room_teams rt


JOIN tournament_rooms tr

ON rt.room_id=tr.id



WHERE rt.team_id=?



ORDER BY tr.id DESC

LIMIT 1


");



$stmt->execute([

$team['id']

]);



$room=$stmt->fetch();



?>






<?php if(!$room): ?>



<div class="empty">


<h2>

Room Not Assigned Yet

</h2>


<p>

Admin will publish room details before match.

</p>


</div>




<?php else: ?>




<div class="card">


<div class="title">

<?php echo htmlspecialchars($room['room_name']); ?>

</div>



<div class="status">

<?php echo strtoupper($room['status']); ?>

</div>





<div class="box">


<div class="label">

ROOM ID

</div>


<div class="value">

<?php echo htmlspecialchars($room['room_id']); ?>

</div>


</div>





<div class="box">


<div class="label">

ROOM PASSWORD

</div>


<div class="value">

<?php echo htmlspecialchars($room['room_password']); ?>

</div>


</div>






<div class="box">


<div class="label">

MAP

</div>


<div class="value">

<?php echo htmlspecialchars($room['map_name']); ?>

</div>


</div>







<div class="box">


<div class="label">

MATCH TIME

</div>


<div class="value">

<?php echo date('d M Y - h:i A',strtotime($room['match_time'])); ?>

</div>


</div>






<div class="box">


<div class="label">

YOUR SLOT NUMBER

</div>


<div class="value">

#

<?php echo $room['slot_number']; ?>

</div>


</div>





</div>



<?php endif; ?>



<?php endif; ?>





</div>


</body>

</html>