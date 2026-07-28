<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: login.php");
exit;

}



$message="";


$tournament_id=intval($_GET['id'] ?? 0);



if(!$tournament_id){

die("Tournament ID Missing");

}





/*
 GET TOURNAMENT
*/


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





/*
 START QUALIFICATION
*/


if(isset($_POST['qualify'])){


try{


$pdo->beginTransaction();



$qualify_limit=intval($_POST['qualify_limit']);




/*
 GET TEAM RANKING
*/


$stmt=$pdo->prepare("

SELECT


t.id,

t.team_name,


SUM(mr.total_points) AS points,


SUM(mr.kills) AS kills



FROM teams t


JOIN match_results mr

ON t.id=mr.team_id



WHERE mr.tournament_id=?



GROUP BY t.id



ORDER BY

points DESC,

kills DESC



");



$stmt->execute([$tournament_id]);


$teams=$stmt->fetchAll();




$rank=1;



foreach($teams as $team){



$status =

($rank <= $qualify_limit)

?

'qualified'

:

'eliminated';





$stmtUpdate=$pdo->prepare("

UPDATE teams

SET qualification_status=?

WHERE id=?

");



$stmtUpdate->execute([

$status,

$team['id']

]);



$rank++;



}






/*
 SAVE ROUND STATUS
*/


$stmt=$pdo->prepare("

UPDATE tournaments

SET

qualification_done=1

WHERE id=?

");


$stmt->execute([$tournament_id]);




$pdo->commit();


$message="Qualification completed successfully";



}

catch(Exception $e){


if($pdo->inTransaction()){

$pdo->rollBack();

}


$message=$e->getMessage();


}



}







/*
 SHOW RANKING

*/


$stmt=$pdo->prepare("

SELECT


t.team_name,


t.qualification_status,


SUM(mr.total_points) points,


SUM(mr.kills) kills



FROM teams t


JOIN match_results mr

ON t.id=mr.team_id



WHERE mr.tournament_id=?



GROUP BY t.id



ORDER BY

points DESC,

kills DESC


");



$stmt->execute([$tournament_id]);


$ranking=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>
OPBattle Qualification
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

border-radius:18px;

padding:25px;

margin-bottom:20px;

}



.alert{

background:#052e16;

color:#22c55e;

padding:15px;

border-radius:10px;

margin-bottom:20px;

}



input{

width:100%;

padding:14px;

background:#161b22;

border:1px solid #374151;

color:white;

border-radius:10px;

margin-bottom:15px;

}



button{

background:#ccff00;

border:0;

padding:14px 25px;

font-weight:900;

border-radius:10px;

cursor:pointer;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:14px;

color:#9ca3af;

}



td{

padding:14px;

border-bottom:1px solid #1f2937;

}



.qualify{

color:#22c55e;

font-weight:bold;

}



.out{

color:#ef4444;

font-weight:bold;

}



</style>

</head>



<body>



<div class="container">


<h1>

🏆 Tournament Qualification

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>





<div class="card">


<form method="post">


<label>

How Many Teams Qualify?

</label>


<input

type="number"

name="qualify_limit"

value="8"

required

>



<button name="qualify">

GENERATE QUALIFICATION

</button>


</form>


</div>





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
Points
</th>

<th>
Kills
</th>

<th>
Status
</th>

</tr>



<?php

$r=1;

foreach($ranking as $team):

?>


<tr>


<td>

#<?php echo $r; ?>

</td>


<td>

<?php echo htmlspecialchars($team['team_name']); ?>

</td>


<td>

<?php echo $team['points']; ?>

</td>


<td>

<?php echo $team['kills']; ?>

</td>


<td>


<?php if($team['qualification_status']=='qualified'): ?>

<span class="qualify">

QUALIFIED

</span>


<?php else: ?>


<span class="out">

OUT

</span>


<?php endif; ?>


</td>


</tr>


<?php

$r++;

endforeach;

?>


</table>


</div>



</div>


</body>

</html>