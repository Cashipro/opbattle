<?php

$current_page = basename($_SERVER['PHP_SELF']);

?>

<style>

/* SIDEBAR */

.sidebar{

position:fixed;
left:0;
top:0;

width:280px;
height:100vh;

padding:25px 18px;

background:
linear-gradient(
180deg,
rgba(10,15,20,.96),
rgba(5,5,5,.99)
);

border-right:1px solid rgba(255,255,255,.08);

backdrop-filter:blur(25px);

overflow-y:auto;

z-index:9999;

}


.sidebar::-webkit-scrollbar{

width:5px;

}


.sidebar::-webkit-scrollbar-thumb{

background:#00ff84;
border-radius:20px;

}


.sidebar-logo{

display:flex;
align-items:center;
gap:15px;

padding-bottom:25px;

border-bottom:1px solid rgba(255,255,255,.08);

}


.mini-logo{

width:55px;
height:55px;

border-radius:18px;

display:flex;
align-items:center;
justify-content:center;

font-size:24px;
font-weight:900;

color:#000;

background:linear-gradient(
135deg,
#00ff84,
#00bfff
);

box-shadow:0 0 35px rgba(0,255,132,.45);

}


.sidebar-logo h3{

margin:0;

color:white;

font-size:24px;

}


.sidebar-logo span{

font-size:12px;
color:#888;

}



.menu-title{

margin:25px 10px 10px;

font-size:11px;

letter-spacing:1.5px;

color:#68717c;

font-weight:bold;

}



.sidebar a{

display:block;

padding:13px 16px;

margin-bottom:6px;

border-radius:15px;

text-decoration:none;

color:#b8bec6;

font-size:14px;

font-weight:600;

transition:.3s;

}


.sidebar a:hover{

background:rgba(0,255,132,.08);

color:white;

transform:translateX(5px);

}



.sidebar a.active{

background:
linear-gradient(
90deg,
rgba(0,255,132,.22),
rgba(0,190,255,.12)
);

color:#00ff84;

border:1px solid rgba(0,255,132,.25);

}



.profile-box{

margin-top:30px;

padding:18px;

border-radius:18px;

background:rgba(255,255,255,.04);

border:1px solid rgba(255,255,255,.08);

}



.profile-box h4{

color:white;

margin:0;

}


.profile-box p{

color:#888;

font-size:12px;

}



.mobile-btn{

display:none;

position:fixed;

top:18px;

left:18px;

width:45px;

height:45px;

border-radius:15px;

background:#00ff84;

color:black;

align-items:center;

justify-content:center;

font-weight:bold;

z-index:10000;

}



@media(max-width:1000px){


.sidebar{

transform:translateX(-100%);

transition:.3s;

}


.sidebar.show{

transform:translateX(0);

}


.mobile-btn{

display:flex;

}


}


</style>



<div class="mobile-btn" onclick="toggleSidebar()">

☰

</div>



<aside class="sidebar">



<div class="sidebar-logo">


<div class="mini-logo">

O

</div>


<div>

<h3>

OpBattle

</h3>


<span>

Admin Control

</span>


</div>


</div>





<div class="menu-title">

MAIN

</div>


<a href="admin-dashboard.php"
class="<?=($current_page=='admin-dashboard.php')?'active':''?>">

Dashboard

</a>





<div class="menu-title">

USERS

</div>


<a href="users.php"
class="<?=($current_page=='users.php')?'active':''?>">

Users

</a>






<div class="menu-title">

PAYMENTS

</div>



<a href="approve-deposits.php"
class="<?=($current_page=='approve-deposits.php')?'active':''?>">

Deposits

</a>



<a href="approve-withdrawals.php"
class="<?=($current_page=='approve-withdrawals.php')?'active':''?>">

Withdrawals

</a>



<a href="transactions.php"
class="<?=($current_page=='transactions.php')?'active':''?>">

Transactions

</a>






<div class="menu-title">

TOURNAMENT

</div>



<a href="tournaments.php"
class="<?=($current_page=='tournaments.php')?'active':''?>">

Tournaments

</a>



<a href="tournament-create.php"
class="<?=($current_page=='tournament-create.php')?'active':''?>">

Create Tournament

</a>



<a href="tournament-manage.php"
class="<?=($current_page=='tournament-manage.php')?'active':''?>">

Manage Tournament

</a>






<div class="menu-title">

SYSTEM

</div>



<a href="admin-profile.php"
class="<?=($current_page=='admin-profile.php')?'active':''?>">

Profile

</a>



<a href="settings.php"
class="<?=($current_page=='settings.php')?'active':''?>">

Settings

</a>



<a href="logout.php">

Logout

</a>





<div class="profile-box">


<h4>

Super Admin

</h4>


<p>

OpBattle Tournament Control

</p>


</div>



</aside>



<script>

function toggleSidebar(){

document.querySelector(".sidebar")
.classList.toggle("show");

}

</script>