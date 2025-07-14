import React, { useState } from 'react';

// Componente EditProductModal
const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    stock: product?.stock || 0,
    price: product?.price || 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, ...formData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Editar Producto</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Ron">Ron</option>
              <option value="Whisky">Whisky</option>
              <option value="Tequila">Tequila</option>
              <option value="Vodka">Vodka</option>
              <option value="Gin">Gin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Precio ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Datos de ejemplo para las cards
  const [dashboardData] = useState({
    totalProducts: 132,
    productGrowth: 12,
    recentSales: 9840,
    salesGrowth: 8,
    lowStockProducts: 23,
    lowStockIncrease: 5
  });

  // Datos de ejemplo para la tabla
  const [lowStockProducts, setLowStockProducts] = useState([
    {
      id: 1,
      name: "Ron Añejo Premium",
      category: "Ron",
      stock: 3,
      price: 42.99,
      icon: "fas fa-wine-bottle",
      stockLevel: "low"
    },
    {
      id: 2,
      name: "Whisky Escocés 12 años",
      category: "Whisky",
      stock: 5,
      price: 56.99,
      icon: "fas fa-wine-glass-alt",
      stockLevel: "low"
    },
    {
      id: 3,
      name: "Tequila Reposado",
      category: "Tequila",
      stock: 12,
      price: 35.99,
      icon: "fas fa-wine-bottle",
      stockLevel: "medium"
    }
  ]);

  // Estados para el modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (productId) => {
    const product = lowStockProducts.find(p => p.id === productId);
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    setLowStockProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    console.log('Producto actualizado:', updatedProduct);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setLowStockProducts(prev => prev.filter(product => product.id !== productId));
      console.log('Producto eliminado:', productId);
    }
  };

  const handleViewAll = () => {
    console.log('Ver todos los productos');
  };

  const getStockLevelClass = (level) => {
    switch (level) {
      case 'low':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getRowClass = (level) => {
    switch (level) {
      case 'low':
        return 'bg-red-900 bg-opacity-20';
      case 'medium':
        return 'bg-yellow-900 bg-opacity-20';
      default:
        return '';
    }
  };

  return (
    <div id="dashboard-view" className="block p-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 - Total Productos */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-300">Total de Productos</h3>
            <div className="bg-purple-500 bg-opacity-25 text-purple-500 p-2 rounded">
              <i className="fas fa-wine-glass text-purple-700"></i>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{dashboardData.totalProducts}</p>
          <p className="text-green-400 text-sm mt-2">
            <i className="fas fa-arrow-up"></i> {dashboardData.productGrowth}% desde el mes pasado
          </p>
        </div>

        {/* Card 2 - Ventas Recientes */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-300">Ventas Recientes</h3>
            <div className="bg-green-500 bg-opacity-25 text-green-500 p-2 rounded">
              <i className="fas fa-chart-line text-green-700"></i>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">${dashboardData.recentSales.toLocaleString()}</p>
          <p className="text-green-400 text-sm mt-2">
            <i className="fas fa-arrow-up"></i> {dashboardData.salesGrowth}% desde la semana pasada
          </p>
        </div>

        {/* Card 3 - Stock Bajo */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-300">Productos de Stock Bajo</h3>
            <div className="bg-red-500 bg-opacity-25 text-red-500 p-2 rounded">
              <i className="fas fa-exclamation-triangle text-red-700"></i>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{dashboardData.lowStockProducts}</p>
          <p className="text-red-400 text-sm mt-2">
            <i className="fas fa-arrow-up"></i> {dashboardData.lowStockIncrease} más desde ayer
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Ventas Mensuales</h3>
          <div className="h-64 flex items-center justify-center bg-gray-700 rounded">
            <p className="text-gray-400">Gráfico de ventas mensuales</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Top Categorías</h3>
          <div className="h-64 flex items-center justify-center bg-gray-700 rounded">
            <p className="text-gray-400">Gráfico de categorías</p>
          </div>
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-300">Productos con Stock Bajo</h3>
          <button
            onClick={handleViewAll}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
          >
            Ver Todos
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-left">
              {lowStockProducts.map((product) => (
                <tr key={product.id} className={getRowClass(product.stockLevel)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-700 flex items-center justify-center mr-3">
                        <i className={`${product.icon} text-gray-400`}></i>
                      </div>
                      <span className="text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockLevelClass(product.stockLevel)}`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="text-blue-400 hover:text-blue-500 mr-3 transition-colors"
                      title="Editar producto"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      title="Eliminar producto"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición */}
      <EditProductModal
        product={selectedProduct}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Dashboard;