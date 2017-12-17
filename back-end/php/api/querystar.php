<?php
/**
 * [POST] /api/querystar.php
 * Param:
 *      token: string
 *
 * Return:
 *      {
 *          "state": Integer,
 *          "description": String,
 *          "info": object
 *      }
 */
if ((empty($_POST["token"]) && empty($_COOKIE["uuid"]))){
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
$user = $_POST["user"];

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
$uidResult = mysqli_fetch_array($uidResult);
if (count($uidResult) > 0) {
    $uid = $uidResult[0];
}

$repos = array();

// Query all
$repoResult = $database->query("SELECT * FROM `record` WHERE searcher = '$uid' AND star = '1'");
$repoResult = mysqli_fetch_array($repoResult);
if (count($repoResult) > 0) {
    foreach ($repoResult as $repo) {
        array_push($repos, array(
            "name" => $repo["name"],
            "description" => $repo["description"],
            "watchers" => $repo["watcher"],
            "id" => $repo["githubid"],
            "star" => $repo["star"]
        ));
    }
}

echo json_encode(
    array(
        "state"=> 0,
        "description"=> "OK",
        "info"=> $repos
    )
);