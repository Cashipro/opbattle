<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>OpBattle - PUBG Tournament Platform</title>


<style>

*{

margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial, sans-serif;

}


body{

background:#050505;
color:white;

}



.hero{

min-height:100vh;

display:flex;

align-items:center;

justify-content:center;

padding:30px;

background:

radial-gradient(
circle at top,
rgba(0,255,132,.18),
transparent 45%
),

#050505;

}



.container{

width:100%;
max-width:1100px;

text-align:center;

}



.logo{

font-size:48px;

font-weight:900;

color:#00ff84;

letter-spacing:1px;

}



h1{

margin-top:20px;

font-size:55px;

line-height:1.2;

}



h1 span{

color:#00ff84;

}



.description{

margin:25px auto;

max-width:700px;

font-size:18px;

line-height:1.7;

color:#aaa;

}



.buttons{

display:flex;

justify-content:center;

gap:20px;

flex-wrap:wrap;

margin-top:35px;

}



.btn{

padding:15px 35px;

border-radius:15px;

text-decoration:none;

font-weight:bold;

transition:.3s;

}



.btn:hover{

transform:translateY(-3px);

}



.primary{

background:#00ff84;

color:#000;

}



.secondary{

border:1px solid #00ff84;

color:#00ff84;

}



.features{

margin-top:80px;

display:grid;

grid-template-columns:repeat(3,1fr);

gap:20px;

}



.card{

background:rgba(255,255,255,.04);

border:1px solid rgba(255,255,255,.08);

padding:30px;

border-radius:22px;

}



.card h3{

color:#00ff84;

margin-bottom:15px;

font-size:22px;

}



.card p{

color:#aaa;

font-size:14px;

line-height:1.6;

}



.footer{

margin-top:60px;

color:#666;

font-size:14px;

}



@media(max-width:900px){


h1{

font-size:38px;

}



.logo{

font-size:38px;

}



.features{

grid-template-columns:1fr;

}



.description{

font-size:16px;

}


}


</style>


</head>



<body>



<section class="hero">


<div class="container">



<div class="logo">

OpBattle

</div>



<h1>

Ultimate <span>PUBG</span> Tournament Platform

</h1>



<div class="description">

Join competitive PUBG tournaments, create your squad,
fight for victory and track your results with OpBattle.

</div>




<div class="buttons">


<a href="user/register.php" class="btn primary">

Create Account

</a>



<a href="user/login.php" class="btn secondary">

Login

</a>


</div>





<div class="features">


<div class="card">

<h3>

Tournament System

</h3>

<p>

Join tournaments, manage teams and compete in professional matches.

</p>

</div>



<div class="card">

<h3>

Team Slots

</h3>

<p>

PUBG room style team slots with automatic player joining system.

</p>

</div>



<div class="card">

<h3>

Live Results

</h3>

<p>

Check match results, rankings and tournament progress.

</p>

</div>



</div>




<div class="footer">

© <?=date('Y')?> OpBattle. All Rights Reserved.

</div>



</div>


</section>



</body>

</html>