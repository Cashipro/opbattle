<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once "../config.php";


if(!isset($_SESSION['user_id'])){

    header("Location: login.php");
    exit;

}


$user_id = $_SESSION['user_id'];

$msg = "";
$error = "";



if(isset($_POST['submit_deposit'])){


    $amount = trim($_POST['amount']);

    $network = trim($_POST['network']);

    $transaction_id = trim($_POST['transaction_id']);



    if($amount < 30){


        $error = "Minimum deposit amount is PKR 30";


    }else{



        $screenshot = null;



        if(isset($_FILES['screenshot']) && $_FILES['screenshot']['error']==0){


            $folder = "uploads/";


            if(!is_dir($folder)){

                mkdir($folder,0777,true);

            }



            $file_name = time().'_'.basename($_FILES['screenshot']['name']);


            $target = $folder.$file_name;



            if(move_uploaded_file($_FILES['screenshot']['tmp_name'],$target)){


                $screenshot = $file_name;


            }



        }





        $stmt = $pdo->prepare("

        INSERT INTO deposits

        (
            user_id,
            amount,
            network,
            wallet_address,
            screenshot,
            status
        )

        VALUES(?,?,?,?,?,?)

        ");



        $stmt->execute([

            $user_id,

            $amount,

            $network,

            $transaction_id,

            $screenshot,

            'pending'

        ]);



        $msg = "Deposit request submitted successfully";


    }


}



?>


<!DOCTYPE html>

<html lang="en">

<head>


<meta charset="UTF-8">

<meta name="viewport" content="width=device-width,initial-scale=1.0">


<title>OpBattle Deposit</title>



<style>


*{

box-sizing:border-box;

font-family:Arial;

}



body{

margin:0;

background:#050505;

color:white;

}



.main{

margin-left:260px;

padding:30px;

}



.box{

max-width:600px;

background:#111;

padding:25px;

border-radius:20px;

border:1px solid #222;

}



h1{

color:#00ff84;

}



.account-box{

display:none;

background:#050505;

border:1px solid #00ff84;

padding:18px;

border-radius:15px;

margin:20px 0;

}



label{

display:block;

margin-top:15px;

color:#aaa;

}



input,select{

width:100%;

padding:14px;

margin-top:8px;

background:#050505;

color:white;

border:1px solid #333;

border-radius:12px;

}



button{

margin-top:20px;

width:100%;

padding:15px;

background:#00ff84;

color:#000;

border:0;

border-radius:12px;

font-weight:bold;

}



.msg{

padding:12px;

border-radius:10px;

margin-bottom:15px;

}



.success{

background:#064;

}



.error{

background:#600;

}



@media(max-width:900px){

.main{

margin-left:0;

padding:80px 15px 20px;

}

}



</style>



<script>


function showAccount(){


let method=document.getElementById("network").value;


document.getElementById("easypaisa").style.display="none";

document.getElementById("jazzcash").style.display="none";

document.getElementById("meezan").style.display="none";



if(method=="Easypaisa"){

document.getElementById("easypaisa").style.display="block";

}



if(method=="JazzCash"){

document.getElementById("jazzcash").style.display="block";

}



if(method=="Meezan Bank"){

document.getElementById("meezan").style.display="block";

}



}



</script>


</head>


<body>



<?php include "user-sidebar.php"; ?>



<div class="main">


<div class="box">


<h1>

Deposit PKR

</h1>



<?php if($msg){ ?>

<div class="msg success">

<?=$msg?>

</div>

<?php } ?>



<?php if($error){ ?>

<div class="msg error">

<?=$error?>

</div>

<?php } ?>





<label>

Select Payment Method

</label>



<select name="network" id="network" onchange="showAccount()" form="depositForm" required>


<option value="">

Select Method

</option>


<option value="Easypaisa">

Easypaisa

</option>


<option value="JazzCash">

JazzCash

</option>


<option value="Meezan Bank">

Meezan Bank

</option>


</select>





<div id="easypaisa" class="account-box">


<h3>

Easypaisa

</h3>


<p>

Account Title: Kashif Iqbal

<br>

Number: 03455555505

</p>


</div>





<div id="jazzcash" class="account-box">


<h3>

JazzCash

</h3>


<p>

Account Title: Kashif Iqbal

<br>

Number: 03455555505

</p>


</div>





<div id="meezan" class="account-box">


<h3>

Meezan Bank

</h3>


<p>

Account Title: Kashif Iqbal

<br>

Account Number: 04820114126355

</p>


</div>







<form id="depositForm" method="POST" enctype="multipart/form-data">



<label>

Amount PKR (Minimum 30)

</label>


<input

type="number"

name="amount"

min="30"

required>




<label>

Transaction ID

</label>


<input

type="text"

name="transaction_id"

placeholder="Enter payment ID"

required>




<label>

Payment Screenshot

</label>


<input

type="file"

name="screenshot"

accept="image/*"

required>




<button name="submit_deposit">

Submit Deposit

</button>



</form>



</div>


</div>


</body>

</html>