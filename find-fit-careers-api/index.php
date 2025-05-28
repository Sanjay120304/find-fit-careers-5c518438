<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/controllers/JobController.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$jwtSecret = 'your-secret-key';
$database = new Database();
$db = $database->getConnection();

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriParts = explode('/', trim($requestUri, '/'));

if ($uriParts[0] === 'api') {
    if ($uriParts[1] === 'login') {
        require_once __DIR__ . '/login.php';
        exit;
    }

    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        try {
            $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));
            if ($uriParts[1] === 'jobs') {
                $controller = new JobController($db);
                if ($requestMethod === 'GET') {
                    $controller->getJobs();
                } elseif ($requestMethod === 'POST' && $decoded->role === 'recruiter') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $controller->createJob($decoded->user_id, $data);
                } else {
                    http_response_code(403);
                    echo json_encode(['error' => 'Unauthorized']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Invalid API route']);
}
?>