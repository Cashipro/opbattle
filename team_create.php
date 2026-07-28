<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}



$message="";



$user_id=$_SESSION['user_id'];



/*
 CREATE TEAM
*/


if(isset($_POST['create_team'])){


$tournament_id=intval($_POST['tournament_id']);

$team_name=trim($_POST['team_name']);



$player2=intval($_POST['player_2'] ?? 0);

$player3=intval($_POST['player_3'] ?? 0);

$player4=intval($_POST['player_4'] ?? 0);





$stmt=$pdo->prepare("

SELECT id

FROM teams

WHERE captain_id=?

AND tournament_id=?

");


$stmt->execute([

$user_id,

$tournament_id

]);



if($stmt->fetch()){


$message="You already created a team for this tournament";


}

else{



$stmt=$pdo->prepare("

INSERT INTO teams

(

tournament_id,

team_name,

captain_id,

player_1,

player_2,

player_3,

player_4

)

VALUES(?,?,?,?,?,?,?)

");



$stmt->execute([


$tournament_id,

$team_name,

$user_id,

$user_id,

$player2 ?: NULL,

$player3 ?: NULL,

$player4 ?: NULL


]);



$message="Team created. Waiting for verification.";

}



}





/*
 AVAILABLE TOURNAMENTS
*/


$tournaments=$pdo->query("

SELECT *

FROM tournaments

WHERE status='registration_open'

ORDER BY id DESC

")->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
Create PUBG Team
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

max-width:700px;

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

padding:25px;

}



.alert{

background:#052e16;

color:#22c55e;

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



label{

display:block;

color:#9ca3af;

margin-bottom:7px;

}



input,select{


width:100%;

padding:14px;

margin-bottom:18px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

}



button{

width:100%;

padding:15px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:900;

color:black;

cursor:pointer;

}



.player-box{

background:#161b22;

padding:15px;

border-radius:12px;

margin-bottom:15px;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 Create Your Team

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>




<div class="card">


<form method="post">



<label>

Select Tournament

</label>


<select name="tournament_id" required>


<?php foreach($tournaments as $t): ?>


<option value="<?php echo $t['id']; ?>">


<?php echo htmlspecialchars($t['title']); ?>


</option>


<?php endforeach; ?>


</select>





<label>

Team Name

</label>


<input

type="text"

name="team_name"

placeholder="Your Team Name"

required

>





<div class="player-box">


<label>

Player 2 User ID

</label>


<input

type="number"

name="player_2"

placeholder="User ID"

>


</div>





<div class="player-box">


<label>

Player 3 User ID

</label>


<input

type="number"

name="player_3"

placeholder="User ID"

>


</div>





<div class="player-box">


<label>

Player 4 User ID

</label>


<input

type="number"

name="player_4"

placeholder="User ID"

>


</div>





<button name="create_team">

CREATE TEAM

</button>



</form>


</div>



</div>


</body>

</html>