<?php

require_once 'config.php';


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];





/*
 UPCOMING MATCHES
*/


$stmt=$pdo->prepare("

SELECT

t.*,

tr.title,

tr.map_name,

tr.match_date,

tr.entry_fee,

tr.prize_pool


FROM teams t


JOIN tournaments tr

ON t.tournament_id=tr.id



WHERE

t.player_1=?

OR t.player_2=?

OR t.player_3=?

OR t.player_4=?



AND tr.status!='completed'


ORDER BY tr.match_date ASC


");



$stmt->execute([

$user_id

]);


$upcoming=$stmt->fetchAll();






/*
 COMPLETED MATCHES
*/


$stmt=$pdo->prepare("

SELECT


mr.*,

tr.title,

t.team_name


FROM match_results mr


JOIN teams t

ON mr.team_id=t.id


JOIN tournaments tr

ON mr.tournament_id=tr.id



WHERE


t.player_1=?

OR t.player_2=?

OR t.player_3=?

OR t.player_4=?



ORDER BY mr.id DESC


");


$stmt->execute([

$user_id

]);



$history=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>
OPBattle My Matches
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

max-width:1100px;

margin:40px auto;

padding:20px;

}



h1,h2{

color:#ccff00;

}





.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:18px;

padding:25px;

margin-bottom:25px;

}





.match-box{

background:#161b22;

border-radius:14px;

padding:20px;

margin-bottom:15px;

border:1px solid #1f2937;

}



.title{

font-size:22px;

font-weight:900;

}



.row{

display:flex;

justify-content:space-between;

margin-top:12px;

color:#9ca3af;

}



.row strong{

color:white;

}



.room{

margin-top:15px;

background:#052e16;

border:1px solid #22c55e;

padding:15px;

border-radius:12px;

}



.room span{

color:#22c55e;

font-weight:bold;

}



.result{

color:#ccff00;

font-weight:bold;

}



.empty{

color:#9ca3af;

padding:20px;

text-align:center;

}



@media(max-width:700px){


.row{

display:block;

line-height:30px;

}


}


</style>


</head>


<body>


<div class="container">





<h1>

🎮 My Matches

</h1>





<div class="card">


<h2>

Upcoming Matches

</h2>



<?php if(count($upcoming)): ?>



<?php foreach($upcoming as $m): ?>



<div class="match-box">



<div class="title">

<?php echo htmlspecialchars($m['title']); ?>

</div>




<div class="row">

<span>
Map
</span>


<strong>

<?php echo $m['map_name']; ?>

</strong>

</div>



<div class="row">

<span>
Match Time
</span>


<strong>

<?php echo date('d M Y h:i A',strtotime($m['match_date'])); ?>

</strong>

</div>




<div class="row">

<span>
Team
</span>


<strong>

<?php echo htmlspecialchars($m['team_name']); ?>

</strong>

</div>





<?php if(!empty($m['room_id'])): ?>

<div class="room">

Room ID:

<span>

<?php echo htmlspecialchars($m['room_id']); ?>

</span>

<br>


Password:

<span>

<?php echo htmlspecialchars($m['room_password']); ?>

</span>


</div>

<?php else: ?>


<div class="room">

Room details will be available before match

</div>


<?php endif; ?>




</div>



<?php endforeach; ?>



<?php else: ?>


<div class="empty">

No upcoming matches

</div>


<?php endif; ?>



</div>








<div class="card">


<h2>

Match History

</h2>



<?php if(count($history)): ?>



<?php foreach($history as $h): ?>


<div class="match-box">


<div class="title">

<?php echo htmlspecialchars($h['title']); ?>

</div>



<div class="row">

<span>
Team
</span>


<strong>

<?php echo htmlspecialchars($h['team_name']); ?>

</strong>


</div>



<div class="row">

<span>
Kills
</span>


<strong>

<?php echo $h['kills']; ?>

</strong>


</div>



<div class="row">

<span>
Rank
</span>


<strong class="result">

#<?php echo $h['rank_position']; ?>

</strong>


</div>



<div class="row">

<span>
Points
</span>


<strong>

<?php echo $h['total_points']; ?>

</strong>


</div>



</div>



<?php endforeach; ?>



<?php else: ?>


<div class="empty">

No match history available

</div>


<?php endif; ?>



</div>




</div>


</body>

</html>