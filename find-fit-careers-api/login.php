<?php
// C:\xampp\htdocs\find-fit-careers-api\login.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/autoload.php';
use Firebase\JWT\JWT;

$database = new Database();
$db = $database->getConnection();

$jwtSecret = 'your-secret-key';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password are required"]);
        exit;
    }

    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];

    $query = "SELECT id, email, password, role FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($password, $user['password'])) {
            $payload = [
                'user_id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'iat' => time(),
                'exp' => time() + (60 * 60)
            ];
            $token = JWT::encode($payload, $jwtSecret, 'HS256');
            http_response_code(200);
            echo json_encode([
                'token' => $token,
                'role' => $user['role'],
                'message' => 'Login successful'
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>