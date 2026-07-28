<?php

require_once 'config.php';

$message = "";
$error = "";


if($_SERVER['REQUEST_METHOD'] == 'POST')
{

    $name = trim($_POST['name'] ?? '');

    $email = trim($_POST['email'] ?? '');

    $pubg_uid = trim($_POST['pubg_uid'] ?? '');

    $password = $_POST['password'] ?? '';



    if(
        empty($name) ||
        empty($email) ||
        empty($pubg_uid) ||
        empty($password)
    )
    {

        $error = "All fields are required.";

    }
    else
    {

        try
        {


            $check = $pdo->prepare(
            "
            SELECT id 
            FROM users 
            WHERE email=? OR pubg_uid=?
            "
            );


            $check->execute(
            [
                $email,
                $pubg_uid
            ]);



            if($check->fetch())
            {

                $error = 
                "Email or PUBG UID already registered.";

            }
            else
            {


                $hash = password_hash(
                    $password,
                    PASSWORD_DEFAULT
                );



                $insert = $pdo->prepare(
                "
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    pubg_uid,
                    wallet_balance,
                    winnings,
                    account_status
                )

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    0,
                    0,
                    'active'
                )
                "
                );



                $insert->execute(
                [
                    $name,
                    $email,
                    $hash,
                    $pubg_uid
                ]);



                $message = 
                "Registration successful. You can login now.";

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
<html>

<head>

<title>OPBattle Register</title>

<meta name="viewport" content="width=device-width, initial-scale=1">


<style>

body{

background:#050505;
color:white;
font-family:Arial;
display:flex;
justify-content:center;
align-items:center;
min-height:100vh;

}


.box{

background:#111;
padding:35px;
border-radius:20px;
width:90%;
max-width:400px;
border:1px solid #222;

}


h2{

text-align:center;
color:#b7ff00;

}


input{

width:100%;
padding:14px;
margin:10px 0;
border-radius:10px;
border:none;
background:#222;
color:white;

}


button{

width:100%;
padding:14px;
background:#b7ff00;
border:none;
border-radius:30px;
font-weight:bold;
cursor:pointer;

}


.success{

color:#00ff88;
text-align:center;

}


.error{

color:red;
text-align:center;

}


a{

color:#b7ff00;

}

</style>


</head>


<body>


<div class="box">


<h2>
Create OPBattle Account
</h2>



<?php if($message){ ?>

<p class="success">
<?php echo $message; ?>
</p>

<?php } ?>


<?php if($error){ ?>

<p class="error">
<?php echo $error; ?>
</p>

<?php } ?>



<form method="POST">


<input 
type="text" 
name="name"
placeholder="Full Name"
required>


<input 
type="email" 
name="email"
placeholder="Email Address"
required>


<input 
type="text" 
name="pubg_uid"
placeholder="PUBG UID"
required>



<input 
type="password" 
name="password"
placeholder="Password"
required>



<button type="submit">
REGISTER
</button>


</form>



<p style="text-align:center;margin-top:20px;">

Already have account?

<a href="login.php">
Login
</a>

</p>


</div>


</body>

</html>