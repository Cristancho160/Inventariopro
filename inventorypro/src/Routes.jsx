// RUTA: inventorypro/src/Routes.jsx

import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Importa todas tus páginas
import ReportingAndAnalyticsCenter from './pages/reporting-and-analytics-center';
import InventoryManagementDashboard from './pages/inventory-management-dashboard';
import InventoryTrackingConsole from './pages/inventory-tracking-console';
import ProductManagementInterface from './pages/product-management-interface';
import LoginAndAuthentication from './pages/login-and-authentication';
import CategoryManagementSystem from './pages/category-management-system';

const ProjectRoutes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Tu ruta principal (la que se ve en http://localhost:4028/) */}
        {/* La he cambiado al Dashboard, que es más lógico */}
        <Route path="/" element={<InventoryManagementDashboard />} />
        
        {/* El resto de tus rutas */}
        <Route path="/dashboard" element={<InventoryManagementDashboard />} />
        <Route path="/products" element={<ProductManagementInterface />} />
        <Route path="/categories" element={<CategoryManagementSystem />} />
        <Route path="/inventory" element={<InventoryTrackingConsole />} />
        <Route path="/reports" element={<ReportingAndAnalyticsCenter />} />
        <Route path="/login" element={<LoginAndAuthentication />} />
        
        {/* Rutas antiguas (las mantengo por si acaso) */}
        <Route path="/reporting-and-analytics-center" element={<ReportingAndAnalyticsCenter />} />
        <Route path="/inventory-management-dashboard" element={<InventoryManagementDashboard />} />
        <Route path="/inventory-tracking-console" element={<InventoryTrackingConsole />} />
        <Route path="/product-management-interface" element={<ProductManagementInterface />} />
        <Route path="/login-and-authentication" element={<LoginAndAuthentication />} />
        <Route path="/category-management-system" element={<CategoryManagementSystem />} />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default ProjectRoutes;