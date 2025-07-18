import React, { useState } from "react";
import axios from "axios";

const AddCategory = ({ isOpen, onClose, onAddCategory }) => {
    const [formData, setFormData] = useState({
        name: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Validación mejorada
            if (!formData.name || formData.name.trim() === "") {
                setError("Por favor, ingrese un nombre para la categoría");
                setLoading(false);
                return;
            }

            const categoryData = {
                nombre: formData.name.trim(),
            };

            const response = await axios.post(
                "http://localhost:8000/categorias",
                categoryData
            );

            if (response.status === 200 || response.status === 201) {
                // Llamar a onAddCategory con los datos de la nueva categoría
                if (onAddCategory) {
                    onAddCategory(response.data);
                }
                resetForm();
                console.log("Categoría creada exitosamente:", response.data);
                onClose();
            }
        } catch (err) {
            // Manejo de errores mejorado
            console.error("Error al crear categoría:", err);
            
            if (err.response?.status === 400) {
                setError(err.response.data?.detail || "Datos inválidos. Verifique la información.");
            } else if (err.response?.status === 409) {
                setError("Esta categoría ya existe. Por favor, elija otro nombre.");
            } else if (err.response?.status === 500) {
                setError("Error del servidor. Inténtelo más tarde.");
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Error al crear la categoría. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
        });
        setError("");
    };

    const handleCloseModal = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Limpiar error cuando el usuario empiece a escribir
        if (error) {
            setError("");
        }
    };

    // No renderizar si el modal no está abierto
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 w-11/12 md:max-w-md mx-auto rounded-lg shadow-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">
                            Añadir Nueva Categoría
                        </h3>
                        <button
                            onClick={handleCloseModal}
                            className="text-gray-400 hover:text-white transition-colors text-xl"
                            disabled={loading}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Mostrar error si existe */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Nombre de la Categoría *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                placeholder="Ej: Electrónicos, Ropa, Hogar..."
                                disabled={loading}
                                maxLength={50}
                            />
                        </div>

                        <div className="flex justify-end pt-2 space-x-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                disabled={loading || !formData.name.trim()}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar Categoría"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;