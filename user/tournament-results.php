<?php

session_start();

require_once "../config.php";




// TOURNAMENT LIST

$stmt=$pdo->query("

SELECT *

FROM tournaments

WHERE status IN ('live','completed')

ORDER BY id DESC

");


$tournaments=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>

<title>OpBattle Tournament Results</title>

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



.btn{

display:inline-block;

margin-top:15px;

background:#00ff84;

color:black;

padding:12px 20px;

border-radius:12px;

text-decoration:none;

font-weight:bold;

}



.status{

color:#00ff84;

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

Tournament Results

</h1>



<div class="grid">


<?php foreach($tournaments as $t){ ?>



<div class="card">


<h2>

<?=htmlspecialchars($t['name'])?>

</h2>


<p>

Entry Fee:
$ <?=$t['entry_fee']?>

</p>


<p class="status">

<?=$t['status']?>

</p>



<a class="btn"

href="view-results.php?id=<?=$t['id']?>">

View Results

</a>



</div>



<?php } ?>


</div>


</div>



</body>

</html>