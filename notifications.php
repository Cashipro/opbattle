<?php

require_once 'config.php';

session_start();


if(!isset($_SESSION['user_id'])){

header("Location: login.php");
exit;

}


$user_id=$_SESSION['user_id'];



$stmt=$pdo->prepare("

SELECT *

FROM notifications

WHERE user_id=?

OR user_id IS NULL

ORDER BY id DESC

");


$stmt->execute([$user_id]);


$notifications=$stmt->fetchAll();





// Mark as read

if(isset($_GET['read'])){


$id=intval($_GET['read']);



$stmt=$pdo->prepare("

UPDATE notifications

SET is_read=1

WHERE id=?

AND user_id=?

");


$stmt->execute([

$id,

$user_id

]);



header("Location: notifications.php");

exit;

}


?>



<!DOCTYPE html>

<html>

<head>

<title>

OPBattle Notifications

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

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:20px;

margin-bottom:15px;

}



.unread{

border-left:4px solid #ccff00;

}



.title{

font-size:20px;

font-weight:900;

color:#ccff00;

}



.message{

margin-top:10px;

color:#d1d5db;

}



.meta{

margin-top:15px;

font-size:12px;

color:#9ca3af;

}



.btn{

display:inline-block;

margin-top:15px;

padding:10px 15px;

background:#ccff00;

color:black;

border-radius:10px;

text-decoration:none;

font-weight:bold;

}



.empty{

text-align:center;

padding:40px;

background:#0f1319;

border-radius:20px;

}



</style>


</head>



<body>



<div class="container">



<h1>

🔔 Notifications

</h1>




<?php if(count($notifications)>0): ?>



<?php foreach($notifications as $n): ?>



<div class="card <?php echo $n['is_read']?'':'unread'; ?>">



<div class="title">

<?php echo htmlspecialchars($n['title']); ?>

</div>



<div class="message">

<?php echo nl2br(htmlspecialchars($n['message'])); ?>

</div>



<div class="meta">

Type:

<?php echo strtoupper($n['type']); ?>

<br>

<?php echo date('d M Y h:i A',strtotime($n['created_at'])); ?>

</div>




<?php if(!$n['is_read']): ?>


<a class="btn"

href="?read=<?php echo $n['id']; ?>">

MARK READ

</a>


<?php endif; ?>




</div>



<?php endforeach; ?>



<?php else: ?>



<div class="empty">

<h2>

No Notifications

</h2>

<p>

Updates will appear here.

</p>

</div>



<?php endif; ?>



</div>


</body>

</html>