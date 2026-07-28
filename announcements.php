<?php

require_once 'config.php';

session_start();



$announcements=$pdo->query("

SELECT *

FROM announcements

ORDER BY id DESC

")->fetchAll();



?>


<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Announcements

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

max-width:900px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

font-size:35px;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:22px;

padding:25px;

margin-bottom:20px;

}



.title{

font-size:24px;

font-weight:900;

color:#ccff00;

}



.desc{

margin-top:15px;

color:#d1d5db;

line-height:1.7;

}



.date{

margin-top:15px;

color:#60a5fa;

font-size:13px;

}



.empty{

background:#0f1319;

padding:40px;

text-align:center;

border-radius:20px;

}



</style>


</head>



<body>



<div class="container">



<h1>

📢 Latest Announcements

</h1>




<?php if(count($announcements)>0): ?>



<?php foreach($announcements as $a): ?>


<div class="card">



<div class="title">

<?php echo htmlspecialchars($a['title']); ?>

</div>



<div class="desc">

<?php echo nl2br(htmlspecialchars($a['description'])); ?>

</div>



<div class="date">

<?php echo date(

'd M Y h:i A',

strtotime($a['created_at'])

); ?>

</div>



</div>



<?php endforeach; ?>




<?php else: ?>



<div class="empty">

<h2>

No Announcements

</h2>

<p>

Tournament updates will appear here.

</p>

</div>


<?php endif; ?>



</div>



</body>

</html>