<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



$match_id=$_GET['match_id'] ?? '';

if(!$match_id){

die("Match ID Missing");

}



// SAVE RESULT

if(isset($_POST['save'])){


$team_number=$_POST['team_number'];

$team_name=$_POST['team_name'];

$position=$_POST['position'];

$kills=$_POST['kills'];



// POSITION POINTS

$position_points=0;


$points=[
1=>15,
2=>12,
3=>10,
4=>8,
5=>6,
6=>5,
7=>4,
8=>3,
9=>2,
10=>1
];


if(isset($points[$position])){

$position_points=$points[$position];

}



// KILL POINT

$kill_points=$kills;



$total_points=$position_points+$kill_points;




$stmt=$pdo->prepare("

INSERT INTO match_results

(
match_id,
team_number,
team_name,
position,
kills,
position_points,
kill_points,
total_points
)

VALUES(?,?,?,?,?,?,?,?)

");



$stmt->execute([

$match_id,

$team_number,

$team_name,

$position,

$kills,

$position_points,

$kill_points,

$total_points

]);





header("Location: enter-result.php?match_id=".$match_id);

exit;


}





// MATCH DATA


$stmt=$pdo->prepare("

SELECT *

FROM matches

WHERE id=?

");


$stmt->execute([$match_id]);


$match=$stmt->fetch();



if(!$match){

die("Match Not Found");

}





// OLD RESULTS


$stmt=$pdo->prepare("

SELECT *

FROM match_results

WHERE match_id=?

ORDER BY total_points DESC

");


$stmt->execute([$match_id]);


$results=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>

<title>Enter Result - OpBattle</title>

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



.card{

background:#111;

border:1px solid #222;

padding:25px;

border-radius:20px;

margin-bottom:25px;

}



input{

width:100%;

padding:14px;

background:#000;

color:white;

border:1px solid #444;

border-radius:12px;

margin-bottom:15px;

}



button{

background:#00ff84;

color:black;

padding:14px 25px;

border:0;

border-radius:12px;

font-weight:bold;

}



table{

width:100%;

border-collapse:collapse;

}


th{

color:#00ff84;

padding:12px;

text-align:left;

}


td{

padding:12px;

border-bottom:1px solid #222;

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

Enter Result

</h1>



<div class="card">


<h2>

Match <?=$match['match_number']?>

</h2>


<form method="POST">


<input

type="number"

name="team_number"

placeholder="Team Number"

required>



<input

type="text"

name="team_name"

placeholder="Team Name"

required>



<input

type="number"

name="position"

placeholder="Position"

required>



<input

type="number"

name="kills"

placeholder="Kills"

required>



<button name="save">

Save Result

</button>


</form>


</div>





<div class="card">


<h2>

Submitted Results

</h2>



<table>


<tr>

<th>Team</th>

<th>Position</th>

<th>Kills</th>

<th>Total Points</th>

</tr>



<?php foreach($results as $r){ ?>


<tr>


<td>

<?=$r['team_name']?>

</td>


<td>

<?=$r['position']?>

</td>


<td>

<?=$r['kills']?>

</td>


<td>

<?=$r['total_points']?>

</td>


</tr>


<?php } ?>


</table>


</div>



</div>


</body>

</html>