<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];



// USER JOINED TOURNAMENTS

$stmt=$pdo->prepare("

SELECT DISTINCT

t.id,
t.name,
t.entry_fee,
t.status,
ts.team_number

FROM tournament_slots ts

JOIN tournaments t

ON t.id=ts.tournament_id

WHERE ts.user_id=?

ORDER BY t.id DESC

");


$stmt->execute([$user_id]);


$tournaments=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>My Tournaments - OpBattle</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.container{

padding:30px;

}



h1{

color:#00ff84;

}



.grid{

display:grid;

grid-template-columns:repeat(3,1fr);

gap:20px;

}



.card{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:25px;

}



.title{

font-size:22px;

font-weight:bold;

}



.info{

margin-top:12px;

color:#aaa;

}



.green{

color:#00ff84;

}



.btn{

display:block;

margin-top:20px;

padding:12px;

background:#00ff84;

color:#000;

text-align:center;

border-radius:12px;

text-decoration:none;

font-weight:bold;

}



.empty{

background:#111;

padding:30px;

border-radius:20px;

color:#888;

text-align:center;

}



@media(max-width:900px){

.grid{

grid-template-columns:1fr;

}

}


</style>


</head>


<body>


<div class="container">


<h1>

My Tournaments

</h1>



<?php if(empty($tournaments)){ ?>


<div class="empty">

You have not joined any tournament yet.

</div>


<?php } ?>




<div class="grid">



<?php foreach($tournaments as $t){ ?>



<div class="card">


<div class="title">

<?=htmlspecialchars($t['name'])?>

</div>



<div class="info">

Entry Fee:

<span class="green">

$<?=$t['entry_fee']?>

</span>

</div>



<div class="info">

Your Team Number:

<span class="green">

#<?=$t['team_number']?>

</span>

</div>



<div class="info">

Status:

<span class="green">

<?=$t['status']?>

</span>

</div>



<a class="btn"

href="tournament-room.php?id=<?=$t['id']?>">

View Team Room

</a>



</div>


<?php } ?>



</div>


</div>


</body>

</html>