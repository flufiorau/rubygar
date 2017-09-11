<?php

$conn = new mysqli("usejs.top", "semen574_user", "2017semen574_", "semen574_garrage");
if ($conn->connect_error) {
    die("Could not connect to database!");
} else {
    session_start();
}

$res = array('error' => false);
if (isset($_SESSION['id_user'])) {
    $signinuserid = $_SESSION['id_user'];
} else {
    $signinuserid = null;
}

$action = 'idautorizeduser';
if (isset($_GET['action'])) {
    $action = $_GET['action'];
}

if ($action == 'idautorizeduser') {
    if (isset($_SESSION['logged_user'])) {
        $res['login'] = $_SESSION['logged_user'];
    } else {
        $res['error'] = true;
        $res['message'] = "Is not logged user";
    }
}

if ($action == 'signupuser') {

    $email = $_POST['email'];
    $pass = $_POST['password'];
    $login = $_POST['login'];
    if (!isset($login)) {
        $login = $email;
    };
    $password = password_hash($pass, PASSWORD_DEFAULT);

    $result = $conn->query("INSERT INTO `users` (`email`, `password`, `login`) VALUES ('$email', '$password', '$login')");
    if ($result) {
        $res['message'] = $login . " sign up successfully";
        logged_user($login);

    } else {
        $res['error'] = true;
        $res['message'] = "Could not sign up user " . $login;
    }
}

if ($action == 'signinuser') {

    $login = $_POST['login'];
    $password = $_POST['password'];

    $result = $conn->query("SELECT * FROM `users` WHERE `login` = '$login'");
    if ($result) {
        $pswdhash = $result->fetch_assoc();
        if (password_verify($password, $pswdhash["password"])) {
            $res['message'] = "Welcome! " . $login . " sign in successfully";
            logged_user($login);
        }
    } else {
        $res['error'] = true;
        $res['message'] = "Could not sign in user" . $login;
    }
}

if ($action == 'signoutuser') {
    unset($_SESSION['logged_user']);
    unset($_SESSION['id_user']);
}


// todo actions start  ///////////////////////////////////////////////////////////
//
if ($action == 'readtodos') {
    $result = $conn->query("SELECT * FROM `todolists` WHERE `user_id`= '$signinuserid' ");
    $todos = array();

    while ($row = $result->fetch_assoc()) {
        array_push($todos, $row);
    }

    $res['todos'] = $todos;
}

if ($action == 'createtodo') {

    $todotext = $_POST['todoname'];

    $result = $conn->query("INSERT INTO `todolists` (`todoname`, `user_id`) VALUES ('$todotext', '$signinuserid')");
    if ($result) {
        $res['message'] = "todo added successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not create todo";
    }
}

if ($action == 'updatetodo') {
    $id = $_POST['id'];
    $todotext = $_POST['todoname'];

    $result = $conn->query("UPDATE `todolists` SET `todoname` = '$todotext' WHERE `id` = '$id'");
    if ($result) {
        $res['message'] = "todo updated successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not update todo";
    }
}

if ($action == 'deletetodo') {
    $id = $_POST['id'];

    $result = $conn->query("DELETE FROM `todolists` WHERE `id` = '$id'");
    if ($result) {
        $res['message'] = "todo deleted successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not delete todo";
    }
}
//
// TODO actions end  ///////////////////////////////////////////////////////////

// TASK actions start  ///////////////////////////////////////////////////////////
//
if ($action == 'readtasks') {
    $result = $conn->query("SELECT * FROM `todotasks` WHERE `user_id`='$signinuserid'");
    $tasks = array();

    while ($row = $result->fetch_assoc()) {
        array_push($tasks, $row);
    }

    $res['tasks'] = $tasks;
}

if ($action == 'createtask') {

    $tasktext = $_POST['texttask'];
    $finaldate = $_POST['finaldate'];
    $todoid = $_POST['todoid'];

    $result = $conn->query("INSERT INTO `todotasks` (`texttask`, `finaldate`, `todoid`, `user_id`) VALUES ('$tasktext', '$finaldate', '$todoid', '$signinuserid')");
    if ($result) {
        $res['message'] = "Task added successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not create task";
    }
}

if ($action == 'updatetask') {
    $id = $_POST['id'];
    $tasktext = $_POST['texttask'];
    $finaldate = $_POST['finaldate'];
    $result = $conn->query("UPDATE `todotasks` SET `texttask` = '$tasktext' , `finaldate` = '$finaldate' WHERE `id` = '$id'");
    if ($result) {
        $res['message'] = "Task updated successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not update task";
    }
}

if ($action == 'completedtask') {
    $id = $_POST['id'];
    $iscomplete = $_POST['iscomplete'];
    if ($iscomplete == 0) {
        $iscomplete = 1;
    } else {
        $iscomplete = 0;
    }
    $result = $conn->query("UPDATE `todotasks` SET `iscomplete` = '$iscomplete'  WHERE `id` = '$id'");

    if ($result) {
        $res['message'] = "";
    } else {
        $res['error'] = true;
        $res['message'] = "";
    }
}

if ($action == 'deletetask') {
    $id = $_POST['id'];

    $result = $conn->query("DELETE FROM `todotasks` WHERE `id` = '$id'");
    if ($result) {
        $res['message'] = "Task deleted successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not delete task";
    }
}
//
// TASK actions end  ///////////////////////////////////////////////////////////

function logged_user($login)
{
    $_SESSION['logged_user'] = $login;
    global $conn;
    $query = $conn->query("SELECT * FROM `users` WHERE `login`='$login'");
    $result = $query->fetch_assoc();
    $_SESSION['id_user'] = $result['id'];
}

$conn->close();

header("Content-type: application/json");
echo json_encode($res);
die();
?>