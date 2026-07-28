<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}


$message="";



if(isset($_POST['send'])){


$title=trim($_POST['title']);

$text=trim($_POST['message']);

$type=$_POST['type'];

$user_id=$_POST['user_id'] ?: NULL;



$stmt=$pdo->prepare("

INSERT INTO notifications

(

user_id,

title,

message,

type

)

VALUES(?,?,?,?)

");



$stmt->execute([

$user_id,

$title,

$text,

$type

]);



$message="Notification sent successfully";



}




/*
 USERS LIST

*/

$users=$pdo->query("

SELECT id,name,email

FROM users

ORDER BY id DESC

")->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Send Notification
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

max-width:800px;

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

padding:25px;

}



input,textarea,select{

width:100%;

padding:14px;

margin-bottom:18px;

background:#161b22;

border:1px solid #374151;

border-radius:12px;

color:white;

}



textarea{

height:130px;

resize:none;

}



label{

display:block;

color:#9ca3af;

margin-bottom:8px;

}



button{

width:100%;

padding:15px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:900;

color:black;

cursor:pointer;

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

📢 Send Notification

</h1>




<?php if($message): ?>


<div class="alert">

<?php echo $message; ?>

</div>


<?php endif; ?>





<div class="card">



<form method="post">



<label>

Send To

</label>


<select name="user_id">


<option value="">

All Players

</option>



<?php foreach($users as $u): ?>


<option value="<?php echo $u['id']; ?>">


<?php echo htmlspecialchars($u['name']); ?>

-

<?php echo htmlspecialchars($u['email']); ?>


</option>


<?php endforeach; ?>


</select>





<label>

Notification Type

</label>


<select name="type">


<option value="general">

General

</option>


<option value="tournament">

Tournament

</option>


<option value="match">

Match

</option>


<option value="room">

Room

</option>


</select>






<label>

Title

</label>


<input

type="text"

name="title"

placeholder="Notification title"

required

>





<label>

Message

</label>


<textarea

name="message"

placeholder="Write announcement..."

required></textarea>





<button name="send">

SEND NOTIFICATION

</button>




</form>



</div>



</div>


</body>

</html>