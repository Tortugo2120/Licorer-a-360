import React, { useState, useEffect } from "react";
import axios from "axios";

const AddVariant = ({ isOpen, onClose, onAddVariant }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formData, setFormData] = useState({
    price: "",
    image: "",
    stock: "",
    quantity: "",
    id_product: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(
          "http://localhost:8000/productos"
        );

        const productsData = productsResponse.data;
        setProducts(productsData);
        setLoadingProducts(false);
      } catch (err) {
        setError("Error al cargar productos");
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Si es el campo de imagen, actualizar preview
    if (name === "image") {
      setImagePreview(value.trim() || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (
        !formData.price ||
        !formData.image ||
        !formData.id_product ||
        !formData.stock ||
        !formData.quantity
      ) {
        setError("Por favor, complete todos los campos requeridos");
        return;
      }
      const variantData = {
        precio: parseFloat(formData.price),
        imagen: formData.image.trim(),
        stock: parseInt(formData.stock, 10),
        cantidad: parseInt(formData.quantity, 10),
        id_producto: parseInt(formData.id_product, 10),
      };

      const response = await axios.post(
        "http://localhost:8000/variantes",
        variantData
      );

      if (response.status === 200 || response.status === 201) {
        if (onAddVariant) {
          onAddVariant(response.data);
        }
        resetForm();
        console.log("Variante creada exitosamente");
        onClose();
      }
    } catch (err) {
      // Manejar errores
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error al crear la variante. Inténtalo de nuevo.");
      }
      console.error("Error al crear variante:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      price: "",
      image: "",
      stock: "",
      quantity: "",
      id_product: "",
    });
    setImagePreview(null);
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
              Añadir Nueva Variante
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
                Stock del producto
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="### unidades..."
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
                  Cantidad (ml)*
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
                Productos *
              </label>
              <select
                name="id_product"
                value={formData.id_product}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              >
                <option value="">Selecciona un producto...</option>
                {products.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.categoria.nombre + " | " + producto.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                URL de Imagen del Producto
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={loading}
              />

              {/* Preview de la imagen */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Vista previa:</p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = "none";
                        setImagePreview(null);
                      }}
                      onLoad={(e) => {
                        e.target.style.display = "block";
                      }}
                    />
                  </div>
                </div>
              )}
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
                disabled={loading || loadingProducts}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Guardando...
                  </>
                ) : (
                  "Guardar Variante"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVariant;