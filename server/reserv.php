<?php 
    $type = $_POST["type"];
    $reservId = $_POST["reservId"];
    $reservElementId = $_POST["reservElementId"];
    $reservRestaurant = $_POST["reservRestaurant"];
    $reservFirstName = $_POST["reservFirstName"];
    $reservSurname = $_POST["reservSurname"];
    $reservLastName = $_POST["reservLastName"];
    $reservDateTime = $_POST["reservDateTime"];
    $reservDescription = $_POST["reservDescription"];
    $reservCost = $_POST["reservCost"];
    $reservDateTimeEnding = $_POST["reservDateTimeEnding"];


    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "rms";

    $conn = new mysqli($servername, $username, $password, $dbname);

    switch($type)
	{
        case "set_reserv":
            $sql = "SELECT * FROM restaurants";
            $result = $conn->query($sql);
            $restId = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["RestName"] == $reservRestaurant)
                    {
                        $restId = $row["Restaurant_Id"];
                        break;
                    }
                }
            }

            $sql = "SELECT * FROM reservs";
            $result = $conn->query($sql);
            
            $entry = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    /* if($row["ProdName"] == $prodName)
                    {
                        echo "Бронь на этот стол уже существует.";
                        $entry = 1;
                        break;
                    } */
                }
            }
            if($entry != 1)
            {
                $newDateTime = new DateTime($reservDateTime);
                $newDateTime->modify("+".$reservDateTimeEnding." hours");
                $reservDateTimeEnding = $newDateTime->format('Y-m-d H:i:s');
                $sql = "INSERT INTO reservs(Restaurant_Id, Element_Id, ReservFirstName, ReservSurname, ReservLastName, ReservDateTime, ReservDescription, ReservCost, ReservDateTimeEnding) 
                VALUES ('$restId', '$reservElementId', '$reservFirstName', '$reservSurname', '$reservLastName', '$reservDateTime', '$reservDescription', '$reservCost', '$reservDateTimeEnding')";

                $result = $conn->query($sql);
            }
            break;
        case "update_reserv":    
            $newDateTime = new DateTime($reservDateTime);
            $newDateTime->modify("+".$reservDateTimeEnding." hours");
            $reservDateTimeEnding = $newDateTime->format('Y-m-d H:i:s');
            $sql = "UPDATE reservs
                SET Restaurant_Id='$restId', 
                    Element_Id='$reservElementId', 
                    ReservFirstName='$reservFirstName', 
                    ReservSurname='$reservSurname', 
                    ReservLastName='$reservLastName',
                    ReservDateTime='$reservDateTime', 
                    ReservDescription='$reservDescription', 
                    ReservCost='$reservCost', 
                    ReservDateTimeEnding='$reservDateTimeEnding'
                WHERE Reserv_Id=".$reservId;
            $result = $conn->query($sql);
            break;
        case "get_reserv":
            if($reservElementId == "-1")
                $sql = "SELECT * FROM reservs ORDER BY `ReservDateTime`";
            else
                $sql = "SELECT * FROM reservs WHERE Element_Id LIKE '%".$reservElementId."%'";
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $d_counter = $counter / 10;
                    echo '<div onclick="edit_reserv(&quot;'.$row["Reserv_Id"].'&quot;)" class="list_elem" style="animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin"><p><span style="font-size: 20px;">Номер столика: '.$row["Element_Id"].'</span><br>
                            <span style="font-size: 16px;">Дата и время: '.$row["ReservDateTime"].'<br>
                            Окончание: '.$row["ReservDateTimeEnding"].'<br>
                            ФИО: '.$row["ReservSurname"].' '.$row["ReservFirstName"].' '.$row["ReservLastName"].'<br>
                            Цена: '.$row["ReservCost"].'<br>
                            Описание: '.$row["ReservDescription"].'</span></p></div>';
                            $counter ++;
                }
            }
            
            break;
        case "get_reserv_json":
            $sql = "SELECT * FROM reservs";
            $result = $conn->query($sql);
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["Reserv_Id"] == $reservId)
                    {
                        $time_diff = strtotime($row['ReservDateTimeEnding']) - strtotime($row['ReservDateTime']);
                        $information = array(
                            "ReservId"=>$row["Reserv_Id"],
                            "RestaurantId"=>$row["Restaurant_Id"],
                            "ElementId"=>$row["Element_Id"],
                            "ReservDateTime"=>date('Y-m-d\TH:i:s', strtotime($row['ReservDateTime'])),
                            "ReservSurname"=>$row['ReservSurname'],
                            "ReservFirstName"=>$row['ReservFirstName'],
                            "ReservLastName"=>$row['ReservLastName'],
                            "ReservCost"=>$row['ReservCost'],
                            "ReservDescription"=>$row['ReservDescription'],
                            "ReservDateTimeEnding"=>($time_diff/60)/60
                            );
                        echo json_encode($information);
                    }
                }
            }
            break;
        case "remove_reserv":
                $sql = "DELETE FROM reservs WHERE Reserv_Id =".$reservId;
                $result = $conn->query($sql);
            break;
    }
    echo $conn->error;
    //var_dump($result);
    $conn->close(); 
?>