<?php

$current_page = basename($_SERVER['PHP_SELF']);

?>


<style>


/* ==========================
OPBATTLE SIDEBAR
========================== */


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
rgba(10,15,20,.95),
rgba(5,5,5,.98)
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

background:

linear-gradient(
135deg,
#00ff84,
#00bfff
);

box-shadow:

0 0 35px rgba(0,255,132,.45);

}



.sidebar-logo h3{

font-size:24px;

font-weight:800;

color:white;

}


.sidebar-logo span{

font-size:12px;

color:#8d949d;

}





.menu-title{

margin:25px 10px 10px;

font-size:11px;

font-weight:700;

letter-spacing:1.5px;

color:#68717c;

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

background:

rgba(0,255,132,.08);

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


box-shadow:

0 0 20px rgba(0,255,132,.12);


}





.profile-box{


margin-top:30px;

padding:18px;

border-radius:18px;


background:

rgba(255,255,255,.04);


border:

1px solid rgba(255,255,255,.08);


}



.profile-box h4{

font-size:15px;

color:white;

}


.profile-box p{

font-size:12px;

margin-top:5px;

color:#8d949d;

}







/* MOBILE BUTTON */


.mobile-btn{


display:none;


position:fixed;


top:18px;

left:18px;


width:45px;

height:45px;


border-radius:15px;


background:#00ff84;


color:#000;


align-items:center;


justify-content:center;


font-weight:bold;


z-index:10000;


cursor:pointer;


}






@media(max-width:1000px){



.sidebar{


transform:translateX(-100%);


transition:.35s;


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



<a href="dashboard.php"
class="<?=($current_page=='dashboard.php')?'active':''?>">

Dashboard

</a>







<div class="menu-title">

USERS

</div>



<a href="users.php"
class="<?=($current_page=='users.php')?'active':''?>">

Users

</a>



<a href="player_management.php"
class="<?=($current_page=='player_management.php')?'active':''?>">

Players

</a>








<div class="menu-title">

PAYMENTS

</div>



<a href="approve_deposits.php"
class="<?=($current_page=='approve_deposits.php')?'active':''?>">

Deposits

</a>



<a href="approve_withdrawals.php"
class="<?=($current_page=='approve_withdrawals.php')?'active':''?>">

Withdrawals

</a>



<a href="transaction_management.php"
class="<?=($current_page=='transaction_management.php')?'active':''?>">

Transactions

</a>









<div class="menu-title">

TOURNAMENT

</div>



<a href="tournaments.php"
class="<?=($current_page=='tournaments.php')?'active':''?>">

Tournaments

</a>



<a href="tournament_create.php"
class="<?=($current_page=='tournament_create.php')?'active':''?>">

Create Tournament

</a>



<a href="tournament_manage.php"
class="<?=($current_page=='tournament_manage.php')?'active':''?>">

Manage Tournament

</a>








<div class="menu-title">

MATCH CENTER

</div>



<a href="manage_rounds.php"
class="<?=($current_page=='manage_rounds.php')?'active':''?>">

Rounds

</a>



<a href="match_asign.php"
class="<?=($current_page=='match_asign.php')?'active':''?>">

Matches

</a>



<a href="room_manager.php"
class="<?=($current_page=='room_manager.php')?'active':''?>">

Rooms

</a>



<a href="enter_result.php"
class="<?=($current_page=='enter_result.php')?'active':''?>">

Results

</a>








<div class="menu-title">

RANKING

</div>



<a href="ranking.php"
class="<?=($current_page=='ranking.php')?'active':''?>">

Ranking

</a>



<a href="qualification.php"
class="<?=($current_page=='qualification.php')?'active':''?>">

Qualification

</a>



<a href="prize_distribution.php"
class="<?=($current_page=='prize_distribution.php')?'active':''?>">

Prize Distribution

</a>








<div class="menu-title">

SYSTEM

</div>



<a href="announcements.php"
class="<?=($current_page=='announcements.php')?'active':''?>">

Announcements

</a>



<a href="settings.php"
class="<?=($current_page=='settings.php')?'active':''?>">

Settings

</a>



<a href="admin_profile.php"
class="<?=($current_page=='admin_profile.php')?'active':''?>">

Profile

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

let sidebar=document.querySelector(".sidebar");

if(sidebar){

sidebar.classList.toggle("show");

}

}



</script>