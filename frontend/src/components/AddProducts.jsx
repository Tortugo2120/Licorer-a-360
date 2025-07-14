import React, { useState } from 'react';

const AddProducts = ({ isOpen, onClose, onAddProduct }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sku: '',
        price: '',
        quantity: '',
        supplier: '',
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);

    const categories = [
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar campos requeridos
        if (!formData.name || !formData.category || !formData.sku || !formData.price || !formData.quantity) {
            alert('Por favor, complete todos los campos requeridos');
            return;
        }

        // Crear objeto del producto
        const newProduct = {
            id: Date.now(), // ID temporal basado en timestamp
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            createdAt: new Date().toISOString()
        };

        // Llamar a la función callback para añadir el producto
        if (onAddProduct) {
            onAddProduct(newProduct);
        }

        // Limpiar formulario y cerrar modal
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            sku: '',
            price: '',
            quantity: '',
            supplier: '',
            image: null
        });
        setImagePreview(null);
    };

    const handleCloseModal = () => {
        resetForm();
        onClose();
    };

    // No renderizar si el modal no está abierto
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Añadir Nuevo Producto</h3>
                        <button
                            onClick={handleCloseModal}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Nombre del Producto *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Ingrese el nombre del producto"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Categoría *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                required
                            >
                                <option value="">Seleccione una categoría...</option>
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Ej: VTR-001"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Precio ($) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Proveedor
                            </label>
                            <select
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="">Seleccione un proveedor...</option>
                                {suppliers.map(sup => (
                                    <option key={sup.value} value={sup.value}>
                                        {sup.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Imagen del Producto
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 cursor-pointer transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-7">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setFormData(prev => ({ ...prev, image: null }));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                                                <p className="pt-1 text-sm tracking-wider text-gray-400">
                                                    Subir imagen
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="opacity-0"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 space-x-2">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
                            >
                                Guardar Producto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProducts;