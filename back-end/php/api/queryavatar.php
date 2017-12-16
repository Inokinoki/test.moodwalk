<?php
/**
 * [POST] /api/queryavater.php
 * Param:
 *      token: string
 *      user: string
 *
 * Return:
 *      {
 *          "state": Integer,
 *          "description": String,
 *          "info": String(url)
 *      }
 */
if (empty($_POST["token"]) || empty($_POST["user"])){
    echo json_encode(
        array(
            "state"=> 3,
            "description"=> "Param incomplete"
        )
    );
    exit();
}

$uuid = $_POST["token"];
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

// Prepare
$githubDefaultOPT = array(
    'User-Agent: moodwalk-test',
    'Accept: application/vnd.github.v3+json'
);
require_once("../tool/request.php");

$infoRequest = new Request("https://api.github.com/users/".$user);
$infoRequest->setOPT(CURLOPT_HTTPHEADER, $githubDefaultOPT);

$infoResult = json_decode($infoRequest->exec());
if (isset($infoResult->message) || count($infoResult) == 0){
    // Error/No such message
    echo json_encode(
        array(
            "state"=> 2,
            "description"=> "User not exist on Github"
        )
    );
    exit();
}

// Get avatar
$avatar_url = $infoResult->avatar_url;

echo json_encode(
    array(
        "state"=> 0,
        "description"=> "OK",
        "info"=> $avatar_url
    )
);
exit();
