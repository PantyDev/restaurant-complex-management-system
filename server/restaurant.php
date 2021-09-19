<?php 
    $type = $_POST["type"];
    $restId = $_POST["restId"];
    $restName = $_POST["restName"];
    $restFounders = $_POST["restFounders"];
    $restDescription = $_POST["restDescription"];
    $restProductRange = $_POST["restProductRange"];
    $restClassification = $_POST["restClassification"];
    $restLocation = $_POST["restLocation"];
    $restAdress = $_POST["restAdress"];
    $restNumbers = $_POST["restNumbers"];
    $restEMail = $_POST["restEMail"];

    

    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "rms";

    $conn = new mysqli($servername, $username, $password, $dbname);

    switch($type)
	{
        case "set_restaurant":
            $sql = "SELECT * FROM restaurants";
            $result = $conn->query($sql);
            
            $entry = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["RestName"] == $restName)
                    {
                        echo "Ресторан с таким именем уже существует.";
                        $entry = 1;
                        break;
                    }
                }
            }
            if($entry != 1)
            {
                $sql = "INSERT INTO restaurants(RestName, RestFounders, RestDescription, RestProductRange, RestClassification, RestLocation, RestAdress, RestNumbers, RestEMail) 
                VALUES ('$restName', '$restFounders', '$restDescription', '$restProductRange', '$restClassification', '$restLocation', '$restAdress', '$restNumbers', '$restEMail')";

                $result = $conn->query($sql);
            }
            break;
        case "update_restaurant":
            $sql = "SELECT * FROM restaurants";
            $result = $conn->query($sql);

            $restBufName = "";
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["Restaurant_Id"] == $restId)
                    {
                        $restBufName = $row["RestName"];
                        break;
                    }
                }
            }
            $rest_Buf_Name = str_replace(" ","_",$restBufName);
            $sql = "ALTER TABLE map_".$rest_Buf_Name." RENAME TO map_".str_replace(" ","_",$restName);
            $result = $conn->query($sql);

            $sql = "UPDATE restaurants
                SET RestName='$restName', 
                    RestFounders='$restFounders', 
                    RestDescription='$restDescription', 
                    RestProductRange='$restProductRange', 
                    RestClassification='$restClassification', 
                    RestLocation='$restLocation', 
                    RestAdress='$restAdress', 
                    RestNumbers='$restNumbers', 
                    RestEMail='$restEMail'
                WHERE Restaurant_Id=".$restId;
            $result = $conn->query($sql);

            
            break;
        case "get_restaurant":
            if($restName == "")
                $sql = "SELECT * FROM restaurants";
            else
                $sql = "SELECT * FROM restaurants WHERE RestName LIKE '%".$restName."%'";
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $d_counter = $counter / 10;
                    echo '<div onclick="edit_rest(&quot;'.$row["RestName"].'&quot;)" class="list_elem" style="animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin"><p><span style="font-size: 20px;">'.$row["RestName"].'</span><br>
                            <span style="font-size: 16px;">Класс: '.$row["RestClassification"].'<br>
                            Учредители: '.$row["RestFounders"].'<br>
                            Адрес: '.$row["RestAdress"].'<br>
                            Описание: '.$row["RestDescription"].'</span></p></div>';
                            $counter ++;
                }
            }
            
            break;
        case "get_restaurant_json":
            $sql = "SELECT * FROM restaurants";
            $result = $conn->query($sql);
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["RestName"] == $restName)
                    {
                        $information = array(
                            "RestId"=>$row["Restaurant_Id"],
                            "RestName"=>$row["RestName"],
                            "RestFounders"=>$row['RestFounders'],
                            "RestDescription"=>$row['RestDescription'],
                            "RestProductRange"=>$row['RestProductRange'],
                            "RestClassification"=>$row['RestClassification'],
                            "RestLocation"=>$row['RestLocation'],
                            "RestAdress"=>$row['RestAdress'],
                            "RestNumbers"=>$row['RestNumbers'],
                            "RestEMail"=>$row['RestEMail']
                            );
                        echo json_encode($information);
                    }
                }
            }
            break;
        case "remove_restaurant":
            $sql = "SELECT * FROM restaurants";
            $result = $conn->query($sql);

            $restBufName = "";
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["Restaurant_Id"] == $restId)
                    {
                        $restBufName = $row["RestName"];
                        break;
                    }
                }
            }
            $rest_Buf_Name = str_replace(" ","_",$restBufName);

            $sql = "DROP TABLE map_".$rest_Buf_Name;
            $result = $conn->query($sql);

            $sql = "DELETE FROM restaurants WHERE Restaurant_Id =".$restId;
            $result = $conn->query($sql);
        break;
    }
    echo $conn->error;
    //var_dump($result);
    $conn->close(); 
?>