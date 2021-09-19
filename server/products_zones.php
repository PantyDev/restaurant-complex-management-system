<?php 
	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$dbname = "rms";

	$conn = new mysqli($servername, $username, $password, $dbname);

	$sql = "SELECT * FROM product_zones";
	$result = $conn->query($sql);
	
	if($result->num_rows > 0)
	{
		echo '<datalist id="prod_zone_list" size="1" style="width:100%; height: 50px; font-size:20px; outline: none;">';
		while($row = $result->fetch_assoc()) {
			echo '<option id="prod_zone_list" value="'.$row["ProductZoneName"].'">'.$row["ProductZoneName"].'</option>';
		}
		echo '</datalist>';
	}

	/* $conn = new mysqli($servername, $username, $password, $dbname);


	$sql = "SELECT * FROM restaurants";
	$result = $conn->query($sql);

	$rows_counter = 0;
	if($result->num_rows > 0)
	{
		while($row = $result->fetch_assoc()) {
				$rows_counter ++;
				echo '<input type="checkbox" class="checkbox_restaurant" id="restaurant'.$rows_counter.'" name="restaurant'.$rows_counter.'" value="'.$row["RestName"].'"><label class="cust_rest_checkbox" for="rest'.$rows_counter.'">'.$row["RestName"].'</label><br>';
		}
	} */

	/* $conn->close(); */
?>
