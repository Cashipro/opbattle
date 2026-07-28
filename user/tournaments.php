<?php

require_once '../config.php';
require_once '../includes/auth.php';

checkUserLogin();


$user_id = $_SESSION['user_id'];


// Current User

$stmtUser = $pdo->prepare(
"
SELECT name,balance,pubg_uid
FROM users
WHERE id=?
"
);

$stmtUser->execute([$user_id]);

$user = $stmtUser->fetch();




// Get tournaments

$stmt = $pdo->query(
"
SELECT *
FROM tournaments
WHERE status='registration'
ORDER BY id DESC
"
);


$tournaments = $stmt->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle | Tournaments
</title>


<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


*{

box-sizing:border-box;
font-family:'Segoe UI',sans-serif;

}


body{

margin:0;

background:
radial-gradient(circle at top,#182600,#050505 45%);

color:white;

min-height:100vh;

}



/* NAVBAR */


.navbar{

height:75px;

background:#0b0f19;

border-bottom:1px solid #1f2937;

display:flex;

align-items:center;

justify-content:space-between;

padding:0 40px;

}



.logo{

font-size:28px;

font-weight:1000;

letter-spacing:2px;

}


.logo span{

background:#ccff00;

color:black;

padding:4px 10px;

border-radius:8px;

}



.wallet{

background:#111827;

border:1px solid #374151;

padding:12px 20px;

border-radius:12px;

color:#ccff00;

font-weight:bold;

}



/* CONTAINER */


.container{

max-width:1200px;

margin:40px auto;

padding:0 20px;

}



.hero h1{

font-size:38px;

margin-bottom:8px;

}



.hero p{

color:#9ca3af;

}



.grid{

margin-top:35px;

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(330px,1fr));

gap:25px;

}




.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:18px;

overflow:hidden;

transition:.3s;

box-shadow:
0 15px 40px rgba(0,0,0,.4);

}



.card:hover{

transform:translateY(-5px);

border-color:#ccff00;

}



.banner{

height:160px;

background:
linear-gradient(
to top,
#0f1319,
transparent
),
url(
'https://images.unsplash.com/photo-1542751371-adc38448a05e'
)
center/cover;

display:flex;

align-items:end;

padding:20px;

}



.banner h2{

font-size:24px;

margin:0;

}




.body{

padding:20px;

}




.row{

display:flex;

justify-content:space-between;

margin-bottom:12px;

color:#9ca3af;

font-size:14px;

}



.row strong{

color:white;

}




.info{

background:#161b22;

border:1px solid #21262d;

border-radius:12px;

padding:15px;

margin:20px 0;

display:flex;

justify-content:space-between;

}



.price{

color:#ccff00;

font-size:18px;

font-weight:900;

}




.btn{

display:block;

text-align:center;

background:#ccff00;

color:black;

padding:14px;

border-radius:10px;

font-weight:900;

text-decoration:none;

}



.btn:hover{

background:#b7e600;

}




.empty{

background:#0f1319;

padding:40px;

border-radius:15px;

border:1px solid #1f2937;

text-align:center;

color:#9ca3af;

}



</style>


</head>


<body>



<div class="navbar">


<div class="logo">

<span>OP</span>BATTLE

</div>



<div class="wallet">

💰 PKR <?php echo number_format($user['balance'],2); ?>

</div>


</div>





<div class="container">


<div class="hero">

<h1>
UPCOMING BATTLES
</h1>


<p>
Join tournaments, lock your squad and fight for victory.
</p>


</div>





<div class="grid">


<?php if(count($tournaments)>0): ?>


<?php foreach($tournaments as $t): ?>


<div class="card">



<div class="banner">

<h2>

<?php echo htmlspecialchars($t['title']); ?>

</h2>

</div>



<div class="body">



<div class="row">

<span>Map</span>

<strong>
<?php echo $t['map_name']; ?>
</strong>

</div>



<div class="row">

<span>Mode</span>

<strong>
<?php echo $t['mode']; ?>
</strong>

</div>



<div class="row">

<span>Teams</span>

<strong>
<?php echo $t['maximum_teams']; ?>
</strong>

</div>



<div class="row">

<span>Start</span>

<strong>

<?php echo date(
"d M Y h:i A",
strtotime($t['match_start_time'])
); ?>

</strong>

</div>





<div class="info">


<div>

Entry

<br>

<span class="price">

PKR <?php echo number_format($t['entry_fee']); ?>

</span>


</div>



<div style="text-align:right">


Prize

<br>


<span class="price">

PKR <?php echo number_format($t['prize_pool']); ?>

</span>


</div>


</div>




<a class="btn"
href="room_slots.php?tournament_id=<?php echo $t['id']; ?>">

SELECT TEAM SLOT

</a>




</div>


</div>


<?php endforeach; ?>


<?php else: ?>


<div class="empty">

No tournaments available right now.

</div>


<?php endif; ?>



</div>


</div>



</body>

</html>