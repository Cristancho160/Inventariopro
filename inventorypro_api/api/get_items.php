<?php
header("Access-Control-Allow-Origin: *"); // <-- El permiso
header("Content-Type: application/json; charset=UTF-8");

require 'db.php'; 

try {
    $sql = "
        SELECT
            i.id, i.name, i.sku, i.price, i.description, i.created_at,
            c.name AS category_name, c.id AS category_id,
            COALESCE(SUM(s.quantity), 0) AS total_stock
        FROM items AS i
        LEFT JOIN categories AS c ON i.category_id = c.id
        LEFT JOIN inventory_stock AS s ON i.id = s.item_id
        GROUP BY i.id
        ORDER BY i.created_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($items);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudieron obtener los items: ' . $e->getMessage()]);
}
?>