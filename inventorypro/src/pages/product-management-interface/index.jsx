// RUTA: inventorypro/src/pages/product-management-interface/index.jsx

import React, { useState } from 'react';
import ProductGrid from './components/ProductGrid';
import FilterBar from './components/FilterBar';
import CategorySidebar from './components/CategorySidebar';
import ProductDetailPanel from './components/ProductDetailPanel';
import AddProductModal from './components/AddProductModal';
// Importaciones corregidas (sin llaves)
import Button from '../../components/ui/Button'; 
import useFetch from '../../hooks/useFetch'; 

const ProductManagementInterface = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- CONEXIÓN A LA API ---
  // Obtiene la URL base del archivo .env
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Llama a los 3 scripts de PHP que necesita esta página
  const { data: products, loading: loadingProducts, error: errorProducts, refetch } = useFetch(`${apiUrl}/get_items.php`);
  const { data: categories, loading: loadingCategories, error: errorCategories } = useFetch(`${apiUrl}/get_categories.php`);
  const { data: locations, loading: loadingLocations, error: errorLocations } = useFetch(`${apiUrl}/get_locations.php`);

  // --- MANEJO DE ESTADOS ---
  // Función para recargar la lista de productos después de añadir uno nuevo
  const handleProductAdded = () => {
    setIsModalOpen(false);
    refetch(); // Vuelve a llamar a get_items.php
  };

  // Muestra un mensaje de carga mientras se conecta a la API
  const isLoading = loadingProducts || loadingCategories || loadingLocations;
  if (isLoading) {
    return <div className="p-6">Cargando datos de productos...</div>;
  }
  
  // Muestra un mensaje de error si alguna de las llamadas a la API falla
  const apiError = errorProducts || errorCategories || errorLocations;
  if (apiError) {
    return <div className="p-6 text-red-500">Error al cargar datos: {apiError.message}</div>;
  }

  // --- RENDERIZADO DE LA PÁGINA ---
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Pasa las categorías REALES a la barra lateral */}
      <CategorySidebar categories={categories || []} />
      
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          {/* Botón para abrir el modal de añadir producto */}
          <Button onClick={() => setIsModalOpen(true)}>Añadir Nuevo Producto</Button>
        </div>
        <FilterBar />
        
        {/* Pasa los productos REALES (de la API) a la cuadrícula */}
        <ProductGrid products={products || []} onProductSelect={setSelectedProduct} />
      </main>
      
      {/* Panel lateral que se muestra al seleccionar un producto */}
      {selectedProduct && (
        <ProductDetailPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
      
      {/* Modal para añadir un nuevo producto */}
      {isModalOpen && (
          <AddProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onProductAdded={handleProductAdded}
            // Pasa las categorías y ubicaciones reales al modal
            categories={categories || []} 
            locations={locations || []}
          />
      )}
    </div>
  );
};

export default ProductManagementInterface;