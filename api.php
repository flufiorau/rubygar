<?php

$conn = new mysqli("usejs.top", "semen574_user", "2017semen574_", "semen574_garrage");
if ($conn->connect_error){
    die("Could not connect to database!");
}

$res = array('error' => false);

$action = 'readtasks';
if(isset($_GET['action'])){
    $action = $_GET['action'];
}


if($action == 'createuser') {

    $username = $_POST['username'];
    $password = $_POST['password'];
//	echo password_hash("rasmuslerdorf", PASSWORD_BCRYPT, $options)."\n";
    $result = $conn->query("INSERT INTO `users` (`username`, `password`) VALUES ('$username', '$password')");
    if ($result) {
        $res['message'] = "user added successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not create user";
    }
} 


// todo actions start  ///////////////////////////////////////////////////////////
//
if($action == 'readtodos') {
    $result = $conn->query("SELECT * FROM `todolists`");
    $todos = array();

    while ($row = $result->fetch_assoc()){
        array_push($todos, $row);
    }

    $res['todos'] = $todos;
}

if($action == 'createtodo') {

    $todotext = $_POST['todoname'];

    $result = $conn->query("INSERT INTO `todolists` (`todoname`) VALUES ('$todotext')");
    if ($result) {
        $res['message'] = "todo added successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not create todo";
    }
} 

if($action == 'updatetodo') {
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

if($action == 'deletetodo') {
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
if($action == 'readtasks') {
    $result = $conn->query("SELECT * FROM `todotasks`");
    $tasks = array();

    while ($row = $result->fetch_assoc()){
        array_push($tasks, $row);
    }

    $res['tasks'] = $tasks;
}

if($action == 'createtask') {

    $tasktext = $_POST['texttask'];
    $finaldate = $_POST['finaldate'];
    $todoid = $_POST['todoid'];

    $result = $conn->query("INSERT INTO `todotasks` (`texttask`, `finaldate`, `todoid`) VALUES ('$tasktext', '$finaldate', '$todoid')");
    if ($result) {
        $res['message'] = "Task added successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not create task";
    }
} 

if($action == 'updatetask') {
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

if($action == 'completedtask') {
    $id = $_POST['id'];
    $iscomplete = $_POST['iscomplete'];
    if($iscomplete == 0) {
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

if($action == 'deletetask') {
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
// TASK actions start  ///////////////////////////////////////////////////////////



$conn->close();

header("Content-type: application/json");
echo json_encode($res);
die();
?>