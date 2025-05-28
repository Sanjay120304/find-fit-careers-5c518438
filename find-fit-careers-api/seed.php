<?php
// C:\xampp\htdocs\find-fit-careers-api\seed.php
require_once __DIR__ . '/config/database.php';
$database = new Database();
$db = $database->getConnection();

$email = 'john@example.com';
$password = password_hash('123456', PASSWORD_BCRYPT);
$username = 'john_doe';
$role = 'jobseeker';

$query = "INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, :role)";
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $password);
$stmt->bindParam(':role', $role);
$stmt->execute();

$job_seeker_query = "INSERT INTO job_seekers (user_id, full_name) VALUES (:user_id, :full_name)";
$stmt = $db->prepare($job_seeker_query);
$stmt->bindParam(':user_id', $db->lastInsertId());
$stmt->bindParam(':full_name', $username);
$stmt->execute();

echo "Test job seeker created\n";

$email = 'recruiter@example.com';
$password = password_hash('123456', PASSWORD_BCRYPT);
$username = 'recruiter_co';
$role = 'recruiter';

$query = "INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, :role)";
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $password);
$stmt->bindParam(':role', $role);
$stmt->execute();

$recruiter_query = "INSERT INTO recruiters (user_id, company_name) VALUES (:user_id, :company_name)";
$stmt = $db->prepare($recruiter_query);
$stmt->bindParam(':user_id', $db->lastInsertId());
$stmt->bindParam(':company_name', $username);
$stmt->execute();

echo "Test recruiter created\n";
?>