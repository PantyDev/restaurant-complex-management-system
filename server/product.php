<?php 
    $type = $_POST["type"];
    $prodId = $_POST["prodId"];
    $prodName = $_POST["prodName"];
    $prodDescription = $_POST["prodDescription"];
    $prodType = $_POST["prodType"];
    $prodZone = $_POST["prodZone"];
    $prodCost = $_POST["prodCost"];
    $prodRating = $_POST["prodRating"];


    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "rms";

    $conn = new mysqli($servername, $username, $password, $dbname);

    switch($type)
	{
        case "set_product":
            $sql = "SELECT * FROM products";
            $result = $conn->query($sql);
            
            $entry = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["ProdName"] == $prodName)
                    {
                        echo "Продукт с таким именем уже существует.";
                        $entry = 1;
                        break;
                    }
                }
            }
            if($entry != 1)
            {
                $sql = "INSERT INTO products(ProdName, ProdDescription, ProdType, ProdZone, ProdCost, ProdRating) 
                VALUES ('$prodName', '$prodDescription', '$prodType', '$prodZone', '$prodCost', '$prodRating')";

                $result = $conn->query($sql);

                $sql = "SELECT * FROM products WHERE ProdName = '".$prodName."'";
                $result = $conn->query($sql);
                $row = $result->fetch_assoc();
                echo $row["Product_Id"];

                //Добавление новой зоны, если надо
                $add_new_zone = true;
                $sql = "SELECT * FROM product_zones";
                $result = $conn->query($sql);
                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        if($row["ProductZoneName"] == $prodZone)
                            $add_new_zone = false;
                    }
                }
                //Добавление нового типа, если надо
                $add_new_type = true;
                $sql = "SELECT * FROM product_types";
                $result = $conn->query($sql);
                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        if($row["ProductTypeName"] == $prodType)
                            $add_new_type = false;
                    }
                }

                if($add_new_zone == true)
                {
                    $sql = "INSERT INTO product_zones(ProductZoneName) 
                    VALUES ('$prodZone')";
                    $result = $conn->query($sql);
                    
                    
                }
                if($add_new_type == true)
                {
                    $sql = "INSERT INTO product_types(ProductTypeName, ProductZoneName) 
                    VALUES ('$prodType', '$prodZone')";
                    $result = $conn->query($sql);
                }
                
            }
            break;
        case "update_product":
                $sql = "UPDATE products
                    SET ProdName='$prodName', 
                        ProdDescription='$prodDescription', 
                        ProdType='$prodType', 
                        ProdZone='$prodZone', 
                        ProdCost='$prodCost', 
                        ProdRating='$prodRating'
                    WHERE Product_Id=".$prodId;
                $result = $conn->query($sql);

                $sql = "SELECT * FROM products WHERE ProdName = '".$prodName."'";
                $result = $conn->query($sql);
                $row = $result->fetch_assoc();
                echo $row["ProdName"];

                //Добавление нового типа, если надо
                $add_new_type = true;
                $sql = "SELECT * FROM product_types";
                $result = $conn->query($sql);
                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        if($row["ProductTypeName"] == $prodType || $row["ProductTypeName"] == "")
                            $add_new_type = false;
                    }
                }
 
                if($add_new_type == true)
                {
                    $sql = "INSERT INTO product_types(ProductTypeName) 
                    VALUES ('$prodType')";
                    $result = $conn->query($sql);
                }
                break;
        case "get_product":
            if($prodName == "")
                $sql = "SELECT * FROM products";
            else
                $sql = "SELECT * FROM products WHERE ProdName LIKE '%".$prodName."%'";
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $d_counter = $counter / 10;
                    echo '<div onclick="edit_prod(&quot;'.$row["ProdName"].'&quot;)" id="product_element" class="list_elem" style="animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin;
                            background:linear-gradient( rgba(255, 255, 255, 0.5) 100%, rgba(0, 0, 0, 0.5)100%),url(uploads/'.$row["Product_Id"].'.jpg); background-size: 100%; background-position:50%;">
                            <p><span style="font-size: 20px;">'.$row["ProdName"].'</span><br>
                            <span style="font-size: 16px;">Рейтинг: '.$row["ProdRating"].'<br>
                            Зона: '.$row["ProdZone"].'<br>
                            Тип: '.$row["ProdType"].'<br>
                            Цена: '.$row["ProdCost"].' грн<br>
                            Описание: '.$row["ProdDescription"].'</span></p></div>';
                            $counter ++;
                }
            }
            
            break;
        case "get_product_json":
            $sql = "SELECT * FROM products";
            $result = $conn->query($sql);
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["ProdName"] == $prodName)
                    {
                        $information = array(
                            "ProdId"=>$row["Product_Id"],
                            "ProdName"=>$row["ProdName"],
                            "ProdDescription"=>$row['ProdDescription'],
                            "ProdZone"=>$row['ProdZone'],
                            "ProdType"=>$row['ProdType'],
                            "ProdCost"=>$row['ProdCost'],
                            "ProdRating"=>$row['ProdRating']
                            );
                        echo json_encode($information);
                    }
                }
            }
            break;
        case "remove_product":
                $sql = "SELECT * FROM products WHERE Product_Id = '".$prodId."'";
                $result = $conn->query($sql);
                $row = $result->fetch_assoc();
                unlink("../uploads/".$row["ProdName"].".jpg");

                $sql = "DELETE FROM products WHERE Product_Id =".$prodId;
                $result = $conn->query($sql);
            break;
        case "remove_product_type":
            $sql = "DELETE FROM product_types WHERE ProductTypeName ='".$prodType."'";
            $result = $conn->query($sql);
            break;
        case "remove_product_zone":
            $sql = "DELETE FROM product_zones WHERE ProductZoneName ='".$prodZone."'";
            $result = $conn->query($sql);
            break;
    }
    echo $conn->error;
    //var_dump($result);
    $conn->close(); 
?>