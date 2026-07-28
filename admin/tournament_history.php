<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: login.php");
exit;

}



$stmt=$pdo->query("

SELECT

t.*,

p.position,

p.amount,

tm.team_name


FROM tournaments t


LEFT JOIN prizes p

ON t.id=p.tournament_id


LEFT JOIN teams tm

ON p.team_id=tm.id



WHERE t.status='completed'


ORDER BY t.id DESC


");


$history=$stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Tournament History
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

font-size:32px;

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




.info{

display:grid;

grid-template-columns:repeat(3,1fr);

gap:15px;

margin-bottom:20px;

}



.box{

background:#161b22;

padding:15px;

border-radius:12px;

border:1px solid #1f2937;

}



.box span{

display:block;

color:#9ca3af;

font-size:12px;

}



.box strong{

color:#ccff00;

font-size:18px;

}





table{

width:100%;

border-collapse:collapse;

}



th{

background:#161b22;

padding:12px;

text-align:left;

color:#9ca3af;

}



td{

padding:12px;

border-bottom:1px solid #1f2937;

}





.rank{

color:#ccff00;

font-weight:bold;

}





@media(max-width:700px){


.info{

grid-template-columns:1fr;

}



table{

font-size:12px;

}


}



</style>


</head>



<body>



<div class="container">


<h1>

🏆 Tournament Archive

</h1>




<?php if(count($history)>0): ?>



<?php foreach($history as $h): ?>



<div class="card">



<div class="title">

<?php echo htmlspecialchars($h['title']); ?>

</div>




<div class="info">


<div class="box">

<span>

Status

</span>


<strong>

Completed

</strong>

</div>



<div class="box">

<span>

Date

</span>


<strong>

<?php echo date('d M Y',strtotime($h['match_date'])); ?>

</strong>

</div>




<div class="box">

<span>

Prize Pool

</span>


<strong>

PKR <?php echo number_format($h['prize_pool']); ?>

</strong>

</div>



</div>






<table>


<tr>

<th>
Position
</th>


<th>
Team
</th>


<th>
Prize
</th>


</tr>




<tr>


<td class="rank">

#<?php echo $h['position']; ?>

</td>


<td>

<?php echo htmlspecialchars($h['team_name']); ?>

</td>


<td>

PKR <?php echo number_format($h['amount']); ?>

</td>


</tr>



</table>




</div>



<?php endforeach; ?>



<?php else: ?>


<div class="card">

No completed tournaments found.

</div>



<?php endif; ?>





</div>


</body>

</html>