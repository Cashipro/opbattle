<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



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

<title>Tournaments - OpBattle</title>

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



.top{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:25px;

}



.create{

background:#00ff84;

color:black;

padding:12px 20px;

border-radius:12px;

text-decoration:none;

font-weight:bold;

}



.box{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:25px;

}



table{

width:100%;

border-collapse:collapse;

}



th{

text-align:left;

color:#00ff84;

padding:15px;

}



td{

padding:15px;

border-bottom:1px solid #222;

}



.status{

padding:6px 12px;

border-radius:20px;

background:#222;

}



.manage{

background:#00ff84;

color:black;

padding:8px 15px;

border-radius:10px;

text-decoration:none;

font-weight:bold;

}



@media(max-width:1000px){


.main{

margin-left:0;

padding-top:80px;

}



.top{

flex-direction:column;

align-items:flex-start;

gap:15px;

}


}



</style>


</head>


<body>


<?php include "admin-sidebar.php"; ?>



<div class="main">



<div class="top">


<h1>
Tournaments
</h1>



<a href="tournament-create.php" class="create">

+ Create Tournament

</a>


</div>




<div class="box">


<table>


<tr>

<th>
Name
</th>

<th>
Entry Fee
</th>

<th>
Prize Pool
</th>

<th>
Status
</th>

<th>
Action
</th>

</tr>



<?php foreach($tournaments as $t){ ?>


<tr>


<td>

<?=htmlspecialchars($t['name'])?>

</td>



<td>

$ <?=$t['entry_fee']?>

</td>



<td>

$ <?=$t['prize_pool']?>

</td>



<td>

<span class="status">

<?=$t['status']?>

</span>

</td>



<td>


<a class="manage"

href="tournament-manage.php?id=<?=$t['id']?>">

Manage

</a>


</td>



</tr>


<?php } ?>



</table>


</div>


</div>


</body>

</html>