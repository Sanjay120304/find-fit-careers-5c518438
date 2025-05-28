<?php
class JobController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getJobs() {
        $query = "SELECT id, title, description, location, skills_required, salary, created_at FROM job_posts";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($jobs);
    }

    public function createJob($recruiter_id, $data) {
        if (!isset($data['title']) || !isset($data['description'])) {
            http_response_code(400);
            echo json_encode(["error" => "Title and description are required"]);
            return;
        }

        $query = "INSERT INTO job_posts (recruiter_id, title, description, location, skills_required, salary) 
                  VALUES (:recruiter_id, :title, :description, :location, :skills_required, :salary)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':recruiter_id', $recruiter_id);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':location', $data['location']);
        $stmt->bindParam(':skills_required', $data['skills_required']);
        $stmt->bindParam(':salary', $data['salary']);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Job created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create job"]);
        }
    }
}
?>