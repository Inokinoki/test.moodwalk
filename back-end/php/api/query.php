<?php
/**
 * [POST] /api/query.php
 * Param:
 *      token: string
 *      user: string
 *
 * Return:
 *      {
 *          "state": Integer,
 *          "description": String,
 *          "info": object,
 *      }
 */
if ((empty($_POST["token"]) && empty($_COOKIE["uuid"])) || empty($_POST["user"])){
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

// Prepare
$githubDefaultOPT = array(
    'User-Agent: moodwalk-test',
    'Accept: application/vnd.github.v3+json'
);
require_once("../tool/request.php");
/**
 * Github API Description:
 *      Url: https://api.github.com
 *      HTTP Head Accept: application/vnd.github.v3+json
 * 
 * List Repos:
 *  GET /users/:username/repos
 * 
 * User Infos:
 *  GET /users/:username
 * 
 * Avatar:
 *  https://avatars1.githubusercontent.com/u/:userid?v=4
 * 
 * Option:
 *  'User-Agent: moodwalk-test',
 *  'Accept: application/vnd.github.v3+json'
 */

/**
 * Feature Specification:
 *     The search result should first display the user’s avatar.
 *     Then, it should display the user’s repositories sorted by watchers.
 *     For each repository, display “name”, “description”, “watcher count”.
 */

$repoRequest = new Request("https://api.github.com/users/".$user."/repos");
$repoRequest->setOPT(CURLOPT_HTTPHEADER, $githubDefaultOPT);

$repoResult = json_decode($repoRequest->exec());

if (!is_array($repoResult)) {
    // Error message from github
    echo json_encode(
        array(
            "state"=> 2,
            "description"=> "Error when get repos from Github"
        )
    );
    exit();
}

$repos = array();

// Travel Result
foreach ($repoResult as $repo) {
    $temp = array(
        "name" => "Default",
        "description" => "Default",
        "watchers" => 0
    );
    foreach ($repo as $key => $value) {
        if (is_object($value)){
            // Jump deeper object
            continue;
        }
        // Add to json
        if ($key === "name" || $key === "description" || $key == "watchers" || $key ==="id"){
            $temp[$key] = ($value === null ? "":$value);
        }
    }
    // Init star
    $temp["star"] = false;
    // Link with database
    if (isset($temp["id"]) && isset($uid)){
        // First user info
        $starResult = $database->query("SELECT star FROM `record` WHERE githubid = '".$temp["id"]."' AND searcher = '$uid'");
        $startArray = mysqli_fetch_array($starResult);
        if (count($startArray) > 0){
            $temp["star"] = $startArray[0];
            // echo "DEBUG:".$temp["id"]." exist\n";
        } else {
            // Not exist in the DB
            //	id	name	description	watcher	searcher id	star
            $database->query("INSERT INTO record 
                (`id`, `name`, `description`, `watcher`, `searcher`, `star`, `githubid`) 
                VALUES (null, '".$temp["name"]."', '".addslashes(sprintf("%s",$temp["description"]))."',
                '".$temp["watchers"]."', '$uid', 'false', '".$temp["id"]."')");
        }
    }
    // Clear temp id
    // unset($temp["id"]); Dont clean it, we need it
    array_push($repos, $temp);
}

// Save all repos to DB

echo json_encode(
    array(
        "state"=> 0,
        "description"=> "OK",
        "info"=> $repos
    )
);