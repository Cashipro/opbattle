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



// CREATE MATCH PLAN

$msg="";


if(isset($_POST['create_plan'])){


// GET JOINED TEAMS

$stmt=$pdo->prepare("

SELECT DISTINCT team_number

FROM tournament_slots

WHERE tournament_id=?

AND user_id IS NOT NULL

ORDER BY team_number

");


$stmt->execute([$tournament_id]);


$teams=$stmt->fetchAll(PDO::FETCH_COLUMN);



if(count($teams)==0){

$msg="No teams joined yet";

}else{



// DELETE OLD PLAN

$del=$pdo->prepare("

DELETE FROM matches

WHERE tournament_id=?

");


$del->execute([$tournament_id]);





$match_no=1;

$chunks=array_chunk($teams,25);



foreach($chunks as $chunk){


$stmt=$pdo->prepare("

INSERT INTO matches

(
tournament_id,
round_name,
match_number,
teams_count,
status
)

VALUES(?,?,?,?,?)

");


$stmt->execute([

$tournament_id,

"Round 1",

$match_no,

count($chunk),

"pending"

]);



$match_no++;


}




$msg="Match Plan Created Successfully";


}



}





// GET MATCHES

$stmt=$pdo->prepare("

SELECT *

FROM matches

WHERE tournament_id=?

ORDER BY id ASC

");


$stmt->execute([$tournament_id]);


$matches=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>

<title>Match Plan - OpBattle</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>

body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}


.main{

margin-left:280px;

padding:35px;

}



.box{

background:#111;

padding:25px;

border-radius:20px;

border:1px solid #222;

margin-bottom:20px;

}



button{

background:#00ff84;

border:0;

padding:14px 20px;

border-radius:12px;

font-weight:bold;

}



.card{

background:#050505;

padding:18px;

border-radius:15px;

margin-top:15px;

}



.green{

color:#00ff84;

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

Match Plan

</h1>



<div class="box">


<?php if($msg){ ?>

<p class="green">

<?=$msg?>

</p>

<?php } ?>



<form method="POST">

<button name="create_plan">

Generate Match Plan

</button>

</form>


</div>





<div class="box">


<h2>

Created Matches

</h2>



<?php foreach($matches as $m){ ?>


<div class="card">


<h3>

<?=$m['round_name']?> -

Match <?=$m['match_number']?>

</h3>


<p>

Teams:

<span class="green">

<?=$m['teams_count']?>

</span>

</p>


<p>

Status:

<?=$m['status']?>

</p>



<a href="match-details.php?match_id=<?=$m['id']?>">

Open Match

</a>



</div>


<?php } ?>



</div>



</div>


</body>

</html>