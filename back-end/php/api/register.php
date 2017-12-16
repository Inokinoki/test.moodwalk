<?php
/**
 * [POST] /api/register.php
 * Param:
 *      username: string
 *      password: string
 *
 * Return:
 *      {
 *          "state": Integer,
 *          "description": String
 *      }
 */
if (empty($_POST["username"]) || empty($_POST["password"])){
    echo json_encode(
        array(
            "state"=> 3,
            "description"=> "Param incomplete"
        )
    );
    exit();
}

$username = $_POST["username"];
$password = $_POST["password"];

require_once("../tool/database.php");
$database = new Database();

// Check existence of user
if ($database->exist("username", $username, "accounts")) {
    echo json_encode(
        array(
            "state"=> 2,
            "description"=> "User exist"
        )
    );
    exit();
}

// MD5 SHA1 ....
$password = md5($password);

$database->query("INSERT INTO `accounts` 
    (`id`, `username`, `password`, `uuid`) VALUES
    (null, '$username', '$password', '')");

echo json_encode(
    array(
        "state"=> 0,
        "description"=> "OK"
    )
);
exit();