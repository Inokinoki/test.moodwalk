<?php
/**
 * [GET] /api/userexist.php
 * Param:
 *      username: string
 *
 * Return:
 *      {
 *          "state": Integer,
 *          "description": String
 *      }
 */
if (empty($_POST["username"])){
    echo json_encode(
        array(
            "state"=> 3,
            "description"=> "Param incomplete"
        )
    );
    exit();
}

$username = $_POST["username"];

require_once("../tool/database.php");
$database = new Database();
// Check existence of user
if (!$database->exist("username", $username, "accounts")) {
    echo json_encode(
        array(
            "state"=> 1,
            "description"=> "No such user"
        )
    );
    exit();
}

echo json_encode(
    array(
        "state"=> 0,
        "description"=> "User exist"
    )
);
exit();