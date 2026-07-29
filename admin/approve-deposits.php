<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



// APPROVE DEPOSIT

if(isset($_GET['approve'])){


$id=$_GET['approve'];



$stmt=$pdo->prepare("
SELECT *
FROM deposits
WHERE id=?
AND status='pending'
");


$stmt->execute([$id]);


$deposit=$stmt->fetch();



if($deposit){



$pdo->beginTransaction();



try{


// UPDATE DEPOSIT

$update=$pdo->prepare("
UPDATE deposits
SET status='approved'
WHERE id=?
");


$update->execute([$id]);




// ADD BALANCE

$balance=$pdo->prepare("
UPDATE users
SET balance = balance + ?
WHERE id=?
");


$balance->execute([

$deposit['amount'],

$deposit['user_id']

]);




// TRANSACTION

$trans=$pdo->prepare("
INSERT INTO wallet_transactions

(user_id,type,amount,description)

VALUES(?,?,?,?)

");



$trans->execute([

$deposit['user_id'],

'deposit',

$deposit['amount'],

'Deposit Approved'

]);




$pdo->commit();



}catch(Exception $e){


$pdo->rollBack();

}



}



header("Location: approve-deposits.php");

exit;


}







// GET PENDING


$stmt=$pdo->query("

SELECT

deposits.*,

users.name,

users.email

FROM deposits

JOIN users

ON users.id=deposits.user_id

WHERE deposits.status='pending'

ORDER BY deposits.id DESC

");



$deposits=$stmt->fetchAll();



?>

<!DOCTYPE html>

<html>

<head>

<title>Approve Deposits - OpBattle</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.main{

margin-left:270px;

padding:35px;

}



.box{

background:#111;

border:1px solid #222;

padding:25px;

border-radius:20px;

}



table{

width:100%;

border-collapse:collapse;

}



th{

color:#00ff84;

text-align:left;

padding:15px;

}



td{

padding:15px;

border-bottom:1px solid #222;

}



button{

background:#00ff84;

color:black;

padding:10px 18px;

border:0;

border-radius:10px;

font-weight:bold;

}



@media(max-width:1000px){

.main{

margin-left:0;

padding-top:80px;

}

}


</style>


</head>


<body>


<?php include "admin-sidebar.php"; ?>



<div class="main">


<h1>
Pending Deposits
</h1>



<div class="box">


<table>


<tr>

<th>User</th>

<th>Email</th>

<th>Amount</th>

<th>Network</th>

<th>Date</th>

<th>Action</th>

</tr>



<?php foreach($deposits as $d){ ?>


<tr>


<td>
<?=$d['name']?>
</td>


<td>
<?=$d['email']?>
</td>


<td>
$ <?=$d['amount']?>
</td>


<td>
<?=$d['network']?>
</td>


<td>
<?=date("d M Y",strtotime($d['created_at']))?>
</td>


<td>

<a href="?approve=<?=$d['id']?>">

<button>
Approve
</button>

</a>

</td>


</tr>


<?php } ?>


</table>


</div>


</div>


</body>

</html>