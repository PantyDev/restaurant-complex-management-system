<?php 
    $case = $_POST['case'];

    $id = json_decode($_POST['id']);
    $type = json_decode($_POST['type']);
    $posX = json_decode($_POST['posX']);
    $posY = json_decode($_POST['posY']);
    $cellSize = $_POST['cellSize'];
    $areaSizeX = $_POST['areaSizeX'];
    $areaSizeY = $_POST['areaSizeY'];
    $restName = $_POST['restName'];

    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "rms";

    $conn = new mysqli($servername, $username, $password, $dbname);
    
    $rest_Name = str_replace(" ","_",$restName);

    switch($case)
    {
    /* $sql = "REPLACE INTO map_param(ID, CellSize, AreaSize) VALUES (1,'$cellSize', '$areaSize')";
    $result = $conn->query($sql); */
        case "set_map":
            $dt = '';
            $dtf = '';
            for ($i = 0; $i < count($id); $i++) {
                    $data[$i] = "('".$type[$i]."','".$posX[$i]."','".$posY[$i]."')";
            }
            for ($i = 0; $i < count($id); $i++) {

                if($data[$i] != '')
                    $dt = $dt.$data[$i].',';
            }


            $dt = substr($dt,0,-1);
            echo $dt;

            $sql = "CREATE TABLE IF NOT EXISTS `map_".$rest_Name."` (`Element_Id` INT AUTO_INCREMENT NOT NULL, `ElementType` varchar(200), `PosX` int(200), `PosY` int(20), PRIMARY KEY (`Element_Id`))";
            $result = $conn->query($sql);
            
            $sql = "TRUNCATE map_".$rest_Name;
            $result = $conn->query($sql);

            $sql = "INSERT INTO map_".$rest_Name."(ElementType, PosX, PosY) VALUES $dt";
            echo $dt;
            $result = $conn->query($sql);
        break;
    }
    if($case == "get_map" || $case == "get_map_select_table")
    {
        define("CELL_SIZE", 20);
        $sql = "SELECT * FROM map_".$rest_Name;
        $result = $conn->query($sql);
        $big_block = 4*CELL_SIZE;
        $small_block = 2*CELL_SIZE;
        $table_counter = 0;

        if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    //echo "<br> ID: ".$row["ID"]."<br>ElementType: ".$row["ElementType"]."<br>PosX:".$row["PosX"]."<br>PosY:".$row["PosY"];
                    if($row["ElementType"]=="block horizontal_wall")
                        echo '<div class="'.$row["ElementType"].'" id="'.$row["Element_Id"].'" 
                        style="left:'.$row["PosX"].'; top:'.$row["PosY"].'; 
                        width:'.$big_block.'px; height: '.$small_block.'px; background: #695d6d;"></div>';
                    if($row["ElementType"]=="block vertical_wall")
                        echo '<div class="'.$row["ElementType"].'" id="'.$row["Element_Id"].'" 
                        style="left:'.$row["PosX"].'; top:'.$row["PosY"].'; 
                        width:'.$small_block.'px; height: '.$big_block.'px; background: #695d6d;"></div>';
                    if($row["ElementType"]=="block chair")
                        echo '<div class="'.$row["ElementType"].'" id="'.$row["Element_Id"].'" 
                        style="left:'.$row["PosX"].'; top:'.$row["PosY"].'; 
                        width:'.$small_block.'px; height: '.$small_block.'px; background: #dfaa86; border-radius: 10px;"></div>';
                    if($row["ElementType"]=="block table")
                    {
                        if($case == "get_map_select_table")
                        {
                            $table_counter ++;
                            echo '<div onclick="gotoTableSettings(&quot;'.$rest_Name.'&quot;,'.$row["Element_Id"].','.$table_counter.')" class="'.$row["ElementType"].''.$select.' selectable_table" id="'.$row["Element_Id"].'" 
                            style="left:'.$row["PosX"].'; top:'.$row["PosY"].'; 
                            width: '.$big_block.'px; height: '.$big_block.'px; background: #df8686; border-radius: 10px;  display: flex; justify-content: center; align-items: center;">
                            '.$table_counter.'</div>';
                        }
                        if ($case == "get_map")
                        {
                            echo '<div class="'.$row["ElementType"].''.$select.'" id="'.$row["Element_Id"].'" 
                            style="left:'.$row["PosX"].'; top:'.$row["PosY"].'; 
                            width: '.$big_block.'px; height: '.$big_block.'px; background: #df8686; border-radius: 10px;"></div>';
                        }
                    }
                }
            }
    }

    echo $conn->error;
    $conn->close();
?>