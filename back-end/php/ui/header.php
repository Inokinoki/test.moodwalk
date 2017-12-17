<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="author" content="Inoki Shaw"/>
        <meta name="description" content="Test For Moodwalk"/>
        <title><?php echo $title; ?></title>
        <link rel="stylesheet" href="<?php echo SITE_ROOT; ?>/res/css/bootstrap.min.css">
        <link rel="stylesheet" href="<?php echo SITE_ROOT; ?>/res/css/custome.css">

        <!--[if lt IE 9]>
        <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
    <nav class="navbar navbar-inverse navbar-static-top">
        <div class="container">
            <div class="navbar-header">
                <!-- Switch to this toggle button in small screen -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="<?php echo SITE_ROOT; ?>/index.php">Test Moodwalk - Inoki</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                <?php
                    $user="User";
                    require_once("./tool/database.php");
                    $database = new Database();
                    if( empty($_COOKIE["uuid"]) || (!$database->exist("uuid", $_COOKIE["uuid"], "accounts"))){
                ?>
                    <li><a data-toggle="modal" data-target="#LoginModal"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span> Login</a></li>
                    <li><a data-toggle="modal" data-target="#RegisterModal"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Register</a></li>
                </ul>
            </div>
        </div>
    </nav>
<!-- Login Modal -->
<div class="modal fade" id="LoginModal" tabindex="-1" role="dialog" aria-labelledby="LoginModalLabel">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="LoginModalLabel">Login</h4>
            </div>
            <div class="modal-body">
                <form>
                    <label>Username：</label><input name="login-username" id="input-login-username" type="text" class="form-control">
                    <label>Password：</label><input name="login-password" id="input-login-password" type="password" class="form-control">
                </form>
                <br/>
                <div id="login-wrong-tip"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" id="comfirm-login-button" class="btn btn-primary" 
                    onclick="login();">Login</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="RegisterModal" tabindex="-1" role="dialog" aria-labelledby="LoginModalLabel">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="RegisterModalLabel">Register</h4>
            </div>
            <div class="modal-body">
                <form>
                    <label>Username：</label><input name="register-username" id="input-register-username" type="text" class="form-control">
                    <label>Password：</label><input name="register-password" id="input-register-password" type="password" class="form-control">
                </form>
                <br/>
                <div id="wrong-tip"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" id="comfirm-button" class="btn btn-success" onclick="register();">Register</button>
            </div>
        </div>
    </div>
</div>
                <?php
                    }else{
                    $uuid = $_COOKIE["uuid"];
                    $result = $database->query("SELECT username FROM accounts WHERE uuid = '$uuid'");
                    $result = mysqli_fetch_array($result);
                ?>
                <li><a href="<?php echo SITE_ROOT; ?>/#!"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                <?php 
                    if (empty($result[0]))
                        echo $user;
                    else 
                        echo $result[0];
                ?>
                </a></li>
                <li><a href="javascript:logout();">Logout</a></li>
            </ul>
        </div>
    </div>
</nav>
<?php
}

