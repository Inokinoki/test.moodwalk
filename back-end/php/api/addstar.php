<?php
/**
 * [POST] /api/addstar.php
 * Param:
 *      token: string
 *      id: string
 *
 * Return:
 *      {
 *          "state": Integer,
 *          "description": String
 *      }
 */
if ((empty($_POST["token"]) && empty($_COOKIE["uuid"])) || empty($_POST["id"])){
    echo json_encode(
        array(
            "state"=> 3,
            "description"=> "Param incomplete"
        )
    );
    exit();
}
if (isset($_POST["token"]))
    $uuid = $_POST["token"];
if (isset($_COOKIE["uuid"]))
    $uuid = $_COOKIE["uuid"];
$githubid = $_POST["id"];

require_once("../tool/database.php");
$database = new Database();

// Valide user logged?
if (!$database->exist("uuid", $uuid, "accounts")) {
    echo json_encode(
        array(
            "state"=> 1,
            "description"=> "No such logged user"
        )
    );
    exit();
}

// Get searcher info
$uidResult = $database->query("SELECT id FROM `accounts` WHERE uuid = '$uuid'");
if (mysqli_num_rows($uidResult) < 1) {
    echo json_encode(
        array(
            "state"=> 1,
            "description"=> "Get logged user info failed"
        )
    );
    exit();
}
$uidResult = mysqli_fetch_array($uidResult);
$uid = $uidResult['id'];

// Check existence of record
$recordResult = $database->query("SELECT id FROM `record` WHERE githubid = '$githubid' AND searcher = '$uid'");
$recordArray = mysqli_fetch_array($recordResult);
if (count($recordArray) < 1){
    echo json_encode(
        array(
            "state"=> 2,
            "description"=> "No record for this id"
        )
    );
    exit();
}

// Add star~
$id = $recordArray[0];
$database->query("UPDATE `record` SET `star` = '1' WHERE `id` = '$id'");
echo json_encode(
    array(
        "state"=> 0,
        "description"=> "OK"
    )
);
