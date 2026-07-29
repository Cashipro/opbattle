<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



// GET TOURNAMENTS

$stmt=$pdo->query("

SELECT *

FROM tournaments

ORDER BY id DESC

");


$tournaments=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>

<title>Tournament Manage - OpBattle</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}


.main{

margin-left:280px;

padding:35px;

}



.card{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:25px;

margin-bottom:20px;

}



h1{

color:#00ff84;

}



.info{

color:#aaa;

margin:8px 0;

}



.status{

color:#00ff84;

font-weight:bold;

}



.actions{

display:flex;

gap:10px;

flex-wrap:wrap;

margin-top:20px;

}



.btn{

padding:12px 18px;

border-radius:12px;

background:#00ff84;

color:#000;

text-decoration:none;

font-weight:bold;

font-size:13px;

}



.btn.dark{

background:#222;

color:white;

}



@media(max-width:1000px){


.main{

margin-left:0;

padding-top:80px;

}


}



</style>


</head>


<body>


<?php include "admin-sidebar.php"; ?>



<div class="main">


<h1>

Manage Tournaments

</h1>



<?php foreach($tournaments as $t){ ?>


<div class="card">


<h2>

<?=htmlspecialchars($t['name'])?>

</h2>



<div class="info">

Entry Fee:
$<?=$t['entry_fee']?>

</div>



<div class="info">

Prize Pool:
$<?=$t['prize_pool']?>

</div>



<div class="info">

Status:

<span class="status">

<?=$t['status']?>

</span>

</div>





<div class="actions">


<a class="btn"

href="match-plan.php?tournament_id=<?=$t['id']?>">

Match Plan

</a>




<a class="btn dark"

href="ranking.php?tournament_id=<?=$t['id']?>">

Ranking

</a>




<a class="btn dark"

href="prize-distribution.php?tournament_id=<?=$t['id']?>">

Prize Distribution

</a>




</div>



</div>


<?php } ?>



</div>


</body>

</html>