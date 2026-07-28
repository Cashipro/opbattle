<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



/*
 GET LOGS

*/


$stmt=$pdo->query("


SELECT

a.*,

u.name AS user_name,

ad.name AS admin_name



FROM activity_logs a



LEFT JOIN users u

ON a.user_id=u.id



LEFT JOIN admins ad

ON a.admin_id=ad.id



ORDER BY a.id DESC



LIMIT 200



");



$logs=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Activity Logs

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

border-radius:20px;

padding:20px;

overflow:auto;

border:1px solid #1f2937;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:15px;

color:#9ca3af;

text-align:left;

}



td{

padding:15px;

border-bottom:1px solid #1f2937;

}



.action{

color:#ccff00;

font-weight:bold;

}



.time{

color:#60a5fa;

font-size:13px;

}



</style>


</head>



<body>



<div class="container">



<h1>

📋 Activity Logs

</h1>




<div class="card">



<table>



<tr>

<th>

Actor

</th>


<th>

Action

</th>


<th>

Description

</th>


<th>

Time

</th>

</tr>




<?php foreach($logs as $log): ?>


<tr>



<td>


<?php 

echo htmlspecialchars(

$log['admin_name']

??

$log['user_name']

??

'System'

);

?>


</td>




<td class="action">


<?php echo htmlspecialchars($log['action']); ?>


</td>




<td>


<?php echo htmlspecialchars($log['description']); ?>


</td>




<td class="time">


<?php echo date(

'd M Y h:i A',

strtotime($log['created_at'])

); ?>


</td>




</tr>


<?php endforeach; ?>



</table>



</div>



</div>


</body>

</html>