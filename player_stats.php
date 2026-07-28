<?php

require_once 'config.php';


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}




/*
 GET ALL PLAYERS STATS
*/


$stmt=$pdo->query("

SELECT

u.id,

u.name,

u.pubg_uid,


COUNT(mr.id) AS matches,


SUM(mr.kills) AS total_kills,


SUM(mr.total_points) AS tournament_points



FROM users u



LEFT JOIN teams t

ON

(
t.player_1=u.id

OR t.player_2=u.id

OR t.player_3=u.id

OR t.player_4=u.id

)



LEFT JOIN match_results mr

ON t.id=mr.team_id



GROUP BY u.id



ORDER BY

(
SUM(mr.total_points)
+
(SUM(mr.kills)*2)
) DESC



");


$players=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Player Ranking

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

font-size:32px;

}





.leader-card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:18px;

overflow:hidden;

}





table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:15px;

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



.player{

font-weight:900;

}



.uid{

color:#60a5fa;

font-size:12px;

}



.points{

color:#ccff00;

font-weight:bold;

}



.badge{

background:#ccff00;

color:black;

padding:5px 10px;

border-radius:20px;

font-size:11px;

font-weight:900;

}



.top{

background:rgba(204,255,0,.05);

}




@media(max-width:700px){


table{

font-size:12px;

}


td,th{

padding:10px;

}


}



</style>


</head>



<body>



<div class="container">


<h1>

🏆 OPBattle Global Ranking

</h1>



<p style="color:#9ca3af;margin-bottom:25px">

Top esports players based on tournament performance

</p>




<div class="leader-card">


<table>


<tr>


<th>
Rank
</th>


<th>
Player
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


foreach($players as $p):


$total_points=

($p['tournament_points'] ?? 0)

+

(($p['total_kills'] ?? 0)*2);



?>



<tr class="<?php echo $rank<=3?'top':''; ?>">



<td class="rank">

#<?php echo $rank; ?>

</td>




<td>


<div class="player">

<?php echo htmlspecialchars($p['name']); ?>

</div>


<div class="uid">

UID:
<?php echo htmlspecialchars($p['pubg_uid'] ?? 'N/A'); ?>

</div>



<?php if($rank==1): ?>

<br>

<span class="badge">

MVP

</span>


<?php endif; ?>


</td>





<td>

<?php echo $p['matches']; ?>

</td>




<td>

<?php echo $p['total_kills'] ?? 0; ?>

</td>




<td class="points">

<?php echo $total_points; ?>

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