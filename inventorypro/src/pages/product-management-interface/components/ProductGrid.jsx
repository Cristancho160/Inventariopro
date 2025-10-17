// RUTA: inventorypro/src/pages/product-management-interface/components/ProductGrid.jsx

import React from 'react';
import AppImage from '../../../components/AppImage'; 

// Un componente simple para la tarjeta de producto
const ProductCard = ({ product, onSelect }) => {
  return (
    <div 
      className="bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(product)}
    >
      {/* Usamos una imagen genérica si el producto no tiene una */}
      <AppImage
        src={product.image || '/assets/images/no_image.png'}
        alt={product.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.sku || 'Sin SKU'}</p>
        <p className="text-lg font-bold text-gray-800 mt-2">${parseFloat(product.price).toFixed(2)}</p>
        <div className="mt-2">
          <span className="text-sm text-gray-600">Stock: </span>
          <span className={`font-bold ${product.total_stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.total_stock}
          </span>
        </div>
      </div>
    </div>
  );
};

// La cuadrícula de productos. Ahora solo recibe 'products'
const ProductGrid = ({ products, onProductSelect }) => {
  // Este bloque ahora se muestra gracias a la API
  if (!products || products.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg border">
        <h2 className="text-2xl font-semibold">No hay productos</h2>
        <p className="text-gray-500 mt-2">Aún no has añadido ningún producto. ¡Haz clic en "Añadir Nuevo Producto" para empezar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onSelect={onProductSelect} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;