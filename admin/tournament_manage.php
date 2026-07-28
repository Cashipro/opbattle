<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: login.php");
exit;

}


$message="";



/*
 UPDATE TOURNAMENT STATUS
*/


if(isset($_POST['update_status'])){


$id=intval($_POST['id']);

$status=$_POST['status'];



$stmt=$pdo->prepare("

UPDATE tournaments

SET status=?

WHERE id=?

");


$stmt->execute([

$status,

$id

]);



$message="Tournament status updated";

}




/*
 UPDATE SETTINGS
*/


if(isset($_POST['update_settings'])){


$id=intval($_POST['id']);

$total=intval($_POST['total_teams']);

$qualify=intval($_POST['qualify_teams']);



$stmt=$pdo->prepare("

UPDATE tournaments

SET

total_teams=?,

qualify_teams=?

WHERE id=?

");


$stmt->execute([

$total,

$qualify,

$id

]);



$message="Tournament settings updated";

}




/*
 GET TOURNAMENTS
*/


$tournaments=$pdo->query("

SELECT *

FROM tournaments

ORDER BY id DESC

")->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Tournament Manager
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

max-width:1100px;

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

margin-bottom:20px;

}



.title{

font-size:22px;

font-weight:900;

margin-bottom:15px;

}



.row{

display:flex;

gap:15px;

margin-bottom:15px;

flex-wrap:wrap;

}



input,select{

padding:13px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

flex:1;

}



button{

background:#ccff00;

color:black;

border:0;

padding:13px 20px;

border-radius:10px;

font-weight:900;

cursor:pointer;

}



.status{

padding:8px 15px;

border-radius:20px;

background:#052e16;

color:#22c55e;

display:inline-block;

font-size:12px;

font-weight:bold;

margin-bottom:15px;

}



.alert{

background:#052e16;

border:1px solid #22c55e;

padding:15px;

border-radius:10px;

color:#22c55e;

margin-bottom:20px;

}



</style>


</head>


<body>



<div class="container">



<h1>

🎮 OPBattle Tournament Control

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>





<?php foreach($tournaments as $t): ?>



<div class="card">


<div class="title">

<?php echo htmlspecialchars($t['title']); ?>

</div>



<div class="status">

<?php echo strtoupper($t['status']); ?>

</div>



<form method="post">


<input type="hidden" name="id" value="<?php echo $t['id']; ?>">



<div class="row">


<select name="status">


<option value="upcoming">

Upcoming

</option>


<option value="registration_open">

Registration Open

</option>


<option value="started">

Started

</option>


<option value="completed">

Completed

</option>


</select>



<button name="update_status">

UPDATE STATUS

</button>



</div>



</form>





<form method="post">


<input type="hidden" name="id" value="<?php echo $t['id']; ?>">



<div class="row">


<input

type="number"

name="total_teams"

value="<?php echo $t['total_teams'] ?? 100; ?>"

placeholder="Total Teams"

>



<input

type="number"

name="qualify_teams"

value="<?php echo $t['qualify_teams'] ?? 8; ?>"

placeholder="Qualify Teams"

>



<button name="update_settings">

SAVE SETTINGS

</button>


</div>



</form>



</div>



<?php endforeach; ?>




</div>


</body>

</html>