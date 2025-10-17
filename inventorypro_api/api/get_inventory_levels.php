<?php
// RUTA: inventorypro_api/api/get_inventory_levels.php

header("Access-Control-Allow-Origin: *"); // <-- ¡Línea 1 crucial!
header("Content-Type: application/json; charset=UTF-8"); // <-- Línea 2 crucial!

require 'db.php'; // <-- Línea 3 crucial!

try {
    $sql = "
        SELECT
            s.item_id, s.location_id, s.quantity,
            i.name AS item_name, i.sku,
            l.name AS location_name
        FROM inventory_stock AS s
        JOIN items AS i ON s.item_id = i.id
        JOIN locations AS l ON s.location_id = l.id
        ORDER BY l.name, i.name;
    ";

    $stmt = $pdo->query($sql);
    $stock_levels = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($stock_levels);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error DB levels: ' . $e->getMessage()]); // Mensaje de error más específico
}
?>