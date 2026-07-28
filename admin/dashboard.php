<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once '../config.php';


if(!isset($_SESSION['admin_id']))
{
    header("Location: admin_login.php");
    exit;
}


try
{

    $total_users = $pdo->query("
        SELECT COUNT(*) 
        FROM users
    ")->fetchColumn();



    $total_teams = $pdo->query("
        SELECT COUNT(*) 
        FROM teams
    ")->fetchColumn();



    $total_tournaments = $pdo->query("
        SELECT COUNT(*) 
        FROM tournaments
    ")->fetchColumn();



    $total_revenue = $pdo->query("
        SELECT COALESCE(SUM(amount),0)
        FROM transactions
        WHERE payment_status='approved'
    ")->fetchColumn();



}
catch(PDOException $e)
{

    die("Database Error: ".$e->getMessage());

}


?>


<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>
OPBattle Admin Dashboard
</title>


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

}



.container{

width:90%;
max-width:1200px;
margin:auto;
padding:30px 0;

}



.header{

display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:40px;

}



.logo{

font-size:35px;
font-weight:900;
color:#b7ff00;

}


.logo span{

color:white;

}



.logout{

background:#222;
padding:12px 25px;
border-radius:30px;
color:white;
text-decoration:none;

}




.cards{

display:grid;
grid-template-columns:repeat(4,1fr);
gap:20px;

}



.card{

background:#111;
border:1px solid #222;
border-radius:20px;
padding:25px;

}



.number{

font-size:35px;
font-weight:900;
color:#b7ff00;

}



.label{

color:#aaa;
margin-top:10px;

}




.menu{

margin-top:40px;
display:grid;
grid-template-columns:repeat(3,1fr);
gap:20px;

}



.menu a{

background:#111;
border:1px solid #222;
padding:20px;
border-radius:20px;
text-decoration:none;
color:white;
font-weight:bold;
transition:.3s;

}



.menu a:hover{

border-color:#b7ff00;
transform:translateY(-3px);

}



@media(max-width:768px){


.cards{

grid-template-columns:repeat(2,1fr);

}


.menu{

grid-template-columns:1fr;

}


.header{

flex-direction:column;
gap:20px;

}


}



</style>


</head>


<body>


<div class="container">



<div class="header">


<div class="logo">

OP<span>Battle</span>

</div>


<a class="logout" href="logout.php">

Logout

</a>


</div>





<h1>

Admin Dashboard

</h1>

<br>



<div class="cards">



<div class="card">

<div class="number">
<?php echo $total_users; ?>
</div>

<div class="label">
Total Players
</div>

</div>



<div class="card">

<div class="number">
<?php echo $total_teams; ?>
</div>

<div class="label">
Total Teams
</div>

</div>



<div class="card">

<div class="number">
<?php echo $total_tournaments; ?>
</div>

<div class="label">
Tournaments
</div>

</div>



<div class="card">

<div class="number">

PKR <?php echo number_format($total_revenue ?? 0); ?>

</div>

<div class="label">
Entry Revenue
</div>

</div>



</div>






<div class="menu">



<a href="tournament_create.php">
➕ Create Tournament
</a>



<a href="tournament_manage.php">
🎮 Manage Tournament
</a>



<a href="team_management.php">
👥 Manage Teams
</a>



<a href="room_manager.php">
🚪 Room Manager
</a>



<a href="match_result.php">
⚔ Match Results
</a>



<a href="ranking.php">
🏆 Rankings
</a>



<a href="qualification.php">
✅ Qualification
</a>



<a href="prize_distribution.php">
💰 Prize Distribution
</a>



<a href="tournament_history.php">
📜 Tournament History
</a>



</div>



</div>


</body>

</html>