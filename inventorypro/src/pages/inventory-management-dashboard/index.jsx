// RUTA: inventorypro/src/pages/inventory-management-dashboard/index.jsx

import React from 'react';
import useFetch from '../../hooks/useFetch';
import KPICard from './components/KPICard';

// Importa los iconos que usa la plantilla
import { DollarSign, Package, AlertTriangle, Clock } from 'lucide-react';

const InventoryManagementDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // Llama a nuestro script de API para obtener estadísticas
  const { data: stats, loading, error } = useFetch(`${apiUrl}/get_dashboard_stats.php`);

  if (loading) return <div className="p-6">Cargando Dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">Error al cargar el dashboard: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de Inventario</h1>
      
      {/* --- Sección de KPIs con datos reales --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Valor Total Inventario"
          value={`$${(stats?.total_inventory_value || 0).toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 text-green-500" />}
          description="Valor total de todo el stock"
        />
        <KPICard
          title="Productos (SKUs)"
          value={stats?.total_skus || 0}
          icon={<Package className="w-6 h-6 text-blue-500" />}
          description="Items únicos registrados"
        />
        <KPICard
          title="Stock Bajo"
          value={stats?.low_stock_count || 0}
          icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
          description="Items que necesitan reabastecimiento"
        />
        <KPICard
          title="Órdenes Pendientes"
          value={stats?.pending_orders || 0}
          icon={<Clock className="w-6 h-6 text-red-500" />}
          description="Función no implementada"
        />
      </div>

      {/* --- Secciones de Gráficos y Otros (Limpiadas) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white rounded-lg border shadow-sm">
          <h3 className="font-semibold text-lg">Gráfico de Movimientos</h3>
          <p className="text-gray-500 mt-4"> (Esta sección se conectará a la API próximamente) </p>
        </div>
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <h3 className="font-semibold text-lg">Actividad Reciente</h3>
          <p className="text-gray-500 mt-4"> (Esta sección se conectará a la API próximamente) </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementDashboard;