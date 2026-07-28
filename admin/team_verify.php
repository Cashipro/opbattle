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
 APPROVE TEAM
*/


if(isset($_GET['approve'])){


$team_id=intval($_GET['approve']);



$stmt=$pdo->prepare("

UPDATE teams

SET verification_status='approved'

WHERE id=?

");


$stmt->execute([$team_id]);



$message="Team approved successfully";


}




/*
 REJECT TEAM
*/


if(isset($_GET['reject'])){


$team_id=intval($_GET['reject']);



$stmt=$pdo->prepare("

UPDATE teams

SET verification_status='rejected'

WHERE id=?

");


$stmt->execute([$team_id]);



$message="Team rejected";


}





/*
 GET TEAMS
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE tournament_id=?

ORDER BY id DESC

");


$stmt->execute([$tournament_id]);


$teams=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Team Verification

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

max-width:1100px;

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

padding:20px;

margin-bottom:20px;

}



.team-name{

font-size:22px;

font-weight:900;

color:#ccff00;

}



.player{

background:#161b22;

padding:12px;

border-radius:10px;

margin-top:10px;

}



.uid{

color:#60a5fa;

font-size:13px;

}



.status{

padding:8px 12px;

border-radius:20px;

display:inline-block;

margin-top:10px;

font-size:12px;

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



button,a{

padding:10px 15px;

border-radius:10px;

text-decoration:none;

font-weight:bold;

}



.approve{

background:#22c55e;

color:black;

}



.reject{

background:#ef4444;

color:white;

}



</style>


</head>



<body>



<div class="container">



<h1>

✅ Team Verification Panel

</h1>



<?php if($message): ?>


<div class="card">

<?php echo $message; ?>

</div>


<?php endif; ?>






<?php foreach($teams as $team): ?>



<div class="card">



<div class="team-name">

<?php echo htmlspecialchars($team['team_name']); ?>

</div>




<div class="status <?php echo $team['verification_status']; ?>">

<?php echo strtoupper($team['verification_status']); ?>

</div>





<?php


$players=[

'player_1',

'player_2',

'player_3',

'player_4'

];



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

<?php echo htmlspecialchars($user['name'] ?? 'Unknown'); ?>

</strong>


<br>


<div class="uid">

PUBG UID:

<?php echo htmlspecialchars($user['pubg_uid'] ?? 'N/A'); ?>

</div>


</div>



<?php endif; endforeach; ?>







<br>



<?php if($team['verification_status']!='approved'): ?>


<a class="approve"

href="?id=<?php echo $tournament_id; ?>&approve=<?php echo $team['id']; ?>">

APPROVE

</a>



<?php endif; ?>




<?php if($team['verification_status']!='rejected'): ?>


<a class="reject"

href="?id=<?php echo $tournament_id; ?>&reject=<?php echo $team['id']; ?>">

REJECT

</a>


<?php endif; ?>





</div>



<?php endforeach; ?>





</div>


</body>

</html>