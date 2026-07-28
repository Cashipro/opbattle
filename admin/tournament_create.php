<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once '../config.php';

if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}


$message="";

$error="";


if(isset($_POST['create'])){


$title=trim($_POST['title'] ?? '');

$map=$_POST['map_name'] ?? 'Erangel';

$mode=$_POST['mode'] ?? 'Squad';

$match_date=$_POST['match_date'] ?? null;

$entry_fee=floatval($_POST['entry_fee'] ?? 0);

$prize_pool=floatval($_POST['prize_pool'] ?? 0);

$total_teams=intval($_POST['total_teams'] ?? 100);

$description=$_POST['description'] ?? '';



try{


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

(

?,?,?,?,?,?,?,?,?,'upcoming',?

)

");



$stmt->execute([

$title,

'PUBG Mobile',

$mode,

$map,

$entry_fee,

$prize_pool,

$total_teams,

0,

$match_date,

$description

]);



$message="Tournament created successfully";


}
catch(PDOException $e){


$error=$e->getMessage();


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

font-size:13px;

margin-bottom:7px;

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

color:black;

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




<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>


<?php if($error): ?>

<div class="error">

<?php echo $error; ?>

</div>

<?php endif; ?>






<div class="card">


<form method="post">



<label>

Tournament Name

</label>


<input

type="text"

name="title"

placeholder="Example: OPBattle Weekly Cup"

required

>




<div class="grid">


<div>

<label>

Map

</label>


<select name="map_name">


<option>Erangel</option>

<option>Miramar</option>

<option>Livik</option>

<option>Sanhok</option>


</select>

</div>




<div>


<label>

Mode

</label>


<select name="mode">


<option>Squad</option>

<option>Duo</option>

<option>Solo</option>


</select>


</div>


</div>





<label>

Match Date & Time

</label>


<input

type="datetime-local"

name="match_date"

required

>




<div class="grid">


<div>


<label>

Entry Fee

</label>


<input

type="number"

name="entry_fee"

placeholder="PKR"

required

>


</div>



<div>


<label>

Prize Pool

</label>


<input

type="number"

name="prize_pool"

placeholder="PKR"

required

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

name="total_teams"

value="100"

>


</div>



<div>


<label>

Qualified Teams

</label>


<input

type="number"

name="qualify_teams"

value="8"

>


</div>


</div>






<label>

Points Per Kill

</label>


<input

type="number"

name="kill_points"

value="2"

>




<label>

Description

</label>


<textarea

name="description"

rows="4"

placeholder="Tournament details">

</textarea>





<button name="create">

CREATE TOURNAMENT

</button>



</form>


</div>



</div>



</body>

</html>