<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}



$message="";



if(isset($_POST['backup'])){


$filename = "opbattle_backup_" . date("Y-m-d_H-i-s") . ".sql";


$backupPath = "../backups/".$filename;



if(!is_dir("../backups")){

mkdir("../backups",0777,true);

}



$tables=[];


$result=$pdo->query("SHOW TABLES");


while($row=$result->fetch(PDO::NUMERIC)){

$tables[]=$row[0];

}





$sql="";



foreach($tables as $table){



$sql.="DROP TABLE IF EXISTS `$table`;\n\n";



$create=$pdo->query(

"SHOW CREATE TABLE `$table`"

)->fetch(PDO::FETCH_ASSOC);



$sql.=$create['Create Table'].";\n\n";





$data=$pdo->query(

"SELECT * FROM `$table`"

);



while($row=$data->fetch(PDO::FETCH_ASSOC)){


$values=[];


foreach($row as $value){


$values[]=$pdo->quote($value);


}



$sql.="INSERT INTO `$table` VALUES(".implode(",",$values).");\n";


}



$sql.="\n\n";


}





file_put_contents(

$backupPath,

$sql

);



$message="Database backup created successfully";



}




?>



<!DOCTYPE html>

<html>

<head>

<title>

OPBattle Database Backup

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

max-width:700px;

margin:50px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.card{

background:#0f1319;

padding:30px;

border-radius:20px;

border:1px solid #1f2937;

text-align:center;

}



button{

padding:15px 30px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:900;

cursor:pointer;

}



.alert{

margin-bottom:20px;

background:#052e16;

color:#22c55e;

padding:15px;

border-radius:12px;

}



</style>


</head>



<body>



<div class="container">



<h1>

💾 Database Backup

</h1>




<?php if($message): ?>


<div class="alert">

<?php echo $message; ?>

</div>


<?php endif; ?>





<div class="card">


<p>

Create a complete OPBattle database backup.

</p>



<form method="post">


<button name="backup">

CREATE BACKUP

</button>


</form>



</div>



</div>


</body>

</html>