import React, { useState, useEffect } from "react";
import AddProducts from "./AddProducts";
import AddCategory from "./AddCategory.jsx";
import EditProducts from "./EditProducts.jsx";
import AddVariant from "./AddVariant.jsx";
import axios from "axios";
import { defaultApi } from "../api.js";

const resultado = await defaultApi.getVariantesVariantesGet();


const Products = ({ uploadedFiles }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddVarianModal, setShowAddVariantModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([
    { value: "", label: "Todas las categorías" },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedcategoria, setSelectedcategoria] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/variantes");

        // Transformar datos del API al formato esperado por el frontend
        const formData = response.data.map((product) => ({
          id: product.id,
          imagen: product.imagen,
          nombre: product.producto?.nombre || 'Sin nombre',
          categoria: product.producto?.categoria?.nombre || "Sin categoría",
          precio: product.precio || 0,
          stock: product.stock || 0,
          cantidad: product.cantidad || 0,
          descripcion: product.producto?.descripcion || "Sin descripción",
          createdAt: new Date().toISOString(),
        }));

        setProducts(formData);

        // Extraer categorías únicas de los productos
        const uniqueCategories = [
          ...new Set(formData.map((p) => p.categoria)),
        ];
        const categoriesWithAll = [
          { value: "", label: "Todas las categorías" },
          ...uniqueCategories.map((cat) => ({ value: cat, label: cat })),
        ];
        setCategories(categoriesWithAll);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">
          <i className="fas fa-spinner fa-spin text-2xl mr-2"></i>
          Cargando productos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-400 text-center">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>Error al cargar productos: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const handleAddProduct = (newProduct) => { };

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowEditModal(true);
    }
  };

  const handleUpdateProduct = (updatedProduct) => { };

  const handleDeleteProduct = (productId) => { };

  const getStockStatus = (stock) => {
    if (stock === undefined || stock === null) {
      return { text: "No disponible", color: "text-gray-500" };
    }
    if (stock === 0) return { text: "Sin stock", color: "text-red-500" };
    if (stock < 10) return { text: "Stock bajo", color: "text-yellow-500" };
    return { text: "En stock", color: "text-green-500" };
  };

  const handleAddCategory = async (newCategory) => {
    // Refrescar la lista de categorías
    await fetchCategorias();
    console.log("Categoría agregada exitosamente:", newCategory);
  };

  const handleAddVariant = async (newVariant) => {
    // Refrescar la lista de variantes (productos)
    await fetchVariantes();
    console.log("Variante agregada exitosamente:", newVariant);
  };

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchescategoria =
      selectedcategoria === "" || product.categoria === selectedcategoria;
    return matchesSearch && matchescategoria;
  });

  // Estadísticas (adaptadas para campos que pueden no existir)
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + (product.precio || 0) * (product.stock || 0),
    0
  );
  const lowStockProducts = products.filter(
    (product) => (product.stock || 0) < 10
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Gestión de Productos
          </h2>
          <p className="text-gray-400">Administra tu inventario de licores</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir Categoria
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir Producto
          </button>
          <button
            onClick={() => setShowAddVariantModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir Variante
          </button>
        </div>
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
              <p className="text-white text-xl font-bold">
                ${totalValue.toFixed(2)}
              </p>
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
                placeholder="Buscar por nombre..."
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
              value={selectedcategoria}
              onChange={(e) => setSelectedcategoria(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
            >
              {categories.map((cat) => (
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
                <th className="text-left py-3 px-4">Presentación</th>
                <th className="text-left py-3 px-4">Precio</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-600 rounded mr-3 flex items-center justify-center">
                            <i className="fas fa-wine-bottle text-sm text-gray-400"></i>
                          </div>
                          <span className="font-medium">{product.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {product.categoria || "Sin categoría"}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {product.cantidad
                          ? `${product.cantidad} ml`
                          : "No disponible"}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {product.precio
                          ? `$${product.precio.toFixed(2)}`
                          : "No disponible"}
                      </td>
                      <td className="py-3 px-4">{product.stock || "0"}</td>
                      <td className="py-3 px-4">
                        <span className={`${stockStatus.color} font-medium`}>
                          {stockStatus.text}
                        </span>
                      </td>
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
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    <i className="fas fa-search text-3xl mb-2"></i>
                    <p>
                      No se encontraron productos que coincidan con los filtros
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/*JSON.stringify(resultado)*/}
      </div>

      {/* Modal para añadir categoria */}
      <AddCategory
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onAddCategory={handleAddCategory}
      />

      {/* Modal para añadir producto */}
      <AddProducts
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProduct={handleAddProduct}
      />
      {/* Modal para añadir variante */}
      <AddVariant
        isOpen={showAddVarianModal}
        onClose={() => setShowAddVariantModal(false)}
        onAddVariant={handleAddVariant}
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
