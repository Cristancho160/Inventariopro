<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') { // Usamos POST para compatibilidad con form-data/multipart
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Se requiere el ID del item.']);
        exit;
    }

    $id = $data['id'];
    $name = $data['name'];
    $sku = $data['sku'] ?? null;
    $price = $data['price'];
    $description = $data['description'] ?? null;
    $category_id = $data['category_id'];

    try {
        $stmt = $pdo->prepare(
            "UPDATE items SET name = ?, sku = ?, price = ?, description = ?, category_id = ? WHERE id = ?"
        );
        $stmt->execute([$name, $sku, $price, $description, $category_id, $id]);

        if ($stmt->rowCount()) {
            echo json_encode(['message' => 'Item actualizado exitosamente']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Item no encontrado o sin cambios.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        if ($e->errorInfo[1] == 1062) {
             echo json_encode(['error' => 'Error al actualizar: El SKU ya existe.']);
        } else {
             echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
        }
    }
}
?>