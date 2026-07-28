<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}


$tournament_id=intval($_GET['id'] ?? 0);



if(!$tournament_id){

die("Tournament ID Missing");

}




/*

GET TEAM RANKING

*/


$stmt=$pdo->prepare("


SELECT


t.id,

t.team_name,


COUNT(m.id) AS matches_played,


SUM(m.kills) AS total_kills,


SUM(m.total_points) AS total_points



FROM teams t



LEFT JOIN match_results m

ON t.id=m.team_id



WHERE t.tournament_id=?



AND t.verification_status='approved'



GROUP BY t.id



ORDER BY total_points DESC,total_kills DESC



");



$stmt->execute([$tournament_id]);


$ranking=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Leaderboard

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

max-width:1100px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

font-size:34px;

}




.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:20px;

}





table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:15px;

text-align:left;

color:#9ca3af;

}



td{

padding:15px;

border-bottom:1px solid #1f2937;

}



.rank{

font-size:22px;

font-weight:900;

color:#ccff00;

}



.team{

font-weight:900;

}



.points{

color:#22c55e;

font-weight:bold;

}



.kill{

color:#60a5fa;

font-weight:bold;

}




.top{

background:#052e16;

}



@media(max-width:700px){


table{

font-size:12px;

}


th,td{

padding:10px;

}



}



</style>


</head>


<body>



<div class="container">



<h1>

🏆 OPBattle Tournament Ranking

</h1>



<div class="card">



<table>



<tr>

<th>
Rank
</th>

<th>
Team
</th>

<th>
Matches
</th>

<th>
Kills
</th>

<th>
Points
</th>

</tr>




<?php


$rank=1;


foreach($ranking as $r):

?>


<tr class="<?php echo ($rank<=3)?'top':''; ?>">



<td class="rank">

#<?php echo $rank; ?>

</td>




<td class="team">

<?php echo htmlspecialchars($r['team_name']); ?>

</td>




<td>

<?php echo $r['matches_played']; ?>

</td>




<td class="kill">

<?php echo $r['total_kills'] ?? 0; ?>

</td>




<td class="points">

<?php echo $r['total_points'] ?? 0; ?>

</td>



</tr>



<?php

$rank++;

endforeach;

?>



</table>



</div>



</div>


</body>

</html>