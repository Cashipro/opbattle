<?php

session_start();

require_once "../config.php";


if(!isset($_SESSION['admin_id'])){

header("Location: admin-login.php");
exit;

}



$stmt=$pdo->query("

SELECT

wallet_transactions.*,

users.name,

users.email

FROM wallet_transactions

JOIN users

ON users.id=wallet_transactions.user_id

ORDER BY wallet_transactions.id DESC

");


$transactions=$stmt->fetchAll();


?>


<!DOCTYPE html>

<html>

<head>

<title>Transactions - OpBattle</title>

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



.type{

color:#00ff84;

font-weight:bold;

}



.amount{

font-weight:bold;

}



@media(max-width:1000px){


.main{

margin-left:0;

padding-top:80px;

}


table{

font-size:13px;

}


}


</style>


</head>


<body>


<?php include "admin-sidebar.php"; ?>



<div class="main">


<h1>
Wallet Transactions
</h1>



<div class="box">



<table>


<tr>

<th>User</th>

<th>Type</th>

<th>Amount</th>

<th>Description</th>

<th>Date</th>

</tr>



<?php foreach($transactions as $t){ ?>


<tr>


<td>

<?=$t['name']?>

<br>

<small>

<?=$t['email']?>

</small>

</td>



<td class="type">

<?=ucfirst($t['type'])?>

</td>



<td class="amount">

$ <?=$t['amount']?>

</td>



<td>

<?=$t['description']?>

</td>



<td>

<?=date(
"d M Y H:i",
strtotime($t['created_at'])
)?>

</td>



</tr>



<?php } ?>



</table>



</div>


</div>



</body>

</html>