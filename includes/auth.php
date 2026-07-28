<?php

// OPBattle User Authentication

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


// ==========================================
// CHECK USER LOGIN
// ==========================================

function checkUserLogin()
{

    if(!isset($_SESSION['user_id']))
    {

        header("Location: /login.php");
        exit;

    }

}



// ==========================================
// GET CURRENT USER ID
// ==========================================

function currentUserId()
{

    return $_SESSION['user_id'] ?? null;

}



// ==========================================
// CHECK USER SESSION
// ==========================================

function isUserLoggedIn()
{

    return isset($_SESSION['user_id']);

}



// ==========================================
// USER LOGOUT
// ==========================================

function userLogout()
{

    session_unset();

    session_destroy();


    header("Location: /login.php");

    exit;

}



?>