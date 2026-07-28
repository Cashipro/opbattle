<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];



/*
 USER PROFILE
*/


$stmt=$pdo->prepare("

SELECT *

FROM users

WHERE id=?

");


$stmt->execute([$user_id]);


$user=$stmt->fetch();



if(!$user){

die("User not found");

}





/*
 TEAM DATA
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





/*
 PLAYER STATS
*/


$stats=[

'matches'=>0,

'kills'=>0,

'points'=>0,

'wins'=>0

];



if($team){



$stmt=$pdo->prepare("

SELECT

COUNT(*) AS matches,

SUM(kills) AS kills,

SUM(total_points) AS points,

SUM(CASE WHEN position=1 THEN 1 ELSE 0 END) AS wins



FROM match_results

WHERE team_id=?

");


$stmt->execute([$team['id']]);


$data=$stmt->fetch();



if($data){


$stats=[

'matches'=>$data['matches'] ?? 0,

'kills'=>$data['kills'] ?? 0,

'points'=>$data['points'] ?? 0,

'wins'=>$data['wins'] ?? 0

];


}



}



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Profile

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

max-width:900px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

}





.profile{

background:#0f1319;

border:1px solid #1f2937;

border-radius:25px;

padding:30px;

text-align:center;

}





.avatar{

width:100px;

height:100px;

border-radius:50%;

margin:auto;

background:#161b22;

display:flex;

align-items:center;

justify-content:center;

font-size:40px;

}





.name{

font-size:30px;

font-weight:900;

color:#ccff00;

margin-top:15px;

}





.uid{

color:#60a5fa;

margin-top:10px;

}





.grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(150px,1fr));

gap:15px;

margin-top:30px;

}





.stat{

background:#161b22;

padding:20px;

border-radius:15px;

}



.number{

font-size:28px;

font-weight:900;

color:#22c55e;

}



.label{

color:#9ca3af;

font-size:13px;

}





.team{

margin-top:20px;

background:#161b22;

padding:20px;

border-radius:15px;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 Player Profile

</h1>




<div class="profile">



<div class="avatar">

🎯

</div>




<div class="name">

<?php echo htmlspecialchars($user['name']); ?>

</div>




<div class="uid">

PUBG UID:

<?php echo htmlspecialchars($user['pubg_uid'] ?? 'Not Added'); ?>

</div>






<div class="grid">


<div class="stat">

<div class="number">

<?php echo $stats['matches']; ?>

</div>

<div class="label">

Matches

</div>

</div>



<div class="stat">

<div class="number">

<?php echo $stats['kills']; ?>

</div>

<div class="label">

Kills

</div>

</div>



<div class="stat">

<div class="number">

<?php echo $stats['points']; ?>

</div>

<div class="label">

Points

</div>

</div>



<div class="stat">

<div class="number">

<?php echo $stats['wins']; ?>

</div>

<div class="label">

Wins

</div>

</div>



</div>






<?php if($team): ?>


<div class="team">


<h3>

🏆 Team

</h3>


<?php echo htmlspecialchars($team['team_name']); ?>


</div>


<?php endif; ?>





</div>



</div>


</body>

</html>