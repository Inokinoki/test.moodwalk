<?php
/**
 * [GET] /api/logout.php
 * Param:
 *      token: string
 *
 * Return:
 *      {
 *          "state": Integer,
 *          "description": String
 *      }
 */
if (empty($_GET["token"])){
    echo json_encode(
        array(
            "state"=> 3,
            "description"=> "Param incomplete"
        )
    );
    exit();
}

$uuid = $_GET["token"];
require_once("../tool/database.php");
$database = new Database();

// Check existence of user
if (!$database->exist("uuid", $uuid, "accounts")) {
    echo json_encode(
        array(
            "state"=> 1,
            "description"=> "No such logged user"
        )
    );
    exit();
}

$database->query("UPDATE `accounts` SET uuid = '' WHERE uuid = '$uuid'");
// OK!
echo json_encode(
    array(
        "state"=> 0,
        "description"=> "Logout OK"
    )
);