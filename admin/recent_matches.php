<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



/*
 RECENT MATCHES
*/


$stmt=$pdo->query("


SELECT


m.*,


t.title AS tournament_name,


r.room_name



FROM matches m



LEFT JOIN tournaments t

ON m.tournament_id=t.id



LEFT JOIN tournament_rooms r

ON m.room_id=r.id



ORDER BY m.id DESC



LIMIT 50



");


$matches=$stmt->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Recent Matches

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



.completed{

color:#22c55e;

font-weight:bold;

}



.pending{

color:#fbbf24;

font-weight:bold;

}



.live{

color:#60a5fa;

font-weight:bold;

}



</style>


</head>



<body>



<div class="container">



<h1>

🎮 Recent Matches

</h1>



<div class="card">



<table>



<tr>

<th>

Tournament

</th>


<th>

Room

</th>


<th>

Status

</th>


<th>

Date

</th>

</tr>



<?php foreach($matches as $m): ?>

<tr>


<td>

<?php echo htmlspecialchars($m['tournament_name'] ?? 'N/A'); ?>

</td>



<td>

<?php echo htmlspecialchars($m['room_name'] ?? 'Not Assigned'); ?>

</td>



<td class="<?php echo $m['status'] ?? 'pending'; ?>">


<?php echo strtoupper($m['status'] ?? 'pending'); ?>


</td>



<td>

<?php echo date('d M Y',strtotime($m['created_at'])); ?>

</td>


</tr>


<?php endforeach; ?>



</table>



</div>



</div>



</body>

</html>