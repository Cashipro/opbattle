<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}



$user_id=$_SESSION['user_id'];



/*
 GET PLAYER TEAM
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE captain_id=?

ORDER BY id DESC

LIMIT 1

");


$stmt->execute([$user_id]);


$team=$stmt->fetch();



?>



<!DOCTYPE html>

<html>

<head>

<title>
My PUBG Team
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



.team-name{

font-size:30px;

font-weight:900;

color:#ccff00;

}




.badge{

display:inline-block;

padding:8px 15px;

border-radius:20px;

font-size:12px;

font-weight:bold;

margin-top:15px;

}



.pending{

background:#78350f;

color:#fbbf24;

}



.approved{

background:#052e16;

color:#22c55e;

}



.rejected{

background:#450a0a;

color:#ef4444;

}



.locked{

background:#1e3a8a;

color:#60a5fa;

}



.open{

background:#374151;

color:white;

}




.player{

background:#161b22;

padding:15px;

border-radius:12px;

margin-top:12px;

}



.player strong{

display:block;

}



.uid{

color:#60a5fa;

font-size:13px;

margin-top:5px;

}




.no-team{

text-align:center;

padding:40px;

background:#0f1319;

border-radius:20px;

}



.create-btn{

display:inline-block;

margin-top:20px;

padding:14px 25px;

background:#ccff00;

color:black;

border-radius:12px;

text-decoration:none;

font-weight:900;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 My Team

</h1>



<?php if(!$team): ?>



<div class="no-team">


<h2>

No Team Found

</h2>


<p>

Create your PUBG tournament team first.

</p>


<a class="create-btn" href="team_create.php">

CREATE TEAM

</a>


</div>



<?php else: ?>





<div class="card">



<div class="team-name">

<?php echo htmlspecialchars($team['team_name']); ?>

</div>




<div class="badge <?php echo $team['verification_status']; ?>">

Verification:

<?php echo strtoupper($team['verification_status']); ?>

</div>



<br>



<div class="badge <?php echo $team['team_status']; ?>">

Team:

<?php echo strtoupper($team['team_status']); ?>

</div>



</div>






<div class="card">


<h2>

👥 Team Members

</h2>



<?php


$players=[

'player_1',

'player_2',

'player_3',

'player_4'

];



$count=1;



foreach($players as $p):



if($team[$p]):



$stmt=$pdo->prepare("

SELECT name,pubg_uid

FROM users

WHERE id=?

");


$stmt->execute([$team[$p]]);


$user=$stmt->fetch();


?>



<div class="player">


<strong>

Player <?php echo $count; ?> :

<?php echo htmlspecialchars($user['name'] ?? 'Unknown'); ?>

</strong>



<div class="uid">

PUBG UID:

<?php echo htmlspecialchars($user['pubg_uid'] ?? 'Not Added'); ?>

</div>



</div>



<?php


$count++;


endif;


endforeach;


?>



</div>






<div class="card">


<h3>

Tournament Status

</h3>


<p>

Your team is waiting for admin approval.

</p>



</div>





<?php endif; ?>




</div>



</body>

</html>