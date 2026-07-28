<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: login.php");
exit;

}



$message="";



/*
 SAVE RESULT
*/


if(isset($_POST['save_result'])){


$tournament_id=intval($_POST['tournament_id']);

$team_id=intval($_POST['team_id']);

$rank=intval($_POST['rank_position']);

$kills=intval($_POST['kills']);





/*
 PLACEMENT POINTS
*/


$placement=[

1=>15,
2=>12,
3=>10,
4=>8,
5=>6,
6=>4,
7=>2

];



$placement_points=$placement[$rank] ?? 1;




/*
 TOTAL SCORE

*/


$kill_points=$kills*2;


$total_points=$placement_points+$kill_points;






$stmt=$pdo->prepare("

INSERT INTO match_results

(

tournament_id,

team_id,

rank_position,

kills,

placement_points,

total_points

)

VALUES(?,?,?,?,?,?)

");



$stmt->execute([


$tournament_id,

$team_id,

$rank,

$kills,

$placement_points,

$total_points


]);




$message="Match result saved successfully";



}






/*
 TOURNAMENT LIST
*/


$tournaments=$pdo->query("

SELECT *

FROM tournaments

WHERE status!='completed'

ORDER BY id DESC

")->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>
OPBattle Match Result
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

font-size:13px;

}



input,select{


width:100%;

padding:14px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

margin-bottom:18px;


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




</style>


</head>


<body>



<div class="container">



<h1>

🎮 Match Result Entry

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

Team ID

</label>


<input

type="number"

name="team_id"

placeholder="Enter Team ID"

required

>






<label>

Team Rank

</label>


<select name="rank_position">


<?php for($i=1;$i<=25;$i++): ?>


<option value="<?php echo $i; ?>">

Rank #<?php echo $i; ?>

</option>


<?php endfor; ?>


</select>






<label>

Kills

</label>


<input

type="number"

name="kills"

min="0"

value="0"

>





<button name="save_result">

SAVE RESULT

</button>



</form>



</div>




</div>


</body>

</html>