<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validación
    if (empty($data['item_id']) || empty($data['quantity']) || empty($data['reason'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos incompletos. Se requiere item_id, quantity y reason.']);
        exit;
    }
    
    $item_id = $data['item_id'];
    $quantity = (int)$data['quantity'];
    $from_location_id = $data['from_location_id'] ?? null;
    $to_location_id = $data['to_location_id'] ?? null;
    $reason = $data['reason'];

    $pdo->beginTransaction();

    try {
        // Restar stock de la ubicación de origen si existe
        if ($from_location_id) {
            $stmt = $pdo->prepare("UPDATE inventory_stock SET quantity = quantity - ? WHERE item_id = ? AND location_id = ?");
            $stmt->execute([$quantity, $item_id, $from_location_id]);
        }

        // Añadir stock a la ubicación de destino si existe
        if ($to_location_id) {
            // Intentar insertar, y si ya existe, actualizar (UPSERT)
            $stmt = $pdo->prepare("
                INSERT INTO inventory_stock (item_id, location_id, quantity) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?
            ");
            $stmt->execute([$item_id, $to_location_id, $quantity, $quantity]);
        }
        
        // Registrar el movimiento
        $stmt = $pdo->prepare(
            "INSERT INTO inventory_movements (item_id, quantity, from_location_id, to_location_id, reason) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$item_id, $quantity, $from_location_id, $to_location_id, $reason]);

        $pdo->commit();

        echo json_encode(['message' => 'Movimiento registrado exitosamente.']);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Error al registrar el movimiento: ' . $e->getMessage()]);
    }
}
?>