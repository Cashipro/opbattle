<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

session_start();

require_once '../config.php';



if(!isset($_SESSION['admin_id'])){

    header("Location: admin_login.php");
    exit;

}



$message="";
$error="";



if(isset($_POST['create'])){


$title = trim($_POST['title']);

$game_name = $_POST['game_name'];

$tournament_type = $_POST['tournament_type'];

$map_name = $_POST['map_name'];

$entry_fee = floatval($_POST['entry_fee']);

$prize_pool = floatval($_POST['prize_pool']);

$total_slots = intval($_POST['total_slots']);

$tournament_date = $_POST['tournament_date'];

$description = $_POST['description'] ?? '';

$players_per_team = intval($_POST['players_per_team']);




if(empty($title)){


$error="Tournament title required.";


}

else{


try{


$pdo->beginTransaction();



// CREATE TOURNAMENT


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

description,

registration_status,

players_per_team

)

VALUES

(?,?,?,?,?,?,?,0,?,'upcoming',?,'open',?)

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

$description,

$players_per_team


]);




// GET TOURNAMENT ID


$tournament_id=$pdo->lastInsertId();




// CREATE TEAMS


$team=$pdo->prepare("

INSERT INTO tournament_teams

(

tournament_id,

team_number

)

VALUES

(?,?)

");



for($i=1;$i<=$total_slots;$i++){


$team->execute([

$tournament_id,

$i

]);


}




$pdo->commit();


$message="Tournament created with ".$total_slots." teams successfully.";



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
OPBattle Create Tournament
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

max-width:850px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

font-size:34px;

}



.card{

background:#0f1319;

border:1px solid #27313d;

border-radius:22px;

padding:30px;

box-shadow:0 0 30px #000;

}



.success{

background:#052e16;

border:1px solid #22c55e;

color:#22c55e;

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



.error{

background:#450a0a;

border:1px solid red;

color:#ff7777;

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



label{

display:block;

color:#9ca3af;

font-size:14px;

margin-bottom:8px;

}



input,
select,
textarea{


width:100%;

padding:14px;

background:#161b22;

border:1px solid #374151;

border-radius:12px;

color:white;

margin-bottom:18px;


}



textarea{

height:100px;

resize:none;

}



.grid{

display:grid;

grid-template-columns:1fr 1fr;

gap:18px;

}



button{

width:100%;

padding:16px;

background:#ccff00;

color:black;

border:0;

border-radius:14px;

font-size:16px;

font-weight:900;

cursor:pointer;

}



button:hover{

opacity:.85;

}



.note{

background:#161b22;

padding:15px;

border-radius:12px;

margin-bottom:20px;

color:#9ca3af;

}



@media(max-width:700px){


.grid{

grid-template-columns:1fr;

}


.container{

margin:20px auto;

padding:15px;

}



}


</style>


</head>


<body>



<div class="container">



<h1>
🎮 Create OPBattle Tournament
</h1>




<?php if($message){ ?>


<div class="success">

<?php echo $message; ?>

</div>


<?php } ?>



<?php if($error){ ?>


<div class="error">

<?php echo $error; ?>

</div>


<?php } ?>





<div class="card">


<div class="note">

Tournament create hote hi system automatically teams generate karega.

Example:
100 Teams = Team 1 se Team 100

</div>




<form method="post">



<label>
Tournament Name
</label>


<input

type="text"

name="title"

placeholder="OPBattle Weekly Cup"

required

>




<div class="grid">


<div>


<label>
Game Name
</label>


<input

type="text"

name="game_name"

value="PUBG Mobile"

>


</div>



<div>


<label>
Tournament Type
</label>


<select name="tournament_type">


<option>
Squad
</option>


<option>
Duo
</option>


<option>
Solo
</option>


</select>


</div>


</div>





<div class="grid">


<div>


<label>
Map
</label>


<select name="map_name">


<option>
Erangel
</option>


<option>
Miramar
</option>


<option>
Livik
</option>


<option>
Sanhok
</option>


</select>


</div>




<div>


<label>
Players Per Team
</label>


<input

type="number"

name="players_per_team"

value="4"

>


</div>


</div>





<div class="grid">


<div>


<label>
Entry Fee
</label>


<input

type="number"

name="entry_fee"

value="0"

>


</div>



<div>


<label>
Prize Pool
</label>


<input

type="number"

name="prize_pool"

value="0"

>


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

value="100"

>


</div>



<div>


<label>
Match Date & Time

</label>


<input

type="datetime-local"

name="tournament_date"

required

>


</div>


</div>





<label>

Description

</label>


<textarea

name="description"

placeholder="Tournament details..."

></textarea>






<button name="create">

CREATE TOURNAMENT

</button>




</form>



</div>



</div>



</body>

</html>
