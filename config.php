<?php
// Session save path ko custom local folder par set karna taake permission error na aaye
$session_path = __DIR__ . '/sessions';
if (!is_dir($session_path)) {
    mkdir($session_path, 0777, true);
}
session_save_path($session_path);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Configuration (Updated according to your hosting panel)
define('DB_HOST', 'sql210.infinityfree.com');
define('DB_USER', 'if0_42513623');
define('DB_PASS', 'Gateway2977');
define('DB_NAME', 'if0_42513623_opbattle');

// Site Constants
define('SITE_NAME', 'PUBG Tournament Hub');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}
?>
