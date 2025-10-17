import React from 'react';
import { BarChart2 } from 'lucide-react';

const ReportingAndAnalyticsCenter = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reportes y Analíticas</h1>
      
      <div className="bg-white rounded-lg border shadow-sm p-10 text-center text-gray-500">
        <BarChart2 className="w-16 h-16 mx-auto mb-4 text-blue-400" />
        <h2 className="text-2xl font-semibold">Sección en Construcción</h2>
        <p className="mt-2">
          El módulo de reportes personalizados estará disponible próximamente.
        </p>
      </div>
    </div>
  );
};

export default ReportingAndAnalyticsCenter;