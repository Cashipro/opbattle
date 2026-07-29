<?php

session_start();

require_once "../config.php";


$tournament_id=$_GET['id'] ?? '';

if(!$tournament_id){

die("Tournament ID Missing");

}



// TOURNAMENT DATA

$stmt=$pdo->prepare("

SELECT *

FROM tournaments

WHERE id=?

");


$stmt->execute([$tournament_id]);


$tournament=$stmt->fetch();



if(!$tournament){

die("Tournament Not Found");

}




// RESULTS WITH MATCH DETAILS

$stmt=$pdo->prepare("

SELECT

mr.*,

m.round_name,

m.match_number

FROM match_results mr

JOIN matches m

ON m.id = mr.match_id

WHERE m.tournament_id=?

ORDER BY

m.id ASC,

mr.total_points DESC

");


$stmt->execute([$tournament_id]);


$results=$stmt->fetchAll();




// GROUP ROUND + MATCH

$data=[];


foreach($results as $r){


$data[$r['round_name']][$r['match_number']][]=$r;


}


?>


<!DOCTYPE html>

<html>

<head>

<title><?=htmlspecialchars($tournament['name'])?> Results</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.container{

padding:30px;

}



h1{

color:#00ff84;

}



.round{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:25px;

margin-bottom:25px;

}



.match{

background:#050505;

padding:20px;

border-radius:15px;

margin-top:15px;

}



table{

width:100%;

border-collapse:collapse;

}



th{

color:#00ff84;

text-align:left;

padding:12px;

}



td{

padding:12px;

border-bottom:1px solid #222;

}



.points{

color:#00ff84;

font-weight:bold;

}



.empty{

color:#888;

text-align:center;

padding:30px;

}



@media(max-width:700px){

.container{

padding:15px;

}

table{

font-size:13px;

}


}


</style>

</head>


<body>


<div class="container">


<h1>

<?=htmlspecialchars($tournament['name'])?>

</h1>


<h2>
Tournament Results
</h2>



<?php if(empty($data)){ ?>


<div class="empty">

No Results Added Yet

</div>


<?php } ?>





<?php foreach($data as $round=>$matches){ ?>


<div class="round">


<h2>

<?=$round?>

</h2>




<?php foreach($matches as $match=>$teams){ ?>


<div class="match">


<h3>

Match <?=$match?>

</h3>



<table>


<tr>

<th>
Team
</th>

<th>
Position
</th>

<th>
Kills
</th>

<th>
Points
</th>

</tr>



<?php foreach($teams as $team){ ?>


<tr>


<td>

<?=htmlspecialchars($team['team_name'])?>

</td>


<td>

<?=$team['position']?>

</td>


<td>

<?=$team['kills']?>

</td>


<td class="points">

<?=$team['total_points']?>

</td>


</tr>



<?php } ?>



</table>



</div>



<?php } ?>



</div>


<?php } ?>



</div>


</body>

</html>