<?php 
    $session = $_POST['session'];
    $status = json_decode($_POST['status']);
    $update = $_POST['update'];
    $type = $_POST['type'];
    $session_userName = $_POST['userName'];

    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "rms";

    $conn = new mysqli($servername, $username, $password, $dbname);

    $sql = "";

    switch($type)
    {
        case "set_session":
            if($update == "false")
                $sql = "INSERT INTO sessions(SessionId, Status, UserName) VALUES ('$session', '$status', 'none')";
            else if($update == "secret_password") $sql = "UPDATE sessions SET Status = '1', UserName = '$session_userName' WHERE sessions.SessionId = '$session'";
            echo $session;

            $result = $conn->query($sql);
            break;
        case "get_session":
            $sql = "SELECT * FROM sessions";
            $result = $conn->query($sql);

            $loginName = "";

            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["SessionId"] == $session && $row["Status"] == 1)
                        $loginName = $row["UserName"];
                    
                }
            }

            if($loginName != "")
            {
                $sql = "SELECT * FROM users";
                $result = $conn->query($sql);

                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        if($row["UserName"] == $loginName)
                        {
                            $data = array(
                                'Logged' => "yes; logged", 
                                'Login' => $row["UserName"],
                                'Password' => $row["Password"]);
                            echo json_encode($data);
                            break;
                        }
                        
                    }
                }
            }
            break;
        case "remove_session":
            $sql = "DELETE FROM sessions WHERE SessionId='$session'";
            
            $result = $conn->query($sql);
            break;
    }

    //var_dump($result);
    $conn->close(); 
?>