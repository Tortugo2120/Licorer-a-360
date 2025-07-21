import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProducts = ({ isOpen, onClose, onAddProduct }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        id_categoria: "",
    });

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategorias, setLoadingCategorias] = useState(false);
    const [error, setError] = useState("");
    // Función para obtener las categorías desde la API
    const fetchCategorias = async () => {
        setLoadingCategorias(true);
        try {
            const response = await axios.get("http://localhost:8000/categorias");
            setCategorias(response.data);
        } catch (err) {
            console.error("Error al obtener categorías:", err);
            setError("Error al cargar las categorías");
        } finally {
            setLoadingCategorias(false);
        }
    };

    // Cargar categorías cuando el modal se abra
    useEffect(() => {
        if (isOpen) {
            fetchCategorias();
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!formData.name || !formData.description || !formData.id_categoria) {
                setError("Por favor, complete todos los campos requeridos");
                return;
            }

            const newProduct = {
                nombre: formData.name.trim(),
                descripcion: formData.description.trim(),
                id_categoria: parseInt(formData.id_categoria), // Convertir a número
            };

            const response = await axios.post(
                "http://localhost:8000/productos",
                newProduct
            );

            if (response.status === 200 || response.status === 201) {
                if (onAddProduct) {
                    onAddProduct(response.data);
                }
                resetForm();
                console.log("Producto creado exitosamente");
                onClose();
                onAddProduct();
            }
        } catch (err) {
            // Manejar errores
            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Error al crear el producto. Inténtalo de nuevo.");
            }
            console.error("Error al crear producto:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            id_categoria: "",
        });
        setError("");
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
                        <h3 className="text-xl font-bold text-white">
                            Añadir Nuevo Producto
                        </h3>
                        <button
                            onClick={handleCloseModal}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Mostrar error si existe */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

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
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Descripción*
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Un maravilloso producto..."
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Categoría *
                            </label>
                            <select
                                name="id_categoria"
                                value={formData.id_categoria}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                required
                                disabled={loading || loadingCategorias}
                            >
                                <option value="">
                                    {loadingCategorias ? "Cargando categorías..." : "Seleccione una categoría..."}
                                </option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end pt-2 space-x-2">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                disabled={loading || loadingCategorias}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar Producto"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProducts;