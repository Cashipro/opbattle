<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$db_status="Connected";


try{


$pdo->query("SELECT 1");


}

catch(Exception $e){


$db_status="Database Error";


}





/*
 TABLE COUNT
*/


$table_count=0;


$result=$pdo->query("SHOW TABLES");


while($result->fetch()){

$table_count++;

}



?>


<!DOCTYPE html>

<html>

<head>


<title>

OPBattle System Health

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



.grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

gap:20px;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:25px;

}



.title{

color:#9ca3af;

}



.value{

font-size:28px;

font-weight:900;

color:#22c55e;

margin-top:10px;

}



.ok{

color:#22c55e;

}



</style>


</head>



<body>



<div class="container">



<h1>

⚙️ System Health

</h1>




<div class="grid">



<div class="card">


<div class="title">

Database Status

</div>


<div class="value ok">

<?php echo $db_status; ?>

</div>


</div>





<div class="card">


<div class="title">

PHP Version

</div>


<div class="value">

<?php echo phpversion(); ?>

</div>


</div>





<div class="card">


<div class="title">

Database Tables

</div>


<div class="value">

<?php echo $table_count; ?>

</div>


</div>





<div class="card">


<div class="title">

Server Time

</div>


<div class="value">

<?php echo date("H:i:s"); ?>

</div>


</div>




</div>



</div>



</body>

</html>