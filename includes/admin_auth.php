<?php

// OPBattle Admin Authentication


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}



// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

function checkAdminLogin()
{

    if(!isset($_SESSION['admin_id']))
    {

        header("Location: /admin/login.php");
        exit;

    }

}




// ==========================================
// CURRENT ADMIN ID
// ==========================================

function currentAdminId()
{

    return $_SESSION['admin_id'] ?? null;

}




// ==========================================
// ADMIN LOGIN STATUS
// ==========================================

function isAdminLoggedIn()
{

    return isset($_SESSION['admin_id']);

}




// ==========================================
// ADMIN LOGOUT
// ==========================================

function adminLogout()
{

    session_unset();

    session_destroy();


    header("Location: /admin/login.php");

    exit;

}




?>