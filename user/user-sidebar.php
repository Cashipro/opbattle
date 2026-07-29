<?php

$current_page = basename($_SERVER['PHP_SELF']);

?>


<style>

.user-sidebar{

position:fixed;

left:0;
top:0;

width:260px;

height:100vh;

padding:25px 18px;

background:
linear-gradient(
180deg,
#0b0f12,
#050505
);

border-right:1px solid rgba(255,255,255,.08);

overflow-y:auto;

z-index:9999;

}


.user-sidebar::-webkit-scrollbar{

width:5px;

}


.user-sidebar::-webkit-scrollbar-thumb{

background:#00ff84;

border-radius:20px;

}



.user-logo{

display:flex;

align-items:center;

gap:12px;

padding-bottom:25px;

border-bottom:1px solid #222;

}



.logo-box{

width:50px;

height:50px;

border-radius:15px;

background:#00ff84;

color:#000;

display:flex;

align-items:center;

justify-content:center;

font-size:22px;

font-weight:900;

}



.user-logo h3{

color:white;

margin:0;

}


.user-logo span{

font-size:12px;

color:#888;

}



.menu-title{

font-size:11px;

color:#777;

margin:25px 10px 10px;

letter-spacing:1px;

}



.user-sidebar a{

display:block;

padding:13px 15px;

margin-bottom:6px;

border-radius:14px;

text-decoration:none;

color:#bbb;

font-weight:600;

font-size:14px;

}



.user-sidebar a:hover{

background:rgba(0,255,132,.1);

color:white;

}



.user-sidebar a.active{

background:rgba(0,255,132,.15);

color:#00ff84;

border:1px solid rgba(0,255,132,.3);

}



.mobile-user-btn{

display:none;

position:fixed;

top:18px;

left:18px;

width:45px;

height:45px;

border-radius:14px;

background:#00ff84;

color:#000;

align-items:center;

justify-content:center;

font-weight:bold;

z-index:10000;

}



@media(max-width:1000px){


.user-sidebar{

transform:translateX(-100%);

transition:.3s;

}


.user-sidebar.show{

transform:translateX(0);

}


.mobile-user-btn{

display:flex;

}


}


</style>



<div class="mobile-user-btn" onclick="toggleUserSidebar()">

☰

</div>



<aside class="user-sidebar">



<div class="user-logo">


<div class="logo-box">

O

</div>


<div>

<h3>

OpBattle

</h3>

<span>

Player Panel

</span>


</div>


</div>





<div class="menu-title">

MAIN

</div>



<a href="dashboard.php"
class="<?=($current_page=='dashboard.php')?'active':''?>">

Dashboard

</a>



<a href="tournaments.php"
class="<?=($current_page=='tournaments.php')?'active':''?>">

Tournaments

</a>



<a href="my-tournaments.php"
class="<?=($current_page=='my-tournaments.php')?'active':''?>">

My Tournaments

</a>





<div class="menu-title">

WALLET

</div>



<a href="deposit.php"
class="<?=($current_page=='deposit.php')?'active':''?>">

Deposit

</a>



<a href="withdraw.php"
class="<?=($current_page=='withdraw.php')?'active':''?>">

Withdraw

</a>



<a href="transactions.php"
class="<?=($current_page=='transactions.php')?'active':''?>">

Transactions

</a>





<div class="menu-title">

ACCOUNT

</div>



<a href="profile.php"
class="<?=($current_page=='profile.php')?'active':''?>">

Profile

</a>



<a href="logout.php">

Logout

</a>



</aside>



<script>

function toggleUserSidebar(){

document.querySelector(".user-sidebar")
.classList.toggle("show");

}

</script>