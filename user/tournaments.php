<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}




// UPCOMING TOURNAMENTS

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

<title>OpBattle Tournaments</title>

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

padding:25px;

border-radius:20px;

}



.card h2{

margin-top:0;

}



.info{

color:#aaa;

margin:10px 0;

}



.green{

color:#00ff84;

font-weight:bold;

}



.btn{

display:block;

background:#00ff84;

color:#000;

text-align:center;

padding:13px;

border-radius:12px;

text-decoration:none;

font-weight:bold;

margin-top:20px;

}



.empty{

background:#111;

padding:30px;

border-radius:20px;

text-align:center;

color:#888;

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

Available Tournaments

</h1>



<?php if(empty($tournaments)){ ?>


<div class="empty">

No Tournament Available

</div>


<?php } ?>




<div class="grid">


<?php foreach($tournaments as $t){ ?>


<div class="card">


<h2>

<?=htmlspecialchars($t['name'])?>

</h2>


<div class="info">

Entry Fee:

<span class="green">

$ <?=$t['entry_fee']?>

</span>

</div>



<div class="info">

Prize Pool:

<span class="green">

$ <?=$t['prize_pool']?>

</span>

</div>



<a class="btn"

href="tournament-room.php?id=<?=$t['id']?>">

Join Tournament

</a>



</div>


<?php } ?>


</div>


</div>



</body>

</html>