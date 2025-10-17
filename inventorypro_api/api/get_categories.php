<?php
header("Access-Control-Allow-Origin: *"); // <-- El permiso
header("Content-Type: application/json; charset=UTF-8");

require 'db.php';

try {
    $stmt = $pdo->query("SELECT id, name, parent_id FROM categories ORDER BY name ASC");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudieron obtener las categorías: ' . $e->getMessage()]);
}
?>