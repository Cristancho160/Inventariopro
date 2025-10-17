import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddProductModal = ({ isOpen, onClose, onProductAdded, categories, locations }) => {
  // Estado inicial basado en los datos reales que llegan
  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    price: '0.00',
    description: '',
    category_id: categories?.[0]?.id || '', // Selecciona la primera categoría por defecto
    initial_quantity: '0',
    location_id: locations?.[0]?.id || '' // Selecciona la primera ubicación por defecto
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación
    if (!productData.name || !productData.category_id || !productData.location_id) {
      setError("Nombre, categoría y ubicación son requeridos.");
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/add_item.php`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...productData,
            price: parseFloat(productData.price),
            initial_quantity: parseInt(productData.initial_quantity, 10),
            category_id: parseInt(productData.category_id, 10),
            location_id: parseInt(productData.location_id, 10)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error del servidor.');
      }
      
      onProductAdded(); // Llama a la función para recargar la lista y cerrar

    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Añadir Nuevo Producto</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nombre del Producto" name="name" value={productData.name} onChange={handleChange} required />
            <Input label="SKU" name="sku" value={productData.sku} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Precio" name="price" type="number" step="0.01" value={productData.price} onChange={handleChange} required />
              <Input label="Cantidad Inicial" name="initial_quantity" type="number" value={productData.initial_quantity} onChange={handleChange} required />
            </div>
            <Select label="Categoría" name="category_id" value={productData.category_id} onChange={handleChange} required>
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
            <Select label="Ubicación Inicial" name="location_id" value={productData.location_id} onChange={handleChange} required>
                <option value="">Selecciona una ubicación</option>
                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
            </Select>
            <Input as="textarea" label="Descripción" name="description" value={productData.description} onChange={handleChange} />
            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Guardar Producto</Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;