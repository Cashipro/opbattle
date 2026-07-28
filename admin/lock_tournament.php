<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

session_start();

require_once '../config.php';


if(!isset($_SESSION['admin_id'])){

    header("Location: admin_login.php");
    exit;

}



$id = $_GET['id'] ?? 0;


if(!$id){

    die("Tournament ID missing");

}



try{


$stmt=$pdo->prepare("

UPDATE tournaments

SET registration_status='locked'

WHERE id=?

");


$stmt->execute([$id]);



header("Location: tournament_manage.php?locked=success");

exit;



}
catch(PDOException $e){


echo $e->getMessage();


}


?>
