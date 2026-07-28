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
 CREATE NEXT ROUND
*/


if(isset($_POST['create_round'])){


try{


$pdo->beginTransaction();



$round_name=trim($_POST['round_name']);





/*
 CHECK QUALIFIED TEAMS
*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE tournament_id=?

AND qualification_status='qualified'

ORDER BY id ASC

");


$stmt->execute([$tournament_id]);


$qualified=$stmt->fetchAll();



if(count($qualified)==0){

throw new Exception(
"No qualified teams found"
);

}





/*
 CREATE ROUND RECORD

*/


$stmt=$pdo->prepare("

INSERT INTO tournament_rounds

(
tournament_id,
round_name,
total_teams
)

VALUES(?,?,?)

");


$stmt->execute([

$tournament_id,

$round_name,

count($qualified)

]);



$round_id=$pdo->lastInsertId();







/*
 CREATE NEW TEAM SLOTS

*/


$slot=1;


foreach($qualified as $team){



$stmt=$pdo->prepare("

INSERT INTO round_teams

(

round_id,

old_team_id,

team_name,

slot_number

)

VALUES(?,?,?,?)

");



$stmt->execute([

$round_id,

$team['id'],

$team['team_name'],

$slot

]);



$slot++;


}





$pdo->commit();



$message="New round created successfully";



}

catch(Exception $e){


if($pdo->inTransaction()){

$pdo->rollBack();

}


$message=$e->getMessage();


}



}






/*
 GET ROUNDS
*/


$stmt=$pdo->prepare("

SELECT *

FROM tournament_rounds

WHERE tournament_id=?

ORDER BY id DESC

");


$stmt->execute([$tournament_id]);


$rounds=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Round Generator
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

max-width:900px;

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

border:1px solid #22c55e;

color:#22c55e;

padding:15px;

border-radius:10px;

}



input{

width:100%;

padding:14px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

margin-bottom:15px;

}



button{

background:#ccff00;

padding:14px 25px;

border:0;

border-radius:10px;

font-weight:900;

cursor:pointer;

}



.round{

background:#161b22;

padding:15px;

border-radius:12px;

margin-top:10px;

}



</style>

</head>



<body>



<div class="container">


<h1>

🎮 Create Tournament Round

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>





<div class="card">


<form method="post">


<label>

Round Name

</label>


<input

type="text"

name="round_name"

placeholder="Example: Semi Final"

required

>



<button name="create_round">

CREATE ROUND

</button>


</form>


</div>





<div class="card">


<h3>

Created Rounds

</h3>



<?php foreach($rounds as $r): ?>


<div class="round">


<strong>

<?php echo htmlspecialchars($r['round_name']); ?>

</strong>


<br>


Teams:

<?php echo $r['total_teams']; ?>


</div>


<?php endforeach; ?>



</div>



</div>


</body>

</html>