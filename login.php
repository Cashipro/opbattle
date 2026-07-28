<?php

require_once 'config.php';


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


            $stmt = $pdo->prepare(
            "
            SELECT *
            FROM users
            WHERE email=?
            "
            );


            $stmt->execute([$email]);


            $user = $stmt->fetch();



            if($user && password_verify($password,$user['password']))
            {


                if($user['account_status'] == 'blocked')
                {

                    $error = "Your account has been blocked.";

                }
                else
                {


                    $_SESSION['user_id'] = $user['id'];

                    $_SESSION['user_name'] = $user['name'];

                    $_SESSION['user_email'] = $user['email'];



                    header("Location: dashboard.php");

                    exit;

                }


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

<title>
OPBattle Login
</title>


<style>

*{

margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial,sans-serif;

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
box-shadow:0 0 30px rgba(183,255,0,.1);

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



h2{

text-align:center;
margin-bottom:25px;

}



input{

width:100%;
padding:15px;
margin-bottom:15px;
background:#222;
border:none;
border-radius:12px;
color:white;
outline:none;

}



button{

width:100%;
padding:15px;
border:none;
border-radius:30px;
background:#b7ff00;
color:#000;
font-weight:900;
cursor:pointer;

}



.error{

background:#300;
color:#ff7777;
padding:12px;
border-radius:10px;
text-align:center;
margin-bottom:15px;

}



p{

text-align:center;
margin-top:20px;
color:#aaa;

}



a{

color:#b7ff00;
text-decoration:none;

}


</style>


</head>


<body>


<div class="box">


<div class="logo">
OP<span>Battle</span>
</div>


<h2>
Player Login
</h2>



<?php if($error){ ?>

<div class="error">

<?php echo $error; ?>

</div>

<?php } ?>



<form method="POST">


<input 
type="email"
name="email"
placeholder="Email Address"
required>



<input 
type="password"
name="password"
placeholder="Password"
required>



<button type="submit">

LOGIN

</button>


</form>



<p>

Don't have account?

<a href="register.php">
Register
</a>

</p>


</div>


</body>

</html>