<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

session_start();

require_once 'config.php';



$stmt=$pdo->query("

SELECT *

FROM tournaments

WHERE status='upcoming'

ORDER BY id DESC

");


$tournaments=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>
OPBattle Tournaments
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

max-width:1200px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

font-size:36px;

}



.subtitle{

color:#9ca3af;

margin-bottom:30px;

}



.grid{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(300px,1fr));

gap:20px;

}



.card{

background:#0f1319;

border:1px solid #252525;

border-radius:22px;

padding:25px;

transition:.3s;

}



.card:hover{

transform:translateY(-5px);

border-color:#ccff00;

}



.title{

font-size:24px;

font-weight:900;

color:#ccff00;

margin-bottom:15px;

}



.box{

background:#161b22;

padding:14px;

border-radius:12px;

margin:10px 0;

}



.label{

color:#9ca3af;

font-size:12px;

}



.value{

font-size:18px;

font-weight:bold;

}



.status{

display:inline-block;

padding:8px 15px;

border-radius:20px;

font-size:12px;

font-weight:bold;

margin-bottom:15px;

}



.open{

background:#052e16;

color:#22c55e;

}



.locked{

background:#450a0a;

color:#ff7777;

}



.join{

display:block;

margin-top:20px;

padding:14px;

background:#ccff00;

color:black;

text-align:center;

text-decoration:none;

border-radius:12px;

font-weight:900;

}



.disabled{

display:block;

margin-top:20px;

padding:14px;

background:#333;

color:#999;

text-align:center;

border-radius:12px;

font-weight:bold;

}



.empty{

background:#0f1319;

padding:40px;

border-radius:20px;

text-align:center;

}



@media(max-width:600px){

h1{

font-size:28px;

}

}



</style>


</head>



<body>


<div class="container">



<h1>
🎮 OPBattle Tournaments
</h1>



<p class="subtitle">

Join tournaments and compete for prizes.

</p>




<div class="grid">



<?php if(count($tournaments)>0){ ?>



<?php foreach($tournaments as $t){ ?>



<div class="card">


<div class="title">

<?php echo htmlspecialchars($t['title']); ?>

</div>




<?php 

if(isset($t['registration_status']) 
&& 
$t['registration_status']=='locked'){


?>

<div class="status locked">

🔒 LOCKED

</div>


<?php }else{ ?>


<div class="status open">

🟢 OPEN

</div>


<?php } ?>





<div class="box">

<div class="label">
GAME
</div>

<div class="value">

<?php echo htmlspecialchars($t['game_name']); ?>

</div>

</div>




<div class="box">

<div class="label">
MAP
</div>

<div class="value">

<?php echo htmlspecialchars($t['map_name']); ?>

</div>

</div>




<div class="box">

<div class="label">
ENTRY FEE
</div>

<div class="value">

PKR <?php echo number_format($t['entry_fee']); ?>

</div>

</div>




<div class="box">

<div class="label">
PRIZE POOL
</div>

<div class="value">

PKR <?php echo number_format($t['prize_pool']); ?>

</div>

</div>




<div class="box">

<div class="label">
TOTAL TEAMS
</div>

<div class="value">

<?php echo $t['total_slots']; ?>

</div>

</div>




<div class="box">

<div class="label">
MATCH DATE
</div>

<div class="value">

<?php 

if($t['tournament_date']){

echo date(
"d M Y h:i A",
strtotime($t['tournament_date'])
);

}
else{

echo "Not Set";

}

?>

</div>

</div>




<?php

if(
!isset($t['registration_status'])
||
$t['registration_status']=='open'

){

?>

<a class="join"

href="join_tournament.php?tournament=<?php echo $t['id']; ?>">

JOIN TOURNAMENT

</a>


<?php

}else{

?>


<div class="disabled">

REGISTRATION CLOSED

</div>


<?php } ?>




</div>



<?php } ?>



<?php }else{ ?>



<div class="empty">

<h2>

No Tournament Available

</h2>


<p>

New tournaments coming soon.

</p>


</div>



<?php } ?>



</div>


</div>


</body>

</html>
