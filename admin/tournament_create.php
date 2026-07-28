<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

    header("Location: admin_login.php");
    exit;

}


$message="";
$error="";



if(isset($_POST['create'])){


$title = trim($_POST['title'] ?? '');

$game_name = $_POST['game_name'] ?? 'PUBG Mobile';

$tournament_type = $_POST['tournament_type'] ?? 'Squad';

$map_name = $_POST['map_name'] ?? 'Erangel';

$entry_fee = floatval($_POST['entry_fee'] ?? 0);

$prize_pool = floatval($_POST['prize_pool'] ?? 0);

$total_slots = intval($_POST['total_slots'] ?? 100);

$tournament_date = $_POST['tournament_date'] ?? null;

$description = $_POST['description'] ?? '';



if(empty($title)){

    $error="Tournament title required.";

}
else{


try{


$pdo->beginTransaction();



$stmt=$pdo->prepare("

INSERT INTO tournaments

(
title,
game_name,
tournament_type,
map_name,
entry_fee,
prize_pool,
total_slots,
joined_players,
tournament_date,
status,
description

)

VALUES

(?,?,?,?,?,?,?,0,?,'upcoming',?)

");



$stmt->execute([

$title,
$game_name,
$tournament_type,
$map_name,
$entry_fee,
$prize_pool,
$total_slots,
$tournament_date,
$description

]);



$tournament_id=$pdo->lastInsertId();



/*
 CREATE PUBG STYLE TEAMS
*/


for($i=1; $i <= $total_slots; $i++){


$team=$pdo->prepare("

INSERT INTO tournament_teams

(
tournament_id,
team_number
)

VALUES

(?,?)

");


$team->execute([

$tournament_id,
$i

]);


}



$pdo->commit();



$message="Tournament created with $total_slots teams successfully.";



}
catch(PDOException $e){


$pdo->rollBack();

$error=$e->getMessage();


}


}



}



?>



<!DOCTYPE html>

<html>

<head>

<title>
Create Tournament - OPBattle
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

max-width:800px;

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

padding:30px;

}



.alert{

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



.success{

background:#052e16;

border:1px solid #22c55e;

color:#22c55e;

}



.error{

background:#450a0a;

border:1px solid red;

color:#ff7777;

}



label{

display:block;

margin-bottom:7px;

color:#9ca3af;

}



input,select,textarea{

width:100%;

padding:14px;

margin-bottom:18px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

}



.grid{

display:grid;

grid-template-columns:1fr 1fr;

gap:15px;

}



button{

width:100%;

padding:15px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:900;

cursor:pointer;

}



@media(max-width:700px){

.grid{

grid-template-columns:1fr;

}

}


</style>


</head>



<body>


<div class="container">


<h1>
🎮 Create New Tournament
</h1>



<?php if($message){ ?>

<div class="alert success">

<?php echo $message; ?>

</div>

<?php } ?>



<?php if($error){ ?>

<div class="alert error">

<?php echo $error; ?>

</div>

<?php } ?>




<div class="card">


<form method="post">



<label>
Tournament Name
</label>

<input 
type="text"
name="title"
placeholder="OPBattle Weekly Cup"
required>



<div class="grid">


<div>

<label>
Game
</label>

<input 
name="game_name"
value="PUBG Mobile">

</div>



<div>

<label>
Type
</label>

<select name="tournament_type">

<option>Squad</option>

<option>Duo</option>

<option>Solo</option>

</select>

</div>


</div>




<label>
Map
</label>

<select name="map_name">

<option>Erangel</option>

<option>Miramar</option>

<option>Livik</option>

<option>Sanhok</option>

</select>




<div class="grid">


<div>

<label>
Entry Fee
</label>

<input 
type="number"
name="entry_fee"
value="0">

</div>



<div>

<label>
Prize Pool
</label>

<input 
type="number"
name="prize_pool"
value="0">

</div>


</div>




<div class="grid">


<div>

<label>
Total Teams
</label>

<input 
type="number"
name="total_slots"
value="100">

</div>



<div>

<label>
Match Date
</label>

<input 
type="datetime-local"
name="tournament_date">

</div>


</div>



<label>
Description
</label>


<textarea name="description"></textarea>




<button name="create">

CREATE TOURNAMENT

</button>



</form>


</div>


</div>


</body>

</html>
