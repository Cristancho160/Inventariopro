// RUTA: inventorypro/src/pages/inventory-tracking-console/index.jsx

import React from 'react';
import useFetch from '../../hooks/useFetch';
import { Package } from 'lucide-react';

const InventoryTrackingConsole = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // Llama a nuestro nuevo script de API para obtener el stock
  const { data: stockLevels, loading, error } = useFetch(`${apiUrl}/get_inventory_levels.php`);

  if (loading) return <div className="p-6">Cargando niveles de stock...</div>;
  if (error) return <div className="p-6 text-red-500">Error al cargar el inventario: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Seguimiento de Inventario</h1>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Stock por Ubicación</h2>
        </div>
        
        {/* Si no hay stock, muestra un mensaje amigable */}
        {!stockLevels || stockLevels.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No hay stock registrado</h3>
            <p>Añade productos en la pestaña "Productos" para ver tu inventario aquí.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto (SKU)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockLevels.map((item) => (
                <tr key={`${item.item_id}-${item.location_id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.location_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.item_name} ({item.sku || 'N/A'})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryTrackingConsole;