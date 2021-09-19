<?php 
    $type = $_POST["type"];
    $emplId = $_POST["emplId"];
    $emplUserName = $_POST["emplUserName"];
    $emplPassword = $_POST["emplPassword"];
    $emplUserType = $_POST["emplUserType"];
    $emplName = $_POST["emplName"];
    $emplSurname = $_POST["emplSurname"];
    $emplLastName = $_POST["emplLastName"];
    $emplBirthdate = $_POST["emplBirthdate"];
    $emplHiringdate = $_POST["emplHiringdate"];
    $emplPhoneNumber = $_POST["emplPhoneNumber"];
    $emplRole = $_POST["emplRole"];
    $emplSex = $_POST["emplSex"];
    $emplFixedRate = $_POST["emplFixedRate"];
    $emplGeneralCache = $_POST["emplGeneralCache"];
    $emplPercent = $_POST["emplPercent"];
    $emplDaysWorked = $_POST["emplDaysWorked"];
    $emplChecksCount = $_POST["emplChecksCount"];
    $emplDescription = $_POST["emplDescription"];
    $emplRating = $_POST["emplRating"];
    $emplRestaurants = $_POST["emplRestaurants"];

    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "rms";

    $conn = new mysqli($servername, $username, $password, $dbname);

    switch($type)
	{
        case "set_employee":
            $sql = "SELECT * FROM users";
            $result = $conn->query($sql);
            
            $entry = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["UserName"] == $emplUserName)
                    {
                        echo "Сотрудник с таким логином уже существует.";
                        $entry = 1;
                        break;
                    }
                }
            }
            if($entry != 1)
            {
                $sql = "INSERT INTO users(UserName, Password, UserType, Name, Surname, LastName, Birthdate, Hiringdate, PhoneNumber, Role, Sex, 
                FixedRate, GeneralCache, Percent, DaysWorked, ChecksCount, Description, Rating, Restaurants) 
                VALUES ('$emplUserName', '$emplPassword', '$emplUserType', '$emplName', '$emplSurname', '$emplLastName', '$emplBirthdate', '$emplHiringdate ', '$emplPhoneNumber', 
                        '$emplRole', '$emplSex', '$emplFixedRate', '$emplGeneralCache', '$emplPercent', '$emplDaysWorked ', '$emplChecksCount', '$emplDescription', '$emplRating', 
                        '$emplRestaurants')";

                $result = $conn->query($sql);
            }
            break;
        case "update_employee":
            $sql = "UPDATE users
                SET UserName='$emplUserName',
                    Password='$emplPassword',
                    UserType='$emplUserType',
                    Name='$emplName',
                    Surname='$emplSurname',
                    LastName='$emplLastName',
                    Birthdate='$emplBirthdate',
                    Hiringdate='$emplHiringdate',
                    PhoneNumber='$emplPhoneNumber',
                    Role='$emplRole',
                    Sex='$emplSex',
                    FixedRate='$emplFixedRate',
                    GeneralCache='$emplGeneralCache',
                    Percent='$emplPercent',
                    DaysWorked='$emplDaysWorked',
                    ChecksCount='$emplChecksCount',
                    Description='$emplDescription',
                    Rating='$emplRating',
                    Restaurants='$emplRestaurants'
                WHERE Id=".$emplId;
            echo $sql;
            $result = $conn->query($sql);
            break;
        case "get_employee":
            if($emplUserName == "")
                $sql = "SELECT * FROM users";
            else
                $sql = "SELECT * FROM users WHERE CONCAT(Surname, ' ', Name, ' ', LastName) LIKE '%".$emplUserName."%'";
            
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $d_counter = $counter / 10;
                    echo '<div onclick="edit_empl(&quot;'.$row["UserName"].'&quot;)" class="list_elem" style="animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin"><p><span style="font-size: 20px;">'.$row["Surname"].' '.$row["Name"].' '.$row["LastName"].'</span><br>
                            <span style="font-size: 16px;">
                            Тип пользователя: '.$row["UserType"].'<br>
                            Роль пользователя: '.$row["Role"].'<br>
                            Номер телефона: '.$row["PhoneNumber"].'<br>
                            Дата рождения: '.$row["Birthdate"].'<br>
                            Описание: '.$row["Description"].'</span></p></div>';
                            $counter ++;
                }
            }
            
            break;
        case "get_employee_json":
            $sql = "SELECT * FROM users";
            $result = $conn->query($sql);
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["UserName"] == $emplUserName)
                    {
                        $information = array(
                            "Id"=>$row["Id"],
                            "Surname"=>$row["Surname"],
                            "Name"=>$row["Name"],
                            "LastName"=>$row["LastName"],
                            "Sex"=>$row["Sex"],
                            "Birthdate"=>$row["Birthdate"],
                            "Hiringdate"=>$row["Hiringdate"],
                            "PhoneNumber"=>$row["PhoneNumber"],
                            "Description"=>$row["Description"],
                            "Rating"=>$row["Rating"],
                            "UserName"=>$row["UserName"],
                            "Password"=>$row["Password"],
                            "UserType"=>$row["UserType"],
                            "FixedRate"=>$row["FixedRate"],
                            "Role"=>$row["Role"],
                            "GeneralCache"=>$row["GeneralCache"],
                            "Percent"=>$row["Percent"],
                            "DaysWorked"=>$row["DaysWorked"],
                            "ChecksCount"=>$row["ChecksCount"],
                            "Restaurants"=>$row["Restaurants"]
                            );
                        echo json_encode($information);
                    }
                }
            }
            break;
        case "remove_employee":
            $sql = "DELETE FROM users WHERE Id =".$emplId;
            $result = $conn->query($sql);
        break;
    }
    echo $conn->error;
    //var_dump($result);
    $conn->close(); 
?>