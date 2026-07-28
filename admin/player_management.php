<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}


$message="";


/*
 BLOCK / ACTIVE PLAYER
*/


if(isset($_GET['status'])){


$id=intval($_GET['id']);

$status=$_GET['status'];



$stmt=$pdo->prepare("

UPDATE users

SET account_status=?

WHERE id=?

");


$stmt->execute([

$status,

$id

]);


$message="Player status updated";



}




/*
 SEARCH
*/


$search=$_GET['search'] ?? '';



$stmt=$pdo->prepare("

SELECT *

FROM users

WHERE

name LIKE ?

OR email LIKE ?

OR pubg_uid LIKE ?

ORDER BY id DESC

");



$searchTerm="%".$search."%";


$stmt->execute([

$searchTerm,

$searchTerm,

$searchTerm

]);



$players=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Players

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



h1{

color:#ccff00;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:20px;

overflow:auto;

}



input{

width:100%;

padding:14px;

background:#161b22;

border:1px solid #374151;

border-radius:12px;

color:white;

margin-bottom:20px;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:15px;

text-align:left;

color:#9ca3af;

}



td{

padding:15px;

border-bottom:1px solid #1f2937;

}



.uid{

color:#60a5fa;

}



.active{

color:#22c55e;

font-weight:bold;

}



.blocked{

color:#ef4444;

font-weight:bold;

}



.btn{

padding:8px 12px;

border-radius:10px;

text-decoration:none;

font-weight:bold;

}



.block{

background:#ef4444;

color:white;

}



.unblock{

background:#22c55e;

color:black;

}



.alert{

background:#052e16;

padding:15px;

border-radius:12px;

color:#22c55e;

margin-bottom:20px;

}



</style>


</head>



<body>



<div class="container">



<h1>

👥 Player Management

</h1>




<?php if($message): ?>


<div class="alert">

<?php echo $message; ?>

</div>


<?php endif; ?>





<div class="card">



<form method="get">


<input

type="text"

name="search"

placeholder="Search name, email, PUBG UID"

value="<?php echo htmlspecialchars($search); ?>"

>


</form>






<table>



<tr>

<th>

ID

</th>


<th>

Player

</th>


<th>

PUBG UID

</th>


<th>

Status

</th>


<th>

Action

</th>

</tr>





<?php foreach($players as $p): ?>



<tr>



<td>

<?php echo $p['id']; ?>

</td>



<td>

<?php echo htmlspecialchars($p['name']); ?>

<br>

<small>

<?php echo htmlspecialchars($p['email']); ?>

</small>

</td>



<td class="uid">

<?php echo htmlspecialchars($p['pubg_uid'] ?? 'N/A'); ?>

</td>



<td class="<?php echo $p['account_status'] ?? 'active'; ?>">

<?php echo strtoupper($p['account_status'] ?? 'active'); ?>

</td>



<td>



<?php if(($p['account_status'] ?? 'active')=='active'): ?>


<a class="btn block"

href="?status=blocked&id=<?php echo $p['id']; ?>">

BLOCK

</a>


<?php else: ?>


<a class="btn unblock"

href="?status=active&id=<?php echo $p['id']; ?>">

UNBLOCK

</a>


<?php endif; ?>


</td>



</tr>



<?php endforeach; ?>



</table>



</div>



</div>


</body>

</html>