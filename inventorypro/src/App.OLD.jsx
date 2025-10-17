// RUTA: inventorypro/src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ProjectRoutes from './Routes'; // Importa el archivo de rutas que modificamos
import Sidebar from './components/ui/Sidebar';
import Header from './components/ui/Header'; 

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Datos falsos para el Header (puedes conectarlos a una API después)
  const user = {
    name: "Cristian",
    email: "cristian@inventorypro.com",
    role: "Administrador"
  };
  const notifications = [];

  return (
    // BrowserRouter envuelve toda la aplicación
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
        />
        <Header
          user={user}
          onLogout={() => console.log('Logout')}
          notifications={notifications}
        />
        <main className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
        } pt-16`}>
          {/* Aquí se renderizan todas las páginas */}
          <ProjectRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;