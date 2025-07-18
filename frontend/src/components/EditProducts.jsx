import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditVariantes = ({ isOpen, onClose, onEditVariante, product }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        category: '',
        price: '',
        quantity: '',
        stock: '',
        image: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !product) return;

        setFormData({
            nombre: product.producto?.nombre || '',
            category: product.producto?.categoria?.nombre || '',
            price: product.precio?.toString() || '',
            quantity: product.cantidad?.toString() || '',
            stock: product.stock?.toString() || '',
            image: product.imagen || '',
            description: product.producto?.descripcion || product.descripcion || '',
        });
        setPreviewImage(product.imagen || '');
        setErrors({});
    }, [isOpen, product]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageURLChange = e => {
        setFormData(prev => ({ ...prev, image: e.target.value }));
        setPreviewImage(e.target.value);
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
        setPreviewImage('');
    };

    const validate = () => {
        const errs = {};
        if (!formData.price || isNaN(formData.price) || +formData.price <= 0) errs.price = 'Precio inválido';
        if (!formData.quantity || isNaN(formData.quantity) || +formData.quantity < 0) errs.quantity = 'Cantidad inválida';
        if (!formData.stock || isNaN(formData.stock) || +formData.stock < 0) errs.stock = 'Stock inválido';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setErrors({});

        try {
            const productoId = product.producto?.id || product.producto_id || product.id;

            const payload = {
                id: product.id,
                imagen: formData.image.trim() || null,
                precio: parseFloat(formData.price),
                cantidad: parseInt(formData.quantity, 10),
                stock: parseInt(formData.stock, 10),
                producto_id: productoId,
            };

            const res = await axios.put(
                `http://localhost:8000/variantes/${product.id}`,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (typeof onEditVariante === 'function') {
                onEditVariante(res.data); // Aquí se actualiza el padre

            }

            onClose();
            // al final de tu handleSubmit, tras onClose():
            window.location.reload();

        } catch (err) {
            console.error('Error al guardar:', err);
            setErrors({ submit: err.response?.data?.detail || err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">
                        <i className="fas fa-edit mr-2"></i> Editar: {formData.nombre}
                    </h2>
                    <div className="text-sm text-gray-300"> Categoria: {formData.category}</div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400">Precio *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white ${errors.price ? 'border-red-500' : 'border-gray-600'}`}
                            />
                            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">Cantidad (ml)*</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white ${errors.quantity ? 'border-red-500' : 'border-gray-600'}`}
                            />
                            {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 border rounded-lg py-2 px-3 text-white ${errors.stock ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        {errors.stock && <p className="text-red-500 text-xs">{errors.stock}</p>}
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">URL de la imagen</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleImageURLChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"
                        />
                        {previewImage && (
                            <div className="mt-2 relative w-32 h-32">
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white resize-none"
                        />
                    </div>

                    {errors.submit && (
                        <div className="text-red-500 text-sm">{errors.submit}</div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                        >
                            <i className="fas fa-save mr-2"></i> {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVariantes;
