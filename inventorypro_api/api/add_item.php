<?php
// CÓDIGO AÑADIDO PARA MOSTRAR ERRORES Y DEPURACIÓN
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// FIN CÓDIGO DE DEPURACIÓN

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

// 1. RECEPCIÓN DE CAMPOS EXISTENTES
$name = $input['name'] ?? null;
$sku = $input['sku'] ?? null;
$quantity = isset($input['quantity']) ? (int)$input['quantity'] : 0; // quantity viene del campo 'stock' del frontend
$price = isset($input['price']) ? (float)$input['price'] : 0;
$description = $input['description'] ?? null; 

// 2. RECEPCIÓN DE LOS 9 CAMPOS NUEVOS (DEBEN COINCIDIR CON LOS NOMBRES DEL JSON DE AXIOS)
$brand = $input['brand'] ?? null;
$category = $input['category'] ?? null;
$cost = isset($input['cost']) ? (float)$input['cost'] : 0;
// Frontend: minStock (camelCase) -> DB: min_stock (snake_case)
$min_stock = isset($input['minStock']) ? (int)$input['minStock'] : 0; 
$supplier = $input['supplier'] ?? null;
$barcode = $input['barcode'] ?? null;
$weight = isset($input['weight']) ? (float)$input['weight'] : 0;
$dimensions = $input['dimensions'] ?? null;
$status = $input['status'] ?? 'active';

if (!$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Name is required']);
    exit;
}

try {
    // 3. QUERY SQL con 14 campos. 
    // Usamos backticks en `description` y `min_stock` por seguridad.
    $sql = "INSERT INTO items (
        name, sku, quantity, price, `description`, 
        brand, category, cost, min_stock, supplier, 
        barcode, weight, dimensions, status
    ) VALUES (
        ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, 
        ?, ?, ?, ?
    )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        // Los 14 valores en el ORDEN exacto de las columnas de arriba
        $name, $sku, $quantity, $price, $description,
        $brand, $category, $cost, $min_stock, $supplier,
        $barcode, $weight, $dimensions, $status
    ]);
    
    $id = $pdo->lastInsertId();
    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Item added successfully', 'id' => $id]); 
    
} catch (Exception $e) {
    http_response_code(500);
    // Mostrar el error detallado de la base de datos
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>