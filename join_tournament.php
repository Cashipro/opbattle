<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];

$message="";


$tournament_id=intval($_GET['id'] ?? 0);



if(!$tournament_id){

die("Tournament ID Missing");

}





/*
 JOIN TOURNAMENT
*/


if(isset($_POST['join'])){


$team_id=intval($_POST['team_id']);





// Tournament Check

$stmt=$pdo->prepare("

SELECT *

FROM tournaments

WHERE id=?

AND status='registration_open'

");


$stmt->execute([$tournament_id]);


$tournament=$stmt->fetch();




if(!$tournament){


$message="Tournament registration closed";


}

else{



// Team check


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE id=?

AND captain_id=?

AND verification_status='approved'

");


$stmt->execute([

$team_id,

$user_id

]);



$team=$stmt->fetch();



if(!$team){


$message="Invalid team selected";


}

else{



// Already joined?


$stmt=$pdo->prepare("

SELECT id

FROM teams

WHERE id=?

AND tournament_id=?

");


$stmt->execute([

$team_id,

$tournament_id

]);



if($stmt->fetch()){



$message="Team already registered";


}

else{


// count teams


$stmt=$pdo->prepare("

SELECT COUNT(*)

FROM teams

WHERE tournament_id=?

");


$stmt->execute([$tournament_id]);


$count=$stmt->fetchColumn();





if($count >= $tournament['total_teams']){


$message="Tournament slots are full";


}

else{



$stmt=$pdo->prepare("

UPDATE teams

SET tournament_id=?,

joined_at=NOW()

WHERE id=?

");


$stmt->execute([

$tournament_id,

$team_id

]);



$message="Team joined tournament successfully";



}



}



}



}



}






/*
 GET TEAMS

*/


$stmt=$pdo->prepare("

SELECT *

FROM teams

WHERE captain_id=?

AND verification_status='approved'

");


$stmt->execute([$user_id]);


$teams=$stmt->fetchAll();






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



?>



<!DOCTYPE html>

<html>

<head>

<title>

Join Tournament

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



.info{

background:#161b22;

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



label{

color:#9ca3af;

display:block;

margin-bottom:8px;

}



select{

width:100%;

padding:14px;

background:#161b22;

color:white;

border:1px solid #374151;

border-radius:12px;

margin-bottom:20px;

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



.alert{

background:#052e16;

padding:15px;

border-radius:12px;

color:#22c55e;

margin-bottom:20px;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 Join Tournament

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>





<div class="card">



<div class="info">


<strong>

<?php echo htmlspecialchars($tournament['title']); ?>

</strong>


<br><br>


Entry Fee:

<?php echo $tournament['entry_fee']; ?>


<br>


Prize Pool:

<?php echo $tournament['prize_pool']; ?>


<br>


Slots:

<?php echo $tournament['total_teams']; ?>


</div>





<form method="post">



<label>

Select Your Team

</label>



<select name="team_id" required>


<?php foreach($teams as $team): ?>


<option value="<?php echo $team['id']; ?>">


<?php echo htmlspecialchars($team['team_name']); ?>


</option>


<?php endforeach; ?>


</select>




<button name="join">

JOIN TOURNAMENT

</button>



</form>



</div>



</div>


</body>

</html>