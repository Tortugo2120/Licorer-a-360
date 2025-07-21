import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EditProducts from "./EditProducts.jsx";
import { useNavigate } from 'react-router-dom';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  DoughnutController
} from 'chart.js';

// Registrar todos los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  DoughnutController
);

const API_BASE = 'http://localhost:8000';

// Componente EditProductModal
const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stock: 0,
    precio: 0,
    descripcion: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.producto?.nombre || '',
        categoria: product.producto?.categoria?.nombre || '',
        stock: product.stock || 0,
        precio: product.precio || 0,
        descripcion: product.producto?.descripcion || ''
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Actualizar variante
      await axios.put(`${API_BASE}/variantes/${product.id}`, {
        stock: parseInt(formData.stock),
        precio: parseFloat(formData.precio),
        imagen: product.imagen,
        cantidad: product.cantidad
      });

      // Actualizar producto
      await axios.put(`${API_BASE}/productos/${product.producto.id}`, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria: {
          id: product.producto.categoria.id,
          nombre: formData.categoria
        }
      });

      await onSave();
      onClose();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  if (!isOpen) return null;

};

const Dashboard = () => {
  // Estados para datos de la API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compras, setCompras] = useState([]);
  const [detallesCompras, setDetallesCompras] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Estados para el dashboard
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    productGrowth: 0,
    recentSales: 0,
    salesGrowth: 0,
    lowStockProducts: 0,
    lowStockIncrease: 0
  });

  // Estados para el modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Referencias para los gráficos
  const salesChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const chartInstancesRef = useRef({});

  // Obtener fechas por defecto (últimos 30 días para comparación)
  const obtenerFechasComparacion = () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hoy.getDate() - 30);
    const hace60Dias = new Date(hoy);
    hace60Dias.setDate(hoy.getDate() - 60);

    return {
      actual: {
        fin: hoy.toISOString().slice(0, 10),
        inicio: hace30Dias.toISOString().slice(0, 10)
      },
      anterior: {
        fin: hace30Dias.toISOString().slice(0, 10),
        inicio: hace60Dias.toISOString().slice(0, 10)
      }
    };
  };

  useEffect(() => {
    cargarDatos();

    // Cleanup function para destruir gráficos
    return () => {
      if (chartInstancesRef.current.salesChart) {
        chartInstancesRef.current.salesChart.destroy();
      }
      if (chartInstancesRef.current.categoryChart) {
        chartInstancesRef.current.categoryChart.destroy();
      }
    };
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cargar todos los datos necesarios
      const [comprasResp, detallesResp, variantesResp,variantesGrafico, productosResp] = await Promise.all([
        axios.get(`${API_BASE}/compras`),
        axios.get(`${API_BASE}/detalle_compras`),
        axios.get(`${API_BASE}/variantes`),
        axios.get(`${API_BASE}/variantes/all`),
        axios.get(`${API_BASE}/productos`)
      ]);

      setCompras(comprasResp.data);
      setDetallesCompras(detallesResp.data);
      setVariantes(variantesResp.data);
      setProductos(productosResp.data);

      // Procesar datos para el dashboard
      procesarDatosDashboard(comprasResp.data, detallesResp.data, variantesResp.data, productosResp.data);

      // Inicializar gráficos después de procesar datos
      setTimeout(() => {
        initCharts(comprasResp.data, detallesResp.data, variantesGrafico.data);
      }, 100);

    } catch (err) {
      setError(err.response?.data?.detail || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const procesarDatosDashboard = (compras, detalles, variantes, productos) => {
    const fechas = obtenerFechasComparacion();

    // Filtrar compras por períodos
    const comprasActuales = compras.filter(compra => {
      const fechaCompra = new Date(compra.fecha);
      const inicio = new Date(fechas.actual.inicio);
      const fin = new Date(fechas.actual.fin);
      return fechaCompra >= inicio && fechaCompra <= fin;
    });

    const comprasAnteriores = compras.filter(compra => {
      const fechaCompra = new Date(compra.fecha);
      const inicio = new Date(fechas.anterior.inicio);
      const fin = new Date(fechas.anterior.fin);
      return fechaCompra >= inicio && fechaCompra <= fin;
    });

    // Calcular estadísticas
    const totalProducts = variantes.length;
    const productGrowth = comprasAnteriores.length > 0 ?
      Math.round(((comprasActuales.length - comprasAnteriores.length) / comprasAnteriores.length) * 100) : 0;

    const recentSales = comprasActuales.reduce((sum, compra) => sum + (compra.total || 0), 0);
    const previousSales = comprasAnteriores.reduce((sum, compra) => sum + (compra.total || 0), 0);
    const salesGrowth = previousSales > 0 ?
      Math.round(((recentSales - previousSales) / previousSales) * 100) : 0;

    // Identificar productos con stock bajo (<=10)
    const productosStockBajo = variantes.filter(variante => (variante.stock || 0) <= 10);
    const lowStockProducts = productosStockBajo.length;

    // Preparar datos para la tabla de stock bajo
    const productosTabla = productosStockBajo.map(variante => {
      return {
        id: variante.id,
        producto: variante.producto,
        stock: variante.stock || 0,
        precio: variante.precio || 0,
        imagen: variante.imagen,
        cantidad: variante.cantidad,
        stockLevel: (variante.stock || 0) <= 5 ? 'low' : 'medium',
        icon: obtenerIconoCategoria(variante.producto?.categoria?.nombre)
      };
    });

    setDashboardData({
      totalProducts,
      productGrowth,
      recentSales,
      salesGrowth,
      lowStockProducts,
      lowStockIncrease: Math.floor(Math.random() * 10) // Placeholder para el incremento
    });

    setLowStockProducts(productosTabla);
  };

  const obtenerIconoCategoria = (categoria) => {
    const iconos = {
      'Ron': 'fas fa-wine-bottle',
      'ROn': 'fas fa-wine-bottle',
      'Whisky': 'fas fa-wine-glass-alt',
      'Tequila': 'fas fa-wine-bottle',
      'Vodka': 'fas fa-cocktail',
      'Gin': 'fas fa-cocktail',
      'Cerveza': 'fas fa-beer',
      'Vino': 'fas fa-wine-glass'
    };
    return iconos[categoria] || 'fas fa-bottle-droplet';
  };

  const initCharts = (compras, detalles, variantes) => {
    // Destruir gráficos existentes antes de crear nuevos
    if (chartInstancesRef.current.salesChart) {
      chartInstancesRef.current.salesChart.destroy();
    }
    if (chartInstancesRef.current.categoryChart) {
      chartInstancesRef.current.categoryChart.destroy();
    }

    // Procesar datos para gráfico de ventas mensuales
    const ventasMensuales = procesarVentasMensuales(compras);

    // Procesar datos para gráfico de categorías
    const categoriasDatos = procesarCategorias(variantes, detalles);

    // Inicializar gráfico de ventas
    if (salesChartRef.current) {
      const salesCtx = salesChartRef.current.getContext('2d');
      chartInstancesRef.current.salesChart = new ChartJS(salesCtx, {
        type: 'line',
        data: {
          labels: ventasMensuales.labels,
          datasets: [{
            label: 'Ventas 2025',
            data: ventasMensuales.data,
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'rgb(209, 213, 219)'
              }
            }
          },
          scales: {
            y: {
              grid: {
                color: 'rgba(75, 85, 99, 0.2)'
              },
              ticks: {
                color: 'rgb(209, 213, 219)'
              }
            },
            x: {
              grid: {
                color: 'rgba(75, 85, 99, 0.2)'
              },
              ticks: {
                color: 'rgb(209, 213, 219)'
              }
            }
          }
        }
      });
    }

    // Inicializar gráfico de categorías
    if (categoryChartRef.current) {
      const categoryCtx = categoryChartRef.current.getContext('2d');
      chartInstancesRef.current.categoryChart = new ChartJS(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: categoriasDatos.labels,
          datasets: [{
            data: categoriasDatos.data,
            backgroundColor: [
              'rgba(139, 92, 246, 0.8)', // Purple
              'rgba(59, 130, 246, 0.8)', // Blue
              'rgba(16, 185, 129, 0.8)', // Green
              'rgba(245, 158, 11, 0.8)', // Yellow
              'rgba(239, 68, 68, 0.8)',   // Red
              'rgba(236, 72, 153, 0.8)', // Pink
              'rgba(20, 184, 166, 0.8)'  // Teal
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgb(209, 213, 219)'
              }
            }
          }
        }
      });
    }
  };

  const procesarVentasMensuales = (compras) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ventasPorMes = new Array(12).fill(0);

    compras.forEach(compra => {
      const fecha = new Date(compra.fecha);
      const mes = fecha.getMonth();
      ventasPorMes[mes] += compra.total || 0;
    });

    // Obtener los últimos 6 meses
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const labels = [];
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const mesIndex = (mesActual - i + 12) % 12;
      labels.push(meses[mesIndex]);
      data.push(ventasPorMes[mesIndex]);
    }

    return { labels, data };
  };

  const procesarCategorias = (variantes, detalles) => {
    const categorias = {};

    // Contar productos por categoría
    variantes.forEach(variante => {
      const categoria = variante.producto?.categoria?.nombre || 'Sin categoría';
      if (!categorias[categoria]) {
        categorias[categoria] = 0;
      }

      // Contar las ventas de esta variante
      const ventasVariante = detalles.filter(detalle => detalle.id_variante === variante.id);
      const totalVendido = ventasVariante.reduce((sum, detalle) => sum + (detalle.cantidad || 0), 0);
      categorias[categoria] += totalVendido;
    });

    // Ordenar por ventas y tomar los top 5
    const categoriasOrdenadas = Object.entries(categorias)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: categoriasOrdenadas.map(([categoria]) => categoria),
      data: categoriasOrdenadas.map(([, cantidad]) => cantidad)
    };
  };

  const handleEdit = (productId) => {
    const product = lowStockProducts.find(p => p.id === productId);
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      // Recargar datos después de guardar
      await cargarDatos();
      console.log('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError('Error al actualizar el producto');
    }
  };

  const handleChangeStateProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.put(`${API_BASE}/variantes/estado/${productId}`);
        console.log('Cambio de estado exitoso');
        cargarDatos(); // Recargar datos
      } catch (error) {
        const message = 'Error al cambiar el estado del producto'
        console.error(message, error);
        setError(message);
      }
    }
  };

  const handleViewAll = () => {
    console.log('Ver todos los productos');
    // Aquí podrías navegar a una página de productos completa
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando datos del dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-200 p-4 rounded-lg">
        Error: {error}
        <button
          onClick={cargarDatos}
          className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

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
          <p className="text-3xl font-bold mt-2 text-white">{dashboardData.totalProducts}</p>
          <p className={`text-sm mt-2 ${dashboardData.productGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <i className={`fas fa-arrow-${dashboardData.productGrowth >= 0 ? 'up' : 'down'}`}></i>
            {Math.abs(dashboardData.productGrowth)}% desde el mes pasado
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
          <p className="text-3xl font-bold mt-2 text-white">S/{dashboardData.recentSales.toLocaleString()}</p>
          <p className={`text-sm mt-2 ${dashboardData.salesGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <i className={`fas fa-arrow-${dashboardData.salesGrowth >= 0 ? 'up' : 'down'}`}></i>
            {Math.abs(dashboardData.salesGrowth)}% desde el mes pasado
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
          <p className="text-3xl font-bold mt-2 text-white">{dashboardData.lowStockProducts}</p>
          <p className="text-red-400 text-sm mt-2">
            <i className="fas fa-exclamation-circle"></i> Requieren atención inmediata
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Ventas Mensuales</h3>
          <div className="h-64">
            <canvas ref={salesChartRef} id="salesChart"></canvas>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Productos Más Vendidos por Categoría</h3>
          <div className="h-64">
            <canvas ref={categoryChartRef} id="categoryChart"></canvas>
          </div>
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-300">Productos con Stock Bajo</h3>
          <button
            onClick={() => navigate('/products')}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
          >
            Ver Todos
          </button>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-check-circle text-4xl mb-4"></i>
            <p>¡Excelente! No hay productos con stock bajo</p>
          </div>
        ) : (
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
              <tbody className="divide-y divide-gray-700">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className={getRowClass(product.stockLevel)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded bg-gray-700 flex items-center justify-center mr-3">
                          <i className={`${product.icon} text-gray-400`}></i>
                        </div>
                        <span className="text-white">{product.producto?.nombre || 'Producto sin nombre'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {product.producto?.categoria?.nombre || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockLevelClass(product.stockLevel)}`}>
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      ${Number(product.precio).toFixed(2)}
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
                        onClick={() => handleChangeStateProduct(product.id)}
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
        )}
      </div>

      {/* Edit Product Modal */}
      <EditProducts
        product={selectedProduct}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Dashboard;