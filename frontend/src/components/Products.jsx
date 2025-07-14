import React, { useState } from 'react';
import AddProducts from './AddProducts';
import EditProducts from './EditProducts.jsx';

const Products = ({ uploadedFiles }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Vino Tinto Reserva',
            category: 'wine',
            sku: 'VTR-001',
            price: 25.99,
            quantity: 50,
            supplier: 'supplier1',
            image: null,
            description: 'Un excelente vino tinto con cuerpo completo y sabor intenso.',
            createdAt: '2024-01-15T10:30:00Z'
        },
        {
            id: 2,
            name: 'Whisky Premium',
            category: 'whisky',
            sku: 'WP-002',
            price: 89.99,
            quantity: 25,
            supplier: 'supplier2',
            image: null,
            description: 'Whisky premium añejado con notas de roble y vainilla.',
            createdAt: '2024-01-14T15:45:00Z'
        },
        {
            id: 3,
            name: 'Vodka Artesanal',
            category: 'vodka',
            sku: 'VA-003',
            price: 45.50,
            quantity: 35,
            supplier: 'supplier3',
            image: null,
            description: 'Vodka artesanal destilado con métodos tradicionales.',
            createdAt: '2024-01-13T09:15:00Z'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        { value: '', label: 'Todas las categorías' },
        { value: 'wine', label: 'Vinos' },
        { value: 'whisky', label: 'Whisky' },
        { value: 'vodka', label: 'Vodka' },
        { value: 'rum', label: 'Ron' },
        { value: 'tequila', label: 'Tequila' }
    ];

    const suppliers = [
        { value: 'supplier1', label: 'Global Spirits' },
        { value: 'supplier2', label: 'Premium Drinks' },
        { value: 'supplier3', label: 'Liquor Imports' }
    ];

    const handleAddProduct = (newProduct) => {
        const productWithId = {
            ...newProduct,
            id: Math.max(...products.map(p => p.id), 0) + 1,
            createdAt: new Date().toISOString()
        };
        setProducts(prev => [...prev, productWithId]);
        console.log('Producto agregado:', productWithId);
    };

    const handleEditProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setSelectedProduct(product);
            setShowEditModal(true);
        }
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts(prev => prev.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
        ));
        console.log('Producto actualizado:', updatedProduct);
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
            setProducts(prev => prev.filter(product => product.id !== productId));
        }
    };

    const getCategoryLabel = (category) => {
        const cat = categories.find(c => c.value === category);
        return cat ? cat.label : category;
    };

    const getSupplierLabel = (supplier) => {
        const sup = suppliers.find(s => s.value === supplier);
        return sup ? sup.label : supplier;
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { text: 'Sin stock', color: 'text-red-500' };
        if (quantity < 10) return { text: 'Stock bajo', color: 'text-yellow-500' };
        return { text: 'En stock', color: 'text-green-500' };
    };

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Estadísticas
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockProducts = products.filter(product => product.quantity < 10).length;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestión de Productos</h2>
                    <p className="text-gray-400">Administra tu inventario de licores</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Añadir Producto
                </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center">
                        <i className="fas fa-box text-2xl text-blue-500 mr-3"></i>
                        <div>
                            <p className="text-gray-400 text-sm">Total Productos</p>
                            <p className="text-white text-xl font-bold">{totalProducts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center">
                        <i className="fas fa-dollar-sign text-2xl text-green-500 mr-3"></i>
                        <div>
                            <p className="text-gray-400 text-sm">Valor Total</p>
                            <p className="text-white text-xl font-bold">${totalValue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-2xl text-yellow-500 mr-3"></i>
                        <div>
                            <p className="text-gray-400 text-sm">Stock Bajo</p>
                            <p className="text-white text-xl font-bold">{lowStockProducts}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de archivos cargados */}
            {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">
                        <i className="fas fa-files mr-2"></i>
                        Archivos Disponibles ({uploadedFiles.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {uploadedFiles.map(file => (
                            <div key={file.id} className="bg-gray-700 p-2 rounded text-sm flex items-center">
                                <i className="fas fa-file mr-2 text-blue-400"></i>
                                <span className="truncate">{file.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Buscar productos
                        </label>
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Buscar por nombre o SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 pl-10 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Filtrar por categoría
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4">Producto</th>
                                <th className="text-left py-3 px-4">Categoría</th>
                                <th className="text-left py-3 px-4">SKU</th>
                                <th className="text-left py-3 px-4">Precio</th>
                                <th className="text-left py-3 px-4">Stock</th>
                                <th className="text-left py-3 px-4">Estado</th>
                                <th className="text-left py-3 px-4">Proveedor</th>
                                <th className="text-left py-3 px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => {
                                    const stockStatus = getStockStatus(product.quantity);
                                    return (
                                        <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-8 h-8 rounded mr-3 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-600 rounded mr-3 flex items-center justify-center">
                                                            <i className="fas fa-wine-bottle text-sm text-gray-400"></i>
                                                        </div>
                                                    )}
                                                    <span className="font-medium">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">{getCategoryLabel(product.category)}</td>
                                            <td className="py-3 px-4">
                                                <span className="bg-gray-600 px-2 py-1 rounded text-xs">{product.sku}</span>
                                            </td>
                                            <td className="py-3 px-4 font-medium">${product.price.toFixed(2)}</td>
                                            <td className="py-3 px-4">{product.quantity}</td>
                                            <td className="py-3 px-4">
                                                <span className={`${stockStatus.color} font-medium`}>
                                                    {stockStatus.text}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">{getSupplierLabel(product.supplier)}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product.id)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Editar producto"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                        title="Eliminar producto"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-400">
                                        <i className="fas fa-search text-3xl mb-2"></i>
                                        <p>No se encontraron productos que coincidan con los filtros</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para añadir producto */}
            <AddProducts
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAddProduct={handleAddProduct}
            />

            {/* Modal para editar producto */}
            <EditProducts
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                }}
                onEditProduct={handleUpdateProduct}
                product={selectedProduct}
            />
        </div>
    );
};

export default Products;