<?php
// RUTA: inventorypro_api/api/get_dashboard_stats.php

header("Access-Control-Allow-Origin: *"); // <-- ¡Línea 1 crucial!
header("Content-Type: application/json; charset=UTF-8"); // <-- Línea 2 crucial!

require 'db.php'; // <-- Línea 3 crucial!

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // ... (resto del código SQL para calcular stats) ...
    // 1. Valor Total
    $stmt_value = $pdo->query("SELECT COALESCE(SUM(i.price * s.quantity), 0) AS total_value FROM inventory_stock AS s JOIN items AS i ON s.item_id = i.id");
    $total_value = $stmt_value->fetch(PDO::FETCH_ASSOC)['total_value'];
    // 2. SKUs
    $stmt_skus = $pdo->query("SELECT COUNT(id) AS total_skus FROM items");
    $total_skus = $stmt_skus->fetch(PDO::FETCH_ASSOC)['total_skus'];
    // 3. Stock Bajo
    $stmt_low_stock = $pdo->query("SELECT COUNT(*) AS low_stock_count FROM (SELECT item_id, SUM(quantity) AS total_q FROM inventory_stock GROUP BY item_id HAVING total_q < 10) AS low_stock_items");
    $low_stock_count = $stmt_low_stock->fetch(PDO::FETCH_ASSOC)['low_stock_count'];
    // 4. Órdenes Pendientes
    $pending_orders = 0;

    echo json_encode([
        'total_inventory_value' => (float)$total_value,
        'total_skus' => (int)$total_skus,
        'low_stock_count' => (int)$low_stock_count,
        'pending_orders' => $pending_orders
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error DB stats: ' . $e->getMessage()]); // Mensaje de error más específico
}
?>