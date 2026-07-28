<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once 'config.php';


if(!isset($_SESSION['user_id']))
{
    header("Location: login.php");
    exit;
}


$user_id = $_SESSION['user_id'];



try
{


    $stmt = $pdo->prepare("
        SELECT *
        FROM users
        WHERE id=?
    ");

    $stmt->execute([$user_id]);

    $user = $stmt->fetch();



    if(!$user)
    {
        session_destroy();
        header("Location: login.php");
        exit;
    }



    // tournaments count

    $tournament_count = $pdo->query("
        SELECT COUNT(*) 
        FROM tournaments
    ")->fetchColumn();



    // team count

    $team_stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM team_members
        WHERE user_id=?
    ");

    $team_stmt->execute([$user_id]);

    $team_count = $team_stmt->fetchColumn();



    // upcoming match

    $room_stmt = $pdo->prepare("
        SELECT *
        FROM tournament_rooms
        WHERE status='active'
        ORDER BY match_time ASC
        LIMIT 1
    ");

    $room_stmt->execute();

    $room = $room_stmt->fetch();



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
OPBattle Dashboard
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
max-width:1100px;
margin:auto;
padding:30px 0;

}



.header{

display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:30px;

}



.logo{

font-size:32px;
font-weight:900;
color:#b7ff00;

}



.logo span{

color:white;

}



.logout{

background:#222;
padding:12px 20px;
border-radius:20px;
color:white;
text-decoration:none;

}



.welcome{

margin-bottom:25px;

}



.welcome h1{

font-size:35px;

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

font-size:32px;
font-weight:900;
color:#b7ff00;

}



.label{

color:#aaa;
margin-top:10px;

}



.section{

margin-top:40px;

}



.section h2{

margin-bottom:20px;

}



.match{

background:#111;
padding:25px;
border-radius:20px;
border:1px solid #222;

}



.btns{

display:grid;
grid-template-columns:repeat(3,1fr);
gap:15px;

}



.btn{

background:#b7ff00;
color:black;
padding:15px;
text-align:center;
border-radius:15px;
text-decoration:none;
font-weight:900;

}



@media(max-width:768px){


.cards{

grid-template-columns:repeat(2,1fr);

}


.btns{

grid-template-columns:1fr;

}


.header{

flex-direction:column;
gap:15px;

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





<div class="welcome">

<h1>

Welcome,
<?php echo htmlspecialchars($user['name']); ?>

</h1>


</div>






<div class="cards">


<div class="card">

<div class="number">

$<?php echo number_format($user['wallet_balance'],2); ?>

</div>

<div class="label">

Wallet Balance

</div>

</div>



<div class="card">

<div class="number">

$<?php echo number_format($user['winnings'],2); ?>

</div>

<div class="label">

Total Winnings

</div>

</div>



<div class="card">

<div class="number">

<?php echo $tournament_count; ?>

</div>

<div class="label">

Tournaments

</div>

</div>



<div class="card">

<div class="number">

<?php echo $team_count; ?>

</div>

<div class="label">

My Teams

</div>

</div>



</div>








<div class="section">


<h2>
Upcoming Match
</h2>


<div class="match">


<?php if($room){ ?>


<h3>

Room ID:
<?php echo htmlspecialchars($room['room_id']); ?>

</h3>


<p>

Password:
<?php echo htmlspecialchars($room['room_password']); ?>

</p>


<p>

Time:

<?php echo date('d M Y h:i A',strtotime($room['match_time'])); ?>

</p>



<?php } else { ?>


<p>

No upcoming match assigned.

</p>


<?php } ?>


</div>


</div>







<div class="section">


<h2>
Quick Access
</h2>


<div class="btns">


<a class="btn" href="tournaments.php">
TOURNAMENTS
</a>


<a class="btn" href="my_team.php">
MY TEAM
</a>


<a class="btn" href="room_details.php">
ROOM DETAILS
</a>


<a class="btn" href="leaderboard.php">
LEADERBOARD
</a>


<a class="btn" href="profile.php">
PROFILE
</a>


</div>


</div>



</div>


</body>

</html>