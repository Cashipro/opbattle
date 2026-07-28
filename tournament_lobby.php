<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

session_start();

require_once 'config.php';



if(!isset($_SESSION['user_id'])){

    header("Location: login.php");
    exit;

}


$user_id = $_SESSION['user_id'];

$tournament_id = $_GET['tournament'] ?? 0;



if(!$tournament_id){

    die("Tournament not found");

}



$message = "";

$error = "";



// CHECK PAYMENT

$pay = $pdo->prepare("

SELECT id

FROM transactions

WHERE user_id=?

AND tournament_id=?

AND transaction_type='entry_fee'

AND payment_status='approved'

");


$pay->execute([

$user_id,
$tournament_id

]);



if(!$pay->fetch()){


    die("Please join tournament first.");

}





// JOIN SLOT


if(isset($_POST['join_slot'])){


    $team_id = $_POST['team_id'];
    $slot = $_POST['slot'];



    // CHECK ALREADY JOINED


    $check = $pdo->prepare("

    SELECT id

    FROM tournament_team_players

    WHERE tournament_id=?

    AND user_id=?

    ");


    $check->execute([

    $tournament_id,
    $user_id

    ]);



    if($check->fetch()){


        $error="You already joined a team.";


    }

    else{


        // CHECK SLOT EMPTY


        $slotCheck=$pdo->prepare("

        SELECT id

        FROM tournament_team_players

        WHERE team_id=?

        AND slot_number=?

        ");


        $slotCheck->execute([

        $team_id,
        $slot

        ]);



        if($slotCheck->fetch()){


            $error="Slot already taken.";


        }

        else{


            // CHECK TEAM COUNT


            $count=$pdo->prepare("

            SELECT COUNT(*)

            FROM tournament_team_players

            WHERE team_id=?

            ");


            $count->execute([$team_id]);


            if($count->fetchColumn() >= 4){


                $error="Team is full.";


            }

            else{


                $insert=$pdo->prepare("

                INSERT INTO tournament_team_players

                (

                tournament_id,

                team_id,

                user_id,

                slot_number

                )

                VALUES

                (?,?,?,?)

                ");



                $insert->execute([

                $tournament_id,
                $team_id,
                $user_id,
                $slot

                ]);



                $message="Joined team successfully.";


            }


        }


    }


}




// GET TEAMS


$teams=$pdo->prepare("

SELECT *

FROM tournament_teams

WHERE tournament_id=?

ORDER BY team_number ASC

");


$teams->execute([$tournament_id]);


$teams=$teams->fetchAll();



?>



<!DOCTYPE html>

<html>

<head>

<title>
OPBattle Lobby
</title>


<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


*{

box-sizing:border-box;

font-family:Segoe UI,sans-serif;

}



body{

margin:0;

background:
radial-gradient(circle at top,#263800,#050505);

color:white;

}



.container{

max-width:1300px;

margin:auto;

padding:20px;

}



h1{

color:#ccff00;

}



.grid{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(280px,1fr));

gap:20px;

}



.team{

background:#0f1319;

border:1px solid #333;

border-radius:20px;

padding:20px;

}



.team h2{

color:#ccff00;

}



.player{

background:#161b22;

padding:12px;

border-radius:10px;

margin:8px 0;

}



.empty{

background:#052e16;

color:#22c55e;

padding:12px;

border-radius:10px;

}



button{

width:100%;

padding:10px;

border:0;

border-radius:10px;

background:#ccff00;

font-weight:bold;

cursor:pointer;

}



.alert{

padding:15px;

border-radius:10px;

background:#052e16;

margin-bottom:20px;

}



.error{

background:#450a0a;

}



.uid{

color:#9ca3af;

font-size:12px;

}



</style>


</head>


<body>



<div class="container">


<h1>
🎮 OPBattle Tournament Lobby
</h1>



<?php if($message){ ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php } ?>



<?php if($error){ ?>

<div class="alert error">

<?php echo $error; ?>

</div>

<?php } ?>





<div class="grid">



<?php foreach($teams as $team){ ?>


<div class="team">


<h2>

TEAM <?php echo $team['team_number']; ?>

</h2>



<?php


$players=$pdo->prepare("

SELECT

u.name,

u.pubg_uid,

tp.slot_number


FROM tournament_team_players tp


JOIN users u

ON u.id=tp.user_id


WHERE tp.team_id=?


ORDER BY tp.slot_number


");


$players->execute([$team['id']]);


$data=$players->fetchAll();





for($i=1;$i<=4;$i++){



$found=false;



foreach($data as $p){


if($p['slot_number']==$i){


$found=true;


?>


<div class="player">

<b>
<?php echo htmlspecialchars($p['name']); ?>
</b>

<br>

<span class="uid">

PUBG UID:
<?php echo htmlspecialchars($p['pubg_uid']); ?>

</span>

</div>


<?php


}



}





if(!$found){


?>


<form method="post">


<input type="hidden" name="team_id" value="<?php echo $team['id']; ?>">


<input type="hidden" name="slot" value="<?php echo $i; ?>">



<div class="empty">


<button name="join_slot">

+ JOIN SLOT <?php echo $i; ?>

</button>


</div>


</form>


<?php


}



}



?>


</div>



<?php } ?>



</div>



</div>


</body>

</html>
