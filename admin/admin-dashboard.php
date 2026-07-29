<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}


// COUNTS

$users = $pdo->query("
SELECT COUNT(*) 
FROM users
")->fetchColumn();


$tournaments = $pdo->query("
SELECT COUNT(*)
FROM tournaments
")->fetchColumn();


$matches = $pdo->query("
SELECT COUNT(*)
FROM matches
")->fetchColumn();


$results = $pdo->query("
SELECT COUNT(*)
FROM match_results
")->fetchColumn();



?>

<!DOCTYPE html>
<html>

<head>

<title>OpBattle Admin Dashboard</title>

<meta name="viewport" content="width=device-width,initial-scale=1">

<style>

body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}


.main{

margin-left:270px;

padding:35px;

}



h1{

font-size:32px;

}



.cards{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:20px;

margin-top:30px;

}



.card{

background:

rgba(255,255,255,.06);

border:1px solid rgba(255,255,255,.1);

padding:25px;

border-radius:20px;

}



.card h3{

color:#aaa;

font-size:14px;

}



.card h2{

font-size:32px;

color:#00ff84;

margin:10px 0;

}



.box{

margin-top:30px;

background:#111;

border-radius:20px;

padding:25px;

border:1px solid #222;

}



@media(max-width:1000px){


.main{

margin-left:0;

padding-top:80px;

}



.cards{

grid-template-columns:repeat(2,1fr);

}


}


@media(max-width:600px){


.cards{

grid-template-columns:1fr;

}


}



</style>


</head>


<body>


<?php include "admin-sidebar.php"; ?>



<div class="main">


<h1>

Welcome to OpBattle

</h1>


<p style="color:#999">

Tournament Control Panel

</p>



<div class="cards">



<div class="card">

<h3>
Total Users
</h3>

<h2>
<?=$users?>
</h2>

</div>



<div class="card">

<h3>
Tournaments
</h3>

<h2>
<?=$tournaments?>
</h2>

</div>




<div class="card">

<h3>
Matches
</h3>

<h2>
<?=$matches?>
</h2>

</div>



<div class="card">

<h3>
Results Submitted
</h3>

<h2>
<?=$results?>
</h2>

</div>



</div>





<div class="box">


<h2>
Quick Flow
</h2>


<p style="color:#bbb">

Create Tournament → Players Join → Close Entry → Match Plan → Results → Ranking → Prize

</p>


</div>



</div>


</body>

</html>