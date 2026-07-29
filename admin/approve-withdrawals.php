<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}




// APPROVE WITHDRAWAL

if(isset($_GET['approve'])){


$id=$_GET['approve'];



$stmt=$pdo->prepare("
SELECT *
FROM withdrawals
WHERE id=?
AND status='pending'
");


$stmt->execute([$id]);


$withdraw=$stmt->fetch();



if($withdraw){


$update=$pdo->prepare("
UPDATE withdrawals
SET status='approved'
WHERE id=?
");


$update->execute([$id]);



$trans=$pdo->prepare("
INSERT INTO wallet_transactions

(user_id,type,amount,description)

VALUES(?,?,?,?)

");



$trans->execute([

$withdraw['user_id'],

'withdrawal',

$withdraw['amount'],

'Withdrawal Approved'

]);


}



header("Location: approve-withdrawals.php");
exit;


}






$stmt=$pdo->query("

SELECT

withdrawals.*,

users.name,

users.email

FROM withdrawals

JOIN users

ON users.id=withdrawals.user_id

WHERE withdrawals.status='pending'

ORDER BY withdrawals.id DESC

");



$withdrawals=$stmt->fetchAll();


?>


<!DOCTYPE html>

<html>

<head>

<title>Approve Withdrawals - OpBattle</title>


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

padding:15px;

text-align:left;

}



td{

padding:15px;

border-bottom:1px solid #222;

}



button{

background:#00ff84;

border:0;

padding:10px 18px;

border-radius:10px;

font-weight:bold;

}



.address{

font-size:12px;

color:#aaa;

max-width:200px;

word-break:break-all;

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
Pending Withdrawals
</h1>



<div class="box">



<table>


<tr>

<th>User</th>

<th>Amount</th>

<th>Network</th>

<th>Wallet</th>

<th>Date</th>

<th>Action</th>

</tr>




<?php foreach($withdrawals as $w){ ?>


<tr>


<td>

<?=$w['name']?>

<br>

<small><?=$w['email']?></small>

</td>



<td>

$ <?=$w['amount']?>

</td>



<td>

<?=$w['network']?>

</td>



<td class="address">

<?=$w['wallet_address']?>

</td>



<td>

<?=date(
"d M Y",
strtotime($w['created_at'])
)?>

</td>



<td>


<a href="?approve=<?=$w['id']?>">

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