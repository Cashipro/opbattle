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

SELECT id

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



$results=[];


if($team){


$stmt=$pdo->prepare("


SELECT


m.*,

tr.room_name,

t.team_name



FROM match_results m



JOIN tournament_rooms tr

ON m.room_id=tr.id



JOIN teams t

ON m.team_id=t.id



WHERE m.team_id=?



ORDER BY m.id DESC



");


$stmt->execute([$team['id']]);


$results=$stmt->fetchAll();


}



?>


<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Match History

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

max-width:1000px;

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




.points{

color:#22c55e;

font-weight:900;

}



.kills{

color:#60a5fa;

font-weight:bold;

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

⚔️ My Match History

</h1>




<div class="card">


<?php if(count($results)>0): ?>



<table>


<tr>

<th>
Match
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

<th>
Date
</th>

</tr>




<?php foreach($results as $r): ?>



<tr>



<td>

<?php echo htmlspecialchars($r['room_name']); ?>

</td>



<td>

#<?php echo $r['position']; ?>

</td>



<td class="kills">

<?php echo $r['kills']; ?>

</td>




<td class="points">

<?php echo $r['total_points']; ?>

</td>




<td>

<?php echo date('d M Y',strtotime($r['created_at'])); ?>

</td>



</tr>



<?php endforeach; ?>



</table>




<?php else: ?>



<div class="empty">


<h2>

No Match Played

</h2>


<p>

Your match history will appear here.

</p>


</div>



<?php endif; ?>



</div>



</div>


</body>

</html>