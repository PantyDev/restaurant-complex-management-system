<?php 
    $type = $_POST["type"];
    $orderId = $_POST["orderId"];
    $orderTableId = $_POST["orderTableId"];
    $orderRestName = $_POST["orderRestName"];
    $orderGuestType = $_POST["orderGuestType"];
    $orderGuestCount = $_POST["orderGuestCount"];
    $orderDiscount = $_POST["orderDiscount"];
    $orderStatus = $_POST["orderStatus"];
    $orderPrice = $_POST["orderPrice"];
    $orderUserType = $_POST["orderUserType"];
    $orderUserLogin = $_POST["orderUserLogin"];

    $prodZone = $_POST["prodZone"];
    $prodType = $_POST["prodType"];

    $orderProductId = $_POST["orderProductId"];
    $orderProductCount = $_POST["orderProductCount"];
    $orderProductServing = $_POST["orderProductServing"];
    $orderProductComment = $_POST["orderProductComment"];

    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "rms";

    $conn = new mysqli($servername, $username, $password, $dbname);

    switch($type)
	{
        case "set_order":
            $sql = "INSERT INTO orders(OrderTableId, OrderRestName, OrderGuestType, OrderGuestCount, OrderDiscount, OrderStatus, OrderPrice, OrderUserType, OrderUserLogin) 
            VALUES ('$orderTableId', '$orderRestName', '$orderGuestType', '$orderGuestCount', '$orderDiscount', '$orderStatus', '$orderPrice', '$orderUserType', '$orderUserLogin')";
            
            $result = $conn->query($sql);
            echo $conn->insert_id;
            break;
        case "remove_order":
            $sql = "DELETE FROM orders WHERE Order_Id =".$orderId;
            $result = $conn->query($sql);
            $sql = "DELETE FROM order_products WHERE OrderId =".$orderId;
            $result = $conn->query($sql);
        break;
        case "get_order":
            $sql = "SELECT * FROM orders";
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["OrderTableId"] == $orderTableId && $row["OrderRestName"] == $orderRestName)
                    {
                        $d_counter = $counter / 10;
                        echo '<div onclick="check_order_status(&quot;'.$row["Order_Id"].'&quot;)" class="list_elem" style="animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin"><p><span style="font-size: 20px;">Заказ номер '.$row["Order_Id"].'</span><br>
                            <span style="font-size: 16px;">Ресторан: '.$row["OrderRestName"].'<br>
                            Номер столика: '.$row["OrderTableId"].'<br>
                            Сумма заказа: '.$row["OrderPrice"].' '.$row["ReservFirstName"].' '.$row["ReservLastName"].'<br>
                            Скидка: '.$row["OrderDiscount"].'<br>
                            Тип гостей: '.$row["OrderGuestType"].'<br>
                            Количество гостей: '.$row["OrderGuestCount"].'<br>
                            Cтатус: '.$row["OrderStatus"].'</span></p></div>';
                            $counter ++;
                    }
                }
            }
            break;
        case "get_order_json":
            $sql = "SELECT * FROM order_products";
            $result = $conn->query($sql);
            $hasProducts = "no";
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["OrderId"] == $orderId)
                    {
                        $hasProducts = "yes";
                    }
                }
            }

            $sql = "SELECT * FROM orders";
            $result = $conn->query($sql);
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["Order_Id"] == $orderId)
                    {
                        $information = array(
                            "Order_Id"=>$row["Order_Id"],
                            "OrderTableId"=>$row["OrderTableId"],
                            "OrderRestName"=>$row["OrderRestName"],
                            "OrderGuestType"=>$row['OrderGuestType'],
                            "OrderGuestCount"=>$row['OrderGuestCount'],
                            "OrderDiscount"=>$row['OrderDiscount'],
                            "OrderStatus"=>$row['OrderStatus'],
                            "OrderPrice"=>$row['OrderPrice'],
                            "OrderType"=>$row['OrderType'],
                            "HasProducts"=>$hasProducts
                            );
                        echo json_encode($information);
                    }
                }
            }
            break;
        case "set_order_product":
            $sql = "INSERT INTO order_products(OrderId, ProductId, ProductCount, ProductServing, ProductComment) 
            VALUES ('$orderId', '$orderProductId', '$orderProductCount', '$orderProductServing', '$orderProductComment')";
            
            $result = $conn->query($sql);
            break;
        case "get_order_product":
            $sql = "SELECT * FROM order_products";
            $result = $conn->query($sql);
            $counter = 0;
            $o_productId = array();
            $productId = array();
            $o_orderId = array();
            $productCount = array();
            $productServing = array();
            $productComment = array();
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["OrderId"] == $orderId)
                    {
                        $o_productId[$counter] = $row["OrderProd_Id"];
                        $o_orderId[$counter] = $row["OrderId"];
                        $productId[$counter] = $row["ProductId"];
                        $productCount[$counter] = $row["ProductCount"];
                        $productServing[$counter] = $row["ProductServing"];
                        $productComment[$counter] = $row["ProductComment"];
                        $counter ++;
                    }
                }
            }

            $productIdSqlString = "";
            for ($i = 0; $i < count($productId); $i++) {
                if($i != 0)
                    $productIdSqlString = $productIdSqlString." OR Product_Id = '".$productId[$i]."'";
                else $productIdSqlString = $productIdSqlString."WHERE Product_Id = '".$productId[$i]."'";
            }

            $sql = "SELECT * FROM products ".$productIdSqlString;
            $result = $conn->query($sql);
            
            $counter = 0;
            $orderSummary = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $orderSummary += $productCount[$counter] * $row["ProdCost"];
                    $counter ++;
                }
            }

            $sql = "SELECT * FROM orders";
            $result = $conn->query($sql);
            $counter = 0;
            $orderInProgressId = array();
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["OrderStatus"] == "в процессе готовки" || $row["OrderStatus"] == "заказ готов" || $row["OrderStatus"] == "заказ выполнен")
                        $orderInProgressId[$counter] = $row["Order_Id"];
                    $counter ++;
                }
            }

            if($productIdSqlString != "")
            {
                echo '<p style="font-size: 24px;">Сумма заказа: <span class="order_summary">'.$orderSummary.'</span> грн.</p>';
            
                $sql = "SELECT * FROM products ".$productIdSqlString;
                $result = $conn->query($sql);

                $counter = 0;
                
                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $prodCostSummary = $productCount[$counter] * $row["ProdCost"];
                        $d_counter = $counter / 10;
                        echo '<div id="order_prod_element_'.$o_productId[$counter].'" class="list_order_elem" style="animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin;">
                                
                                <div id="product_element" class="list_elem" style="cursor: unset; width: 90%;
                                    background:linear-gradient( rgba(255, 255, 255, 0.5) 100%, rgba(0, 0, 0, 0.5)100%),url(uploads/'.$row["Product_Id"].'.jpg); background-size: 100%; background-position:50%;">
                                    <p><span style="font-size: 24px; font-weight: bold;">'.$row["ProdName"].'</span><br>
                                    <span style="font-size: 24px;">Цена за шт.:'.$row["ProdCost"].' грн.<br>
                                    Сумма:  <span class="order_prod_summary" id="order_prod_summary_'.$counter.'">'.$prodCostSummary.'</span> грн.<br></span></p>
                                </div>
                                <span style="font-size: 24px;">Количество порций: </span>
                                <input type="number" id="order_prod_count_'.$o_productId[$counter].'" onchange="changeOrderProdSummary('.$counter.', this.value, '.$row["ProdCost"].')" class="cust_input_area" style="background: rgba(255,255,255,0.5);" placeholder="Количество порций" value="'.$productCount[$counter].'"><br>
                                <select id="order_prod_serving_'.$o_productId[$counter].'" size="1" style="width:100%; height: 50px; background: rgba(255,255,255,0.5); font-size:20px; outline: none;" value="'.$productServing[$counter].'">';
                                    for ($i = 1; $i < 7; $i++)
                                    {    
                                        if($i." подача" == $productServing[$counter])
                                            echo '<option value="'.$i.' подача" selected>'.$i.' подача</option>';
                                        else echo '<option value="'.$i.' подача">'.$i.' подача</option>';
                                        if($i == 6)
                                        {
                                            if($productServing[$counter] == "Без значения")
                                                echo '<option value="Без значения" selected>Без значения</option>';
                                            else echo '<option value="Без значения">Без значения</option>';
                                        }
                                    }
                                echo '</select>
                                <textarea id="order_prod_comment_'.$o_productId[$counter].'" class="cust_text_area" placeholder="Комментарий к позиции">'.$productComment[$counter].'</textarea></p>
                                <input type="button" id="order_prod_save" class="settingsBlue" style="height:80px; width: 100%; margin: 0;" value="Сохранить данные" onclick="save_order_prod('.$o_productId[$counter].')">
                                <input type="button" id="order_prod_remove" class="settingsBlue" style="background: rgb(245, 114, 114); height:80px; width: 100%; margin: 0;" value="Удалить позицию" onclick="remove_order_prod('.$row["Product_Id"].')">
                                <div class="order_prod_element_'.$o_productId[$counter].'_overlay" style="display:none; width:100%; height:100%; position:absolute; top:0; left:0; background: rgba(255,255,255,0.9); justify-content: center; align-items: center; font-size: 24px;">Сохранено!</div>';
                                for ($i = 0; $i < count($orderInProgressId); $i++)
                                {
                                    if($o_orderId[$counter] == $orderInProgressId[$i])
                                        echo '<div class="order_prod_element_'.$o_productId[$counter].'_overlay_block" style="display:flex; width:100%; height:100%; position:absolute; top:0; left:0; background: rgba(255,255,255,0.9); justify-content: center; align-items: center; font-size: 24px;">Заблокировано</div>';
                                }
                            echo '</div>';
                            $counter ++;
                    }
                }
            }

            break;
        case "get_order_product_receipt":
            $sql = "SELECT * FROM order_products";
            $result = $conn->query($sql);
            $counter = 0;
            $o_productId = array();
            $productId = array();
            $o_orderId = array();
            $productCount = array();
            $productServing = array();
            $productComment = array();
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    if($row["OrderId"] == $orderId)
                    {
                        $o_productId[$counter] = $row["OrderProd_Id"];
                        $o_orderId[$counter] = $row["OrderId"];
                        $productId[$counter] = $row["ProductId"];
                        $productCount[$counter] = $row["ProductCount"];
                        $productServing[$counter] = $row["ProductServing"];
                        $productComment[$counter] = $row["ProductComment"];
                        $counter ++;
                    }
                }
            }

            $productIdSqlString = "";
            for ($i = 0; $i < count($productId); $i++) {
                if($i != 0)
                    $productIdSqlString = $productIdSqlString." OR Product_Id = '".$productId[$i]."'";
                else $productIdSqlString = $productIdSqlString."WHERE Product_Id = '".$productId[$i]."'";
            }
            $sql = "SELECT * FROM products ".$productIdSqlString;
            $result = $conn->query($sql);
            
            $counter = 0;
            $orderSummary = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $orderSummary += $productCount[$counter] * $row["ProdCost"];
                    $counter ++;
                }
            }
           

            $sql = "SELECT * FROM orders WHERE Order_Id=".$orderId;
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            $receiptUserLogin = $row["OrderUserLogin"];
            $receiptDiscount = $row["OrderDiscount"];
            $receiptRestaurant = $row["OrderRestName"];
            
            $sql = "SELECT * FROM users WHERE UserName='".$receiptUserLogin."'";;
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            $receiptUserFullName = $row["Surname"]." ".$row["Name"]." ".$row["LastName"];

            $orderSummaryDiscountM = 0;
            $orderFinalSummary = 0;
            if($receiptDiscount == 0)
            {
                $orderFinalSummary = $orderSummary;
            }
            else 
            {
                $orderSummaryDiscountM = ($orderSummary * $receiptDiscount) / 100;
                $orderFinalSummary = $orderSummary - $orderSummaryDiscountM;
            }

            if($productIdSqlString != "")
            {
                $sql = "SELECT * FROM products ".$productIdSqlString;
                $result = $conn->query($sql);

                $counter = 0;
                echo '<table><p align="center" style="font-size: 26px;">Ресторан<br>'.$receiptRestaurant.'</p>';
                echo '<table style="font-size: 24px;" border="1" width="100%" cellpadding="5">';
                echo '<tr><th>Страва</th><th>Кільксіть</th><th>Сума</th></tr>';
                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $prodCostSummary = $productCount[$counter] * $row["ProdCost"];
                        
                        $d_counter = $counter / 10;
                        echo '<tr><td>'.$row["ProdName"].'</td><td>'.$productCount[$counter].'</td><td>'.$prodCostSummary.'</td></tr>';
                            $counter ++;
                    }
                }
                
                echo '</table><p style="font-size: 24px;">До оплати: '.$orderFinalSummary.' грн</p>';
                echo '<p style="font-size: 20px;">Знижка: '.$receiptDiscount.' % ('.$orderSummaryDiscountM.' грн)</p>';

                echo '<p style="font-size: 20px;">Вас обслуговував: '.$receiptUserFullName.'</p>';
            }

            break;

            case "get_order_product_oncoming":
                $counter = 0;
                
                $sql = "SELECT * FROM orders";
                $result = $conn->query($sql);
                $order_id = array();
                $order_status = array();

                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $order_id[$counter] = $row["Order_Id"];
                        $order_status[$counter] = $row["OrderStatus"];
                        $counter ++;
                    }
                }

                $counter = 0;
                $sql = "SELECT * FROM order_products";
                $result = $conn->query($sql);
                $order_PK_id = array();
                $order_product_id = array();
                $order_product_serving = array();
                $order_product_count = array();
                $order_product_comment = array();

                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $order_PK_id[$counter] = $row["OrderId"];
                        $order_product_id[$counter] = $row["ProductId"];
                        $order_product_serving[$counter] = $row["ProductServing"];
                        $order_product_count[$counter] = $row["ProductCount"];
                        $order_product_comment[$counter] = $row["ProductComment"];
                        $counter ++;
                    }
                }

                $counter = 0;
                $sql = "SELECT * FROM products";
                $result = $conn->query($sql);
                $product_Id = array();
                $product_Name = array();

                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $product_Id[$counter] = $row["Product_Id"];
                        $product_Name[$counter] = $row["ProdName"];
                        $counter ++;
                    }
                }

                for($i = 0; $i < count($order_id); $i ++)
                {
                    if($order_status[$i] == "в процессе готовки")
                    {
                        echo "\n------------\n";
                        echo "Замовлення № ".$order_id[$i]."\n";
                        for($j = 0; $j < count($order_PK_id); $j ++)
                        {
                            if($order_id[$i] == $order_PK_id[$j])
                            {
                                for($z = 0; $z < count($product_Id); $z ++)
                                {
                                    if($order_product_id[$j] == $product_Id[$z])
                                    {
                                        echo "   Назва: ".$product_Name[$z]."\n";
                                    }
                                }
                                echo "   Черговість: ".$order_product_serving[$j]."\n";
                                echo "   Кількість: ".$order_product_count[$j]."\n";
                                echo "   Коментар офіціанта:\n   ".$order_product_comment[$j]."\n";
                                echo "#####\n";
                            }
                        }
                        echo "------------\n";
                    }
                }
                break;
            
            case "get_order_product_ready":
                $counter = 0;
                
                $sql = "SELECT * FROM orders";
                $result = $conn->query($sql);
                $order_id = array();
                $order_status = array();

                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $order_id[$counter] = $row["Order_Id"];
                        $order_status[$counter] = $row["OrderStatus"];
                        $counter ++;
                    }
                }

                $counter = 0;
                $sql = "SELECT * FROM order_products";
                $result = $conn->query($sql);
                $order_PK_id = array();
                $order_product_id = array();
                $order_product_serving = array();
                $order_product_count = array();
                $order_product_comment = array();

                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $order_PK_id[$counter] = $row["OrderId"];
                        $order_product_id[$counter] = $row["ProductId"];
                        $order_product_serving[$counter] = $row["ProductServing"];
                        $order_product_count[$counter] = $row["ProductCount"];
                        $order_product_comment[$counter] = $row["ProductComment"];
                        $counter ++;
                    }
                }

                $counter = 0;
                $sql = "SELECT * FROM products";
                $result = $conn->query($sql);
                $product_Id = array();
                $product_Name = array();

                if($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc()) {
                        $product_Id[$counter] = $row["Product_Id"];
                        $product_Name[$counter] = $row["ProdName"];
                        $counter ++;
                    }
                }

                for($i = 0; $i < count($order_id); $i ++)
                {
                    if($order_status[$i] == "заказ готов")
                    {
                        echo "\n------------\n";
                        echo "Замовлення № ".$order_id[$i]."\n";
                        for($j = 0; $j < count($order_PK_id); $j ++)
                        {
                            if($order_id[$i] == $order_PK_id[$j])
                            {
                                for($z = 0; $z < count($product_Id); $z ++)
                                {
                                    if($order_product_id[$j] == $product_Id[$z])
                                    {
                                        echo "   Назва: ".$product_Name[$z]."\n";
                                    }
                                }
                                echo "   Кількість: ".$order_product_count[$j]."\n";
                                echo "#####\n";
                            }
                        }
                        echo "------------\n";
                    }
                }
                break;

        case "save_order_product":
            $sql = "UPDATE order_products
                    SET ProductCount='$orderProductCount', 
                        ProductServing='$orderProductServing', 
                        ProductComment='$orderProductComment'
                    WHERE OrderProd_Id=".$orderProductId;
                $result = $conn->query($sql);
            break;
        case "remove_order_product":
            $sql = "DELETE FROM order_products WHERE ProductId =".$orderProductId;
            $result = $conn->query($sql);
            break;
        
        case "get_zone":
            $sql = "SELECT * FROM product_zones";
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $d_counter = $counter / 10;
                    echo '<div onclick="add_order_prod_type(&quot;'.$row["ProductZoneName"].'&quot;)" class="list_elem" style="height: 120px; text-align: center; padding: 30px 0 0 0;  animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin"><p><span style="font-size: 20px;">'.$row["ProductZoneName"].'</span></div>';
                        $counter ++;
                }
            }
            break;
        case "get_type":
            $sql = "SELECT * FROM product_types";
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $d_counter = $counter / 10;
                    if($prodZone == $row["ProductZoneName"])
                    {
                        echo '<div onclick="add_order_prod(&quot;'.$row["ProductTypeName"].'&quot;, &quot;'.$row["ProductZoneName"].'&quot;)" class="list_elem" style="height: 120px; text-align: center; padding: 30px 0 0 0;  animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin"><p><span style="font-size: 20px;">'.$row["ProductTypeName"].'</span></div>';
                        $counter ++;
                    }
                }
            }
            break;
        case "get_prod":
            $sql = "SELECT * FROM products";
            $result = $conn->query($sql);
            $counter = 0;
            if($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc()) {
                    $d_counter = $counter / 10;
                    if($prodZone == $row["ProdZone"] && $prodType == $row["ProdType"])
                    {
                        echo '<div onclick="add_order_prod_element(&quot;'.$row["Product_Id"].'&quot;)" id="product_element" class="list_elem" style="animation: .3s ease-out '.$d_counter.'s 1 normal backwards running elemin;
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
            }
            break;


        case "update_order_status":
            $sql = "UPDATE orders
                    SET OrderDiscount='$orderDiscount', 
                        OrderStatus='$orderStatus', 
                        OrderPrice='$orderPrice'
                    WHERE Order_Id=".$orderId;
                $result = $conn->query($sql);
            break;
        case "update_order_status_ready":
            $sql = "UPDATE orders
                    SET OrderStatus='$orderStatus'
                    WHERE Order_Id=".$orderId;
                $result = $conn->query($sql);
            break;
        case "update_order_status_complete":
        $sql = "UPDATE orders
                SET OrderStatus='$orderStatus'
                WHERE Order_Id=".$orderId;
            $result = $conn->query($sql);
            break;
    }
    echo $conn->error;
    //var_dump($result);
    $conn->close(); 
?>