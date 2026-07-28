<?php

require_once 'config.php';

session_start();



/*
 GET AVAILABLE TOURNAMENTS
*/


$stmt=$pdo->query("

SELECT

t.*,

COUNT(tm.id) AS joined_teams


FROM tournaments t


LEFT JOIN teams tm

ON t.id=tm.tournament_id


WHERE t.status='registration_open'


GROUP BY t.id


ORDER BY t.id DESC


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

font-size:34px;

}





.grid{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(300px,1fr));

gap:20px;

}





.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

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



.info{

background:#161b22;

padding:15px;

border-radius:12px;

margin-bottom:10px;

}



.label{

color:#9ca3af;

font-size:12px;

}



.value{

font-size:18px;

font-weight:bold;

margin-top:5px;

}





.badge{

display:inline-block;

padding:8px 14px;

background:#052e16;

color:#22c55e;

border-radius:20px;

font-size:12px;

font-weight:bold;

}





.join{

display:block;

text-align:center;

margin-top:20px;

padding:14px;

background:#ccff00;

color:black;

text-decoration:none;

border-radius:12px;

font-weight:900;

}





.empty{

background:#0f1319;

padding:40px;

border-radius:20px;

text-align:center;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 Available Tournaments

</h1>



<p style="color:#9ca3af">

Join PUBG tournaments and compete for prizes.

</p>






<div class="grid">



<?php if(count($tournaments)>0): ?>



<?php foreach($tournaments as $t): ?>



<div class="card">



<div class="title">

<?php echo htmlspecialchars($t['title']); ?>

</div>




<div class="badge">

REGISTRATION OPEN

</div>




<div class="info">

<div class="label">

ENTRY FEE

</div>


<div class="value">

PKR <?php echo number_format($t['entry_fee']); ?>

</div>

</div>






<div class="info">

<div class="label">

PRIZE POOL

</div>


<div class="value">

PKR <?php echo number_format($t['prize_pool']); ?>

</div>

</div>







<div class="info">

<div class="label">

TEAMS

</div>


<div class="value">

<?php echo $t['joined_teams']; ?>

/

<?php echo $t['total_teams']; ?>

</div>

</div>







<div class="info">

<div class="label">

MAP

</div>


<div class="value">

<?php echo htmlspecialchars($t['map_name']); ?>

</div>

</div>







<a class="join"

href="team_create.php?tournament=<?php echo $t['id']; ?>">

JOIN TOURNAMENT

</a>





</div>



<?php endforeach; ?>



<?php else: ?>



<div class="empty">

<h2>

No Tournament Available

</h2>


<p>

New tournaments will appear here.

</p>


</div>



<?php endif; ?>



</div>



</div>


</body>

</html>