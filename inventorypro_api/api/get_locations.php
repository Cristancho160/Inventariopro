<?php
header("Access-Control-Allow-Origin: *"); // <-- El permiso
header("Content-Type: application/json; charset=UTF-8");

require 'db.php';

try {
    $stmt = $pdo->query("SELECT id, name FROM locations ORDER BY name ASC");
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($locations);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudieron obtener las ubicaciones: ' . $e->getMessage()]);
}
?>