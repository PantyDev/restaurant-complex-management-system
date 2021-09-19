<?php 
	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$dbname = "rms";

	$conn = new mysqli($servername, $username, $password, $dbname);


	$sql = "SELECT * FROM users";
	$result = $conn->query($sql);

	$rows_counter = 0;
	if($result->num_rows > 0)
	{
		while($row = $result->fetch_assoc()) {
			if($row["UserType"] == "admin")
			{
				$rows_counter ++;
				echo '<input type="checkbox" class="checkbox_admin" id="admin'.$rows_counter.'" name="admin'.$rows_counter.'" value="'.$row["UserName"].'"><label class="cust_admin_checkbox" for="admin'.$rows_counter.'">'.$row["Surname"].' '.$row["Name"].' '.$row["LastName"].' ['.$row["UserName"].']</label><br>';
			}
		}
	}

	$conn->close();
?>
