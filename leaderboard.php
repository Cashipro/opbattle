<?php

require_once 'config.php';

session_start();


$tournament_id=intval($_GET['id'] ?? 0);



if(!$tournament_id){

die("Tournament ID Missing");

}





/*
 GET LEADERBOARD
*/


$stmt=$pdo->prepare("


SELECT


t.team_name,


COUNT(m.id) AS matches_played,


COALESCE(SUM(m.kills),0) AS total_kills,


COALESCE(SUM(m.total_points),0) AS total_points



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

font-size:35px;

}





.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:20px;

overflow:auto;

}





table{

width:100%;

border-collapse:collapse;

}



th{

padding:15px;

background:#161b22;

color:#9ca3af;

text-align:left;

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



.kills{

color:#60a5fa;

font-weight:bold;

}




.top{

background:#052e16;

}




.empty{

text-align:center;

padding:40px;

}



</style>


</head>



<body>



<div class="container">



<h1>

🏆 Live Tournament Leaderboard

</h1>



<div class="card">


<?php if(count($ranking)>0): ?>



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


foreach($ranking as $team):

?>


<tr class="<?php echo ($rank<=3)?'top':''; ?>">



<td class="rank">

#<?php echo $rank; ?>

</td>




<td class="team">

<?php echo htmlspecialchars($team['team_name']); ?>

</td>




<td>

<?php echo $team['matches_played']; ?>

</td>




<td class="kills">

<?php echo $team['total_kills']; ?>

</td>




<td class="points">

<?php echo $team['total_points']; ?>

</td>




</tr>



<?php

$rank++;

endforeach;

?>



</table>



<?php else: ?>


<div class="empty">


<h2>

No Results Yet

</h2>


<p>

Leaderboard will update after matches.

</p>


</div>



<?php endif; ?>



</div>



</div>


</body>

</html>