<?php

require_once '../config.php';

session_start();


if(!isset($_SESSION['admin_id'])){

header("Location: admin_login.php");
exit;

}


$message="";



if(isset($_POST['save'])){


$settings=[

'kill_point'=>$_POST['kill_point'],

'team_size'=>$_POST['team_size'],

'max_teams'=>$_POST['max_teams'],

'first_place_points'=>$_POST['first_place_points'],

'second_place_points'=>$_POST['second_place_points'],

'third_place_points'=>$_POST['third_place_points'],

'prize_admin_fee'=>$_POST['prize_admin_fee']

];




foreach($settings as $key=>$value){


$stmt=$pdo->prepare("

INSERT INTO tournament_settings

(setting_key,setting_value)

VALUES(?,?)

ON DUPLICATE KEY UPDATE

setting_value=?

");


$stmt->execute([

$key,

$value,

$value

]);


}



$message="Settings updated successfully";


}




function getSetting($pdo,$key){


$stmt=$pdo->prepare("

SELECT setting_value

FROM tournament_settings

WHERE setting_key=?

");


$stmt->execute([$key]);


$data=$stmt->fetchColumn();


return $data ?? 0;


}



?>



<!DOCTYPE html>

<html>

<head>


<title>

OPBattle Settings

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

max-width:800px;

margin:40px auto;

padding:20px;

}



h1{

color:#ccff00;

}



.card{

background:#0f1319;

border:1px solid #1f2937;

border-radius:20px;

padding:25px;

}



input{

width:100%;

padding:14px;

margin-bottom:18px;

background:#161b22;

border:1px solid #374151;

border-radius:10px;

color:white;

}



label{

display:block;

color:#9ca3af;

margin-bottom:7px;

}



button{

width:100%;

padding:15px;

background:#ccff00;

border:0;

border-radius:12px;

font-weight:900;

color:black;

cursor:pointer;

}



.alert{

background:#052e16;

color:#22c55e;

padding:15px;

border-radius:12px;

margin-bottom:20px;

}



</style>


</head>



<body>


<div class="container">



<h1>

⚙️ Tournament Settings

</h1>



<?php if($message): ?>

<div class="alert">

<?php echo $message; ?>

</div>

<?php endif; ?>





<div class="card">



<form method="post">



<label>
Kill Point
</label>

<input

type="number"

name="kill_point"

value="<?php echo getSetting($pdo,'kill_point'); ?>"

>




<label>
Team Size
</label>

<input

type="number"

name="team_size"

value="<?php echo getSetting($pdo,'team_size'); ?>"

>




<label>
Maximum Teams
</label>

<input

type="number"

name="max_teams"

value="<?php echo getSetting($pdo,'max_teams'); ?>"

>




<label>
1st Place Points
</label>

<input

type="number"

name="first_place_points"

value="<?php echo getSetting($pdo,'first_place_points'); ?>"

>




<label>
2nd Place Points
</label>

<input

type="number"

name="second_place_points"

value="<?php echo getSetting($pdo,'second_place_points'); ?>"

>




<label>
3rd Place Points
</label>

<input

type="number"

name="third_place_points"

value="<?php echo getSetting($pdo,'third_place_points'); ?>"

>




<label>
Admin Prize Fee %
</label>

<input

type="number"

name="prize_admin_fee"

value="<?php echo getSetting($pdo,'prize_admin_fee'); ?>"

>




<button name="save">

SAVE SETTINGS

</button>



</form>



</div>



</div>


</body>

</html>