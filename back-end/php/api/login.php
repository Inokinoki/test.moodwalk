<?php
/**
 * [POST] /api/login.php
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
if (!$database->exist("username", $username, "accounts")) {
    echo json_encode(
        array(
            "state"=> 2,
            "description"=> "No such user"
        )
    );
    exit();
}

// Query user
$result = $database->query("SELECT * FROM `accounts` WHERE username = '$username'");
if (mysqli_num_rows($result) > 0){
    $result = mysqli_fetch_array($result);
    if ( $result["password"] == $password ){
        // Right password, generate uuid and set it to cookies
        $id = $result['id'];
        $uuid = uniqid();
        $database->query("UPDATE `accounts` SET uuid = '$uuid' WHERE id = $id");
        // OK!
        echo json_encode(
            array(
                "state"=> 0,
                "description"=> $uuid
            )
        );
        exit();
    } else {
        // Wrong password, return 1.
        echo json_encode(
            array(
                "state"=> 1,
                "description"=> "Password Wrong"
            )
        );
        exit();
    }
} else {
    // No record, strange state
    echo json_encode(
        array(
            "state"=> 4,
            "description"=> "No such user"
        )
    );
    exit();
}