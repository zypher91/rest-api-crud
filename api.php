<?php

    include 'db.php';

    header("Content-Type: application/json");

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'POST':
            if (isset($_GET['login'])) {
                $username = $input['username'];
                $password = $input['password'];
                $result = $conn -> query("SELECT password FROM users WHERE username = '$username'");
                $data = $result -> fetch_assoc();

                if (password_verify($password, $data['password'])) {
                    //Succeed
                    echo json_encode(["message" => "Welcome"]);
                } else {
                    //Fail
                    //echo json_encode(["message" => "Authentication failed"]);
                }
                
                break;
            }
            $username = $input['username'];
            $password = HashPassword($input['password']);
            $name = $input['name'];
            $email = $input['email'];
            $address = $input['address'];
            $city = $input['city'];
            $postalcode = $input['postalcode'];
            $country = $input['country'];
            $picture = $input['picture'];
            $conn -> query("INSERT INTO users (username, password, name, email, address, city, postalcode, country, picture) VALUES ('$username', '$password', '$name', '$email', '$address', '$city', '$postalcode', '$country', '$picture')");
            echo json_encode(["message" => "User added successfully"]);
            break;

        case 'GET':
            if (isset($_GET['username']) && isset($_GET['password'])) { 
                $username = $_GET['username'];
                $password = $_GET['password'];
                $result = $conn -> query("SELECT * FROM users WHERE username = '$username' AND password = '$password'");
                $data = $result -> fetch_assoc();
                echo json_encode($data);
            } elseif (isset($_GET['listusers'])) {
                if ($_GET['listusers'] == 'all') {
                    //TODO: Check if user is logged in
                    $result = $conn -> query("SELECT * FROM users");
                } else {
                    $result = $conn -> query("SELECT username, email FROM users");
                }

                while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                    $data[] = $row;
                }
                echo json_encode($data);
            }
            break;
        
        case 'PUT':
            $username = $input['username'];
            $password = HashPassword($input['password']);
            $name = $input['name'];
            $email = $input['email'];
            $address = $input['address'];
            $city = $input['city'];
            $postalcode = $input['postalcode'];
            $country = $input['country'];
            $picture = $input['picture'];
            $conn -> query("UPDATE users SET username = '$username', password = '$password', name = '$name', email = '$email', address = '$address', city = '$city', postalcode = '$postalcode', country = '$country', picture = '$picture' WHERE username = '$username'");
            echo json_encode(["message" => "User updated successfully"]);
            break;

        case 'DELETE':
            $username = $input['username'];
            $password = $input['password'];
            $conn -> query("DELETE FROM users WHERE username = '$username' AND password = '$password'");
            echo json_encode(["message" => "User deleted successfully"]);
            break;
            
            default:
                echo json_encode(["message" => "Invalid request method"]);
                break;
    }

    $conn->close();
    
    function HashPassword($password) {
        $options = ['cost' => 12];

        return password_hash($password, PASSWORD_BCRYPT, $options);
    }
?>