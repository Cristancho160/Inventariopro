<?php
header("Access-Control-Allow-Origin: *"); // <-- LA LÍNEA MÁGICA
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si la solicitud es OPTIONS (pre-vuelo de CORS), solo envía las cabeceras y sal.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json'); // Mover esta línea aquí

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // ... (El resto del código de add_item.php que te di antes)
    
    // Validación básica de datos de entrada
    if (
        empty($data['name']) ||
        !isset($data['price']) ||
        !isset($data['category_id']) ||
        !isset($data['initial_quantity']) ||
        !isset($data['location_id'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos incompletos. Se requiere nombre, precio, categoría, cantidad inicial y ubicación.']);
        exit;
    }

    $name = $data['name'];
    $sku = $data['sku'] ?? null;
    $price = $data['price'];
    $description = $data['description'] ?? null;
    $category_id = $data['category_id'];
    $initial_quantity = (int)$data['initial_quantity'];
    $location_id = (int)$data['location_id'];

    $pdo->beginTransaction();

    try {
        // 1. Insertar el item en la tabla 'items'
        $stmt = $pdo->prepare(
            "INSERT INTO items (name, sku, price, description, category_id) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$name, $sku, $price, $description, $category_id]);
        $itemId = $pdo->lastInsertId();

        // 2. Añadir el stock inicial en la tabla 'inventory_stock'
        if ($initial_quantity > 0) {
            $stmt = $pdo->prepare(
                "INSERT INTO inventory_stock (item_id, location_id, quantity) VALUES (?, ?, ?)"
            );
            $stmt->execute([$itemId, $location_id, $initial_quantity]);
        }

        // 3. Registrar el movimiento inicial
        if ($initial_quantity > 0) {
             $stmt = $pdo->prepare(
                "INSERT INTO inventory_movements (item_id, quantity, to_location_id, reason) VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$itemId, $initial_quantity, $location_id, 'Stock Inicial']);
        }

        $pdo->commit();

        http_response_code(201);
        echo json_encode(['message' => 'Item creado exitosamente', 'id' => $itemId]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        if ($e->errorInfo[1] == 1062) {
             echo json_encode(['error' => 'Error al crear el item: El SKU ya existe.']);
        } else {
             echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
        }
    }
}
?>