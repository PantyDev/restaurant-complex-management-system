<?php 
	$login = $_POST['login'];
	$pass = $_POST['password'];
	$type = $_POST['type'];

	$servername = "127.0.0.1:3306";
	$username = "root";
	$password = "";
	$dbname = "rms";

	$conn = new mysqli($servername, $username, $password, $dbname);



	switch($type)
	{
		case "get_user":
			$sql = "SELECT * FROM users";
			$result = $conn->query($sql);
			
			if($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc()) {
					if($row["UserName"] == $login && $row["Password"] == $pass)
					{
						$data = array(
							'Logged' => "yes; logged", 
							'UserType' => $row["UserType"],
							'UserSurname' => $row["Surname"],
							'UserName' => $row["Name"],
							'UserLastName' => $row["LastName"],
							'UserRestaurants' => $row["Restaurants"]);
						echo json_encode($data);
						break;
					}
				}
			}
		break;
	}


	$conn->close();
?>
