<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require_once "../config.php";


if(session_status()==PHP_SESSION_NONE){

    session_start();

}



$match_id = $_GET['match_id'] ?? '';



if(!$match_id){

    die("Match ID Missing");

}






// UPDATE ROOM + STATUS

if(isset($_POST['update_match'])){


    $room_id = $_POST['room_id'] ?? '';

    $room_password = $_POST['room_password'] ?? '';

    $status = $_POST['status'] ?? 'pending';



    $stmt=$pdo->prepare("

    UPDATE matches

    SET

    room_id=?,

    room_password=?,

    status=?

    WHERE id=?

    ");



    $stmt->execute([

        $room_id,

        $room_password,

        $status,

        $match_id

    ]);



    header("Location: match-details.php?match_id=".$match_id);

    exit;


}








// ADD RESULT

if(isset($_POST['save_result'])){


    $team_name = $_POST['team_name'];

    $position = $_POST['position'];

    $kills = $_POST['kills'];



    $position_points = 0;



    if($position == 1){

        $position_points = 15;

    }

    elseif($position == 2){

        $position_points = 12;

    }

    elseif($position == 3){

        $position_points = 10;

    }

    elseif($position == 4){

        $position_points = 8;

    }



    $kill_points = $kills;



    $total_points = $position_points + $kill_points;





    $stmt=$pdo->prepare("

    INSERT INTO match_results

    (

    match_id,

    team_name,

    position,

    kills,

    position_points,

    kill_points,

    total_points

    )

    VALUES(?,?,?,?,?,?,?)

    ");



    $stmt->execute([

        $match_id,

        $team_name,

        $position,

        $kills,

        $position_points,

        $kill_points,

        $total_points

    ]);




    header("Location: match-details.php?match_id=".$match_id);

    exit;


}






// MATCH DATA

$stmt=$pdo->prepare("

SELECT *

FROM matches

WHERE id=?

");


$stmt->execute([$match_id]);


$match=$stmt->fetch(PDO::FETCH_ASSOC);



if(!$match){

    die("Match Not Found");

}



// GET PLAYERS

$stmt=$pdo->prepare("

SELECT

ts.team_number,

ts.slot_number,

u.name,

u.pubg_uid


FROM tournament_slots ts


LEFT JOIN users u

ON u.id = ts.user_id


WHERE ts.tournament_id=?

AND ts.user_id IS NOT NULL


ORDER BY ts.team_number,ts.slot_number


");


$stmt->execute([

$match['tournament_id']

]);


$players=$stmt->fetchAll(PDO::FETCH_ASSOC);







// GET RESULTS

$stmt=$pdo->prepare("

SELECT *

FROM match_results

WHERE match_id=?

ORDER BY total_points DESC

");


$stmt->execute([$match_id]);


$results=$stmt->fetchAll(PDO::FETCH_ASSOC);



?>



<!DOCTYPE html>

<html>

<head>

<title>Match Details</title>

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>


body{

margin:0;

background:#050505;

color:white;

font-family:Arial;

}



.container{

padding:25px;

}



.box{

background:#111;

border:1px solid #222;

border-radius:20px;

padding:25px;

margin-bottom:20px;

}



h1,h2{

color:#00ff84;

}



input,select{

width:100%;

padding:14px;

margin-top:10px;

background:#050505;

border:1px solid #333;

border-radius:10px;

color:white;

}



button{

margin-top:15px;

padding:14px 25px;

border:0;

border-radius:12px;

background:#00ff84;

color:black;

font-weight:bold;

cursor:pointer;

}



table{

width:100%;

border-collapse:collapse;

}



th,td{

padding:12px;

border-bottom:1px solid #333;

text-align:left;

}



@media(max-width:700px){

.container{

padding:15px;

}


table{

font-size:13px;

}


}


</style>


</head>



<body>


<div class="container">



<div class="box">


<h1>

Match Details

</h1>


<p>

Match ID:

<b><?=$match['id']?></b>

</p>


<p>

Round:

<b><?=$match['round_name']?></b>

</p>


<p>

Match Number:

<b><?=$match['match_number']?></b>

</p>


<p>

Status:

<b><?=$match['status']?></b>

</p>



</div>








<div class="box">


<h2>

Room Settings

</h2>



<form method="POST">


<p>

Room ID

</p>


<input

type="text"

name="room_id"

placeholder="Enter Room ID"

value="<?=htmlspecialchars($match['room_id'] ?? '')?>"

>



<p>

Room Password

</p>


<input

type="text"

name="room_password"

placeholder="Enter Room Password"

value="<?=htmlspecialchars($match['room_password'] ?? '')?>"

>




<p>

Match Status

</p>



<select name="status">


<option value="pending"

<?=($match['status']=="pending")?'selected':''?>

>

Pending

</option>



<option value="live"

<?=($match['status']=="live")?'selected':''?>

>

Live

</option>




<option value="completed"

<?=($match['status']=="completed")?'selected':''?>

>

Completed

</option>



</select>





<button name="update_match">

Save Match

</button>



</form>



</div>









<div class="box">


<h2>

Add Team Result

</h2>



<form method="POST">



<p>

Team Name

</p>


<input

type="text"

name="team_name"

placeholder="Team Name"

required

>




<p>

Position

</p>


<input

type="number"

name="position"

placeholder="1,2,3..."

required

>




<p>

Kills

</p>


<input

type="number"

name="kills"

placeholder="Kills"

required

>




<button name="save_result">

Save Result

</button>



</form>



</div>





<div class="box">


<h2>

Players

</h2>



<table>


<tr>

<th>Team</th>

<th>Slot</th>

<th>Name</th>

<th>PUBG UID</th>

</tr>




<?php foreach($players as $p){ ?>


<tr>


<td>

Team <?=$p['team_number']?>

</td>



<td>

<?=$p['slot_number']?>

</td>



<td>

<?=htmlspecialchars($p['name'] ?? 'Unknown')?>

</td>



<td>

<?=htmlspecialchars($p['pubg_uid'] ?? 'N/A')?>

</td>



</tr>


<?php } ?>




<?php if(empty($players)){ ?>


<tr>

<td colspan="4">

No Players Joined

</td>

</tr>


<?php } ?>



</table>


</div>









<div class="box">


<h2>

Match Results

</h2>




<table>


<tr>

<th>Rank</th>

<th>Team</th>

<th>Kills</th>

<th>Position</th>

<th>Total Points</th>

</tr>




<?php 

$rank=1;

foreach($results as $r){ 

?>



<tr>


<td>

<?=$rank?>

</td>


<td>

<?=htmlspecialchars($r['team_name'])?>

</td>


<td>

<?=$r['kills']?>

</td>


<td>

<?=$r['position']?>

</td>


<td>

<?=$r['total_points']?>

</td>



</tr>



<?php 

$rank++;

} 

?>





<?php if(empty($results)){ ?>


<tr>

<td colspan="5">

No Result Added

</td>

</tr>


<?php } ?>



</table>


</div>





</div>


</body>


</html>
