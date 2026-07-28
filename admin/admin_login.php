<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once '../config.php';


if(isset($_SESSION['admin_id']))
{
    header("Location: dashboard.php");
    exit;
}


$error = "";


if($_SERVER['REQUEST_METHOD']=="POST")
{

    $email = trim($_POST['email'] ?? '');

    $password = $_POST['password'] ?? '';



    if(empty($email) || empty($password))
    {

        $error = "Please enter email and password.";

    }
    else
    {

        try
        {


            $stmt = $pdo->prepare("
                SELECT *
                FROM admins
                WHERE email=?
                LIMIT 1
            ");


            $stmt->execute([$email]);


            $admin = $stmt->fetch();



            if($admin && $password == $admin['password'])
            {


                $_SESSION['admin_id'] = $admin['id'];

                $_SESSION['admin_name'] = $admin['name'];

                $_SESSION['admin_email'] = $admin['email'];



                header("Location: dashboard.php");

                exit;


            }
            else
            {

                $error = "Invalid email or password.";

            }


        }
        catch(PDOException $e)
        {

            $error = $e->getMessage();

        }

    }

}


?>


<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>OPBattle Admin Login</title>


<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Segoe UI,Arial;
}


body{

background:#050505;
color:white;
height:100vh;
display:flex;
justify-content:center;
align-items:center;

}


.box{

width:90%;
max-width:420px;
background:#111;
padding:35px;
border-radius:25px;
border:1px solid #222;

}


.logo{

text-align:center;
font-size:35px;
font-weight:900;
color:#b7ff00;
margin-bottom:25px;

}


.logo span{

color:white;

}


label{

display:block;
margin-bottom:8px;
color:#aaa;

}


input{

width:100%;
padding:15px;
margin-bottom:20px;
background:#222;
border:none;
border-radius:12px;
color:white;

}


button{

width:100%;
padding:15px;
background:#b7ff00;
border:none;
border-radius:30px;
font-weight:900;
cursor:pointer;

}


.error{

background:#400;
color:#ff9999;
padding:12px;
border-radius:10px;
text-align:center;
margin-bottom:20px;

}

</style>

</head>


<body>


<div class="box">


<div class="logo">

🎮 OP<span>Battle</span>

</div>



<?php if($error){ ?>

<div class="error">

<?php echo $error; ?>

</div>

<?php } ?>



<form method="POST">


<label>
Admin Email
</label>


<input 
type="email"
name="email"
placeholder="Admin Email"
required>



<label>
Password
</label>


<input 
type="password"
name="password"
placeholder="Password"
required>



<button type="submit">

LOGIN TO PANEL

</button>


</form>


</div>


</body>

</html>