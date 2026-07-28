<?php
require_once 'config.php';

$total_tournaments = 0;
$total_players = 0;
$total_teams = 0;

try {

    $total_tournaments = $pdo->query("SELECT COUNT(*) FROM tournaments")->fetchColumn();

    $total_players = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

    $total_teams = $pdo->query("SELECT COUNT(*) FROM teams")->fetchColumn();

} catch(Exception $e){

}

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>
OPBattle | Ultimate PUBG Tournament Platform
</title>


<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Segoe UI',sans-serif;
}


body{

background:#050505;
color:white;
overflow-x:hidden;

}


/* animated background */

body:before{

content:"";
position:fixed;
width:600px;
height:600px;
background:#b7ff00;
filter:blur(180px);
opacity:.15;
top:-200px;
left:-200px;
z-index:-1;

}



body:after{

content:"";
position:fixed;
width:500px;
height:500px;
background:#00ff88;
filter:blur(180px);
opacity:.12;
bottom:-200px;
right:-200px;
z-index:-1;

}



.container{

width:90%;
max-width:1200px;
margin:auto;

}



/* navbar */


nav{

display:flex;
justify-content:space-between;
align-items:center;
padding:25px 0;

}


.logo{

font-size:32px;
font-weight:900;
color:#b7ff00;

}



.logo span{

color:white;

}



.nav-btn a{

text-decoration:none;
color:white;
margin-left:15px;

}



.btn{

background:#b7ff00;
color:black!important;
padding:12px 25px;
border-radius:30px;
font-weight:900;

}





/* hero */


.hero{

min-height:80vh;
display:flex;
align-items:center;

}



.hero h1{

font-size:65px;
line-height:1.1;

}



.hero h1 span{

color:#b7ff00;

}



.hero p{

margin-top:20px;
font-size:20px;
color:#aaa;
max-width:600px;

}



.buttons{

margin-top:35px;

}



.buttons a{

display:inline-block;
margin-right:15px;

}



.primary{

background:#b7ff00;
color:#000;
padding:16px 35px;
border-radius:40px;
font-weight:bold;
text-decoration:none;

}



.secondary{

border:1px solid #555;
padding:16px 35px;
border-radius:40px;
color:white;
text-decoration:none;

}



/* stats */


.stats{

display:grid;
grid-template-columns:repeat(3,1fr);
gap:20px;
margin:50px 0;

}



.card{

background:#111;
border:1px solid #222;
border-radius:25px;
padding:30px;
text-align:center;

}



.number{

font-size:40px;
font-weight:900;
color:#b7ff00;

}



.title{

color:#aaa;
margin-top:10px;

}



/* sections */


.section{

padding:70px 0;

}



.section h2{

text-align:center;
font-size:40px;
margin-bottom:40px;

}



.grid{

display:grid;
grid-template-columns:repeat(3,1fr);
gap:25px;

}



.box{

background:#111;
padding:30px;
border-radius:25px;
border:1px solid #222;

}



.box h3{

color:#b7ff00;
margin-bottom:15px;

}



.box p{

color:#aaa;

}




footer{

padding:30px;
text-align:center;
color:#777;

}



/* mobile */


@media(max-width:768px){


.hero h1{

font-size:42px;

}


.stats,
.grid{

grid-template-columns:1fr;

}



nav{

flex-direction:column;
gap:20px;

}


}



</style>


</head>


<body>


<div class="container">


<nav>


<div class="logo">

OP<span>Battle</span>

</div>


<div class="nav-btn">

<a href="login.php">
Login
</a>


<a class="btn" href="register.php">
Join Now
</a>


</div>


</nav>





<section class="hero">


<div>


<h1>

Dominate The

<span>Arena</span>

</h1>


<p>

OPBattle is a next generation PUBG tournament platform.
Create your squad, compete with the best players,
and win exciting rewards.

</p>


<div class="buttons">

<a class="primary" href="register.php">

Start Playing

</a>


<a class="secondary" href="tournaments.php">

View Tournaments

</a>


</div>


</div>


</section>





<section class="stats">


<div class="card">

<div class="number">

<?php echo $total_tournaments; ?>

</div>

<div class="title">

Tournaments

</div>

</div>



<div class="card">

<div class="number">

<?php echo $total_players; ?>

</div>

<div class="title">

Players

</div>

</div>



<div class="card">

<div class="number">

<?php echo $total_teams; ?>

</div>

<div class="title">

Teams

</div>

</div>



</section>






<section class="section">


<h2>

Why OPBattle?

</h2>



<div class="grid">



<div class="box">

<h3>
🏆 Competitive Matches
</h3>

<p>
Join professionally managed PUBG tournaments.
</p>

</div>




<div class="box">

<h3>
🔥 Real Competition
</h3>

<p>
Fight against skilled teams and climb rankings.
</p>

</div>




<div class="box">

<h3>
💰 Rewards System
</h3>

<p>
Track winnings and tournament prizes easily.
</p>

</div>



</div>


</section>






<section class="section">


<h2>

How It Works

</h2>



<div class="grid">


<div class="box">

<h3>
1. Create Account
</h3>

<p>
Register your gaming profile.
</p>

</div>



<div class="box">

<h3>
2. Join Tournament
</h3>

<p>
Create your team and enter battles.
</p>

</div>



<div class="box">

<h3>
3. Win Rewards
</h3>

<p>
Earn points and become champion.
</p>

</div>



</div>


</section>





<footer>

© <?php echo date("Y"); ?> OPBattle. All Rights Reserved.

</footer>



</div>


</body>

</html>