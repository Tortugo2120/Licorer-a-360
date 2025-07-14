import React, { useState, useEffect } from 'react';

const EditProducts = ({ isOpen, onClose, onEditProduct, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sku: '',
        price: '',
        quantity: '',
        supplier: '',
        image: null,
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    const categories = [
        { value: '', label: 'Seleccionar categoría' },
        { value: 'wine', label: 'Vinos' },
        { value: 'whisky', label: 'Whisky' },
        { value: 'vodka', label: 'Vodka' },
        { value: 'rum', label: 'Ron' },
        { value: 'tequila', label: 'Tequila' }
    ];

    const suppliers = [
        { value: '', label: 'Seleccionar proveedor' },
        { value: 'supplier1', label: 'Global Spirits' },
        { value: 'supplier2', label: 'Premium Drinks' },
        { value: 'supplier3', label: 'Liquor Imports' }
    ];

    // Cargar datos del producto cuando se abre el modal
    useEffect(() => {
        if (isOpen && product) {
            setFormData({
                name: product.name || '',
                category: product.category || '',
                sku: product.sku || '',
                price: product.price || '',
                quantity: product.quantity || '',
                supplier: product.supplier || '',
                image: product.image || null,
                description: product.description || ''
            });
            setPreviewImage(product.image);
            setErrors({});
        }
    }, [isOpen, product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error específico cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Solo se permiten archivos JPG, PNG o WebP'
                }));
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'El archivo no puede ser mayor a 5MB'
                }));
                return;
            }

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Limpiar error de imagen
            setErrors(prev => ({
                ...prev,
                image: ''
            }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setPreviewImage(null);
        // Limpiar input de archivo
        const fileInput = document.getElementById('edit-product-image');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del producto es requerido';
        }

        if (!formData.category) {
            newErrors.category = 'La categoría es requerida';
        }

        if (!formData.sku.trim()) {
            newErrors.sku = 'El SKU es requerido';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }

        if (!formData.quantity || parseInt(formData.quantity) < 0) {
            newErrors.quantity = 'La cantidad no puede ser negativa';
        }

        if (!formData.supplier) {
            newErrors.supplier = 'El proveedor es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const updatedProduct = {
            ...product,
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            updatedAt: new Date().toISOString()
        };

        onEditProduct(updatedProduct);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            category: '',
            sku: '',
            price: '',
            quantity: '',
            supplier: '',
            image: null,
            description: ''
        });
        setPreviewImage(null);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">
                        <i className="fas fa-edit mr-2"></i>
                        Editar Producto
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre del producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Nombre del producto *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Ej: Vino Tinto Reserva"
                            className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 ${errors.name ? 'border-red-500' : 'border-gray-600'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Categoría y SKU */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Categoría *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 ${errors.category ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="Ej: VTR-001"
                                className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 ${errors.sku ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            />
                            {errors.sku && (
                                <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
                            )}
                        </div>
                    </div>

                    {/* Precio y Cantidad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Precio ($) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 ${errors.price ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Cantidad en stock *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="0"
                                className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 ${errors.quantity ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                            )}
                        </div>
                    </div>

                    {/* Proveedor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Proveedor *
                        </label>
                        <select
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleInputChange}
                            className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 ${errors.supplier ? 'border-red-500' : 'border-gray-600'
                                }`}
                        >
                            {suppliers.map(supplier => (
                                <option key={supplier.value} value={supplier.value}>
                                    {supplier.label}
                                </option>
                            ))}
                        </select>
                        {errors.supplier && (
                            <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
                        )}
                    </div>

                    {/* Imagen del producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Imagen del producto
                        </label>
                        <div className="space-y-2">
                            <input
                                type="file"
                                id="edit-product-image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            />
                            {errors.image && (
                                <p className="text-red-500 text-xs">{errors.image}</p>
                            )}

                            {previewImage && (
                                <div className="relative inline-block">
                                    <img
                                        src={previewImage}
                                        alt="Vista previa"
                                        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Descripción (opcional)
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Descripción del producto..."
                            rows="3"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <i className="fas fa-save mr-2"></i>
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProducts;