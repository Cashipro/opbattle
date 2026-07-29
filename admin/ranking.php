<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



$tournament_id=$_GET['tournament_id'] ?? '';

if(!$tournament_id){

die("Tournament ID Missing");

}




$stmt=$pdo->prepare("

SELECT

mr.team_name,

SUM(mr.kills) as total_kills,

SUM(mr.total_points) as total_points

FROM match_results mr

JOIN matches m

ON m.id = mr.match_id

WHERE m.tournament_id=?

GROUP BY mr.team_name

ORDER BY total_points DESC

");


$stmt->execute([$tournament_id]);


$ranking=$stmt->fetchAll();


?>


<!DOCTYPE html>

<html>

<head>

<title>Ranking - OpBattle</title>

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



.box{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:25px;

}



table{

width:100%;

border-collapse:collapse;

}



th{

color:#00ff84;

text-align:left;

padding:15px;

}



td{

padding:15px;

border-bottom:1px solid #222;

}



.rank{

color:#00ff84;

font-size:22px;

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

Tournament Ranking

</h1>



<div class="box">



<table>


<tr>

<th>
Rank
</th>

<th>
Team
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

foreach($ranking as $r){

?>


<tr>


<td class="rank">

<?=$rank?>

</td>



<td>

<?=htmlspecialchars($r['team_name'])?>

</td>



<td>

<?=$r['total_kills']?>

</td>



<td>

<?=$r['total_points']?>

</td>


</tr>



<?php

$rank++;

}

?>



</table>



</div>


</div>


</body>

</html>