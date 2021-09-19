<?php 
	$type = $_POST["type"];

	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$dbname = "rms";

	$conn = new mysqli($servername, $username, $password, $dbname);


	$sql = "SELECT * FROM restaurants";
	$result = $conn->query($sql);

	$rows_counter = 0;
	if($result->num_rows > 0)
	{
		while($row = $result->fetch_assoc()) {
			$rows_counter ++;
			if($type == "checkbox")
				echo '<input type="checkbox" class="checkbox_restaurant" id="restaurant'.$rows_counter.'" name="restaurant'.$rows_counter.'" value="'.$row["RestName"].'"><label class="cust_rest_checkbox" for="rest'.$rows_counter.'">'.$row["RestName"].'</label><br>';
			else if($type == "radio")
				echo '<input type="radio" class="radio_restaurant" id="'.$row["Restaurant_Id"].'" name="restaurant" value="'.$row["RestName"].'"><label class="cust_rest_checkbox" for="rest'.$rows_counter.'">'.$row["RestName"].'</label><br>';
		}
	}

	$conn->close();
?>
