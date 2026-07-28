<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$message="";



/*
 CREATE ANNOUNCEMENT
*/


if(isset($_POST['create'])){


$title=trim($_POST['title']);

$description=trim($_POST['description']);



$stmt=$pdo->prepare("

INSERT INTO announcements

(title,description)

VALUES(?,?)

");


$stmt->execute([

$title,

$description

]);


$message="Announcement created";

}




/*
 DELETE
*/


if(isset($_GET['delete'])){


$id=intval($_GET['delete']);


$stmt=$pdo->prepare("

DELETE FROM announcements

WHERE id=?

");


$stmt->execute([$id]);


$message="Announcement deleted";


}





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

}



.card{

background:#0f1319;

padding:25px;

border-radius:20px;

border:1px solid #1f2937;

margin-bottom:20px;

}



input,textarea{

width:100%;

padding:14px;

margin-bottom:15px;

background:#161b22;

border:1px solid #374151;

border-radius:12px;

color:white;

}



textarea{

height:120px;

}



button{

background:#ccff00;

color:black;

border:0;

padding:14px;

border-radius:12px;

font-weight:900;

width:100%;

}



.item{

background:#161b22;

padding:20px;

border-radius:15px;

margin-top:15px;

}



.title{

color:#ccff00;

font-size:20px;

font-weight:bold;

}



.delete{

display:inline-block;

margin-top:15px;

background:#ef4444;

color:white;

padding:8px 15px;

border-radius:10px;

text-decoration:none;

}



.alert{

background:#052e16;

padding:15px;

border-radius:12px;

color:#22c55e;

}



</style>


</head>



<body>



<div class="container">



<h1>

📢 Announcements

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>




<div class="card">


<form method="post">


<input

type="text"

name="title"

placeholder="Announcement title"

required

>



<textarea

name="description"

placeholder="Write announcement"

required></textarea>



<button name="create">

CREATE ANNOUNCEMENT

</button>



</form>


</div>






<div class="card">


<h2>

Recent Announcements

</h2>



<?php foreach($announcements as $a): ?>


<div class="item">


<div class="title">

<?php echo htmlspecialchars($a['title']); ?>

</div>



<p>

<?php echo nl2br(htmlspecialchars($a['description'])); ?>

</p>



<a class="delete"

href="?delete=<?php echo $a['id']; ?>">

DELETE

</a>



</div>



<?php endforeach; ?>


</div>



</div>


</body>

</html>