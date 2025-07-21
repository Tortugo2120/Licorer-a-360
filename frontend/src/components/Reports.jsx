import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const Reports = () => {
  // Tabs y loading
  const [activeTab, setActiveTab] = useState('ventas');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Datos crudos
  const [compras, setCompras] = useState([]);
  const [detallesCompras, setDetallesCompras] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Filtros
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  // Fechas por defecto (últimos 7 días)
  const obtenerFechasDefault = () => {
    const hoy = new Date();
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hoy.getDate() - 7);
    return {
      fin: hoy.toISOString().slice(0, 10),
      inicio: hace7Dias.toISOString().slice(0, 10),
    };
  };

  useEffect(() => {
    const fechas = obtenerFechasDefault();
    setFechaInicio(fechas.inicio);
    setFechaFin(fechas.fin);
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [comprasResp, detallesResp, variantesResp, productosResp] =
        await Promise.all([
          axios.get(`${API_BASE}/compras/`),
          axios.get(`${API_BASE}/detalle_compras/`),
          axios.get(`${API_BASE}/variantes/`),
          axios.get(`${API_BASE}/productos/`),
        ]);

      setCompras(comprasResp.data);
      setDetallesCompras(detallesResp.data);
      setVariantes(variantesResp.data);
      setProductos(productosResp.data);

      // Extraer categorías únicas de productos
      const uniq = {};
      productosResp.data.forEach(prod => {
        const cat = prod.categoria;
        if (cat && !uniq[cat.id]) {
          uniq[cat.id] = cat;
        }
      });
      setCategorias(Object.values(uniq));
    } catch (err) {
      setError(err.response?.data?.detail || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  // Construye array de ventas con detalles, aplica filtro de fecha y categoría, y ordena por id desc.
  const ventasFiltradas = () => {
    let filtro = compras;

    // Filtrar por fecha
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      filtro = filtro.filter(c =>
        (() => {
          const f = new Date(c.fecha);
          return f >= inicio && f <= fin;
        })()
      );
    }

    // Mapear detalles
    const conDetalles = filtro.map(compra => {
      const detalles = detallesCompras.filter(
        d => d.id_compra === compra.id
      );
      const detallesConProd = detalles.map(d => {
        const variante = variantes.find(v => v.id === d.id_variante) || {};
        return {
          ...d,
          variante,
        };
      });
      return {
        ...compra,
        detalles: detallesConProd,
      };
    });

    // Filtrar por categoría: si hay categoriaFiltro, quedarnos solo compras que tengan al menos un detalle cuya variante.producto.categoria.id === filtro
    const porCategoria = categoriaFiltro
      ? conDetalles.filter(compra =>
          compra.detalles.some(
            d =>
              d.variante.producto?.categoria?.id ===
              Number(categoriaFiltro)
          )
        )
      : conDetalles;

    // Ordenar por id desc (más recientes primero)
    return porCategoria.sort((a, b) => b.id - a.id);
  };

  // Estadísticas
  const obtenerEstadisticas = () => {
    const ventas = ventasFiltradas();
    const totalVentas = ventas.length;
    const totalIngresos = ventas.reduce((sum, v) => sum + v.total, 0);
    const productosVendidos = ventas.flatMap(v => v.detalles);
    const totalProductos = productosVendidos.reduce(
      (sum, d) => sum + d.cantidad,
      0
    );

    const contador = {};
    productosVendidos.forEach(d => {
      const nombre = d.variante.producto?.nombre || 'Desconocido';
      contador[nombre] = (contador[nombre] || 0) + d.cantidad;
    });
    const topProductos = Object.entries(contador)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return { totalVentas, totalIngresos, totalProductos, topProductos };
  };

  // Generar CSV
  const generarCSV = ventas => {
    let csv =
      'Fecha,ID Compra,Total,Producto,Cantidad,Precio Unitario,Subtotal\n';
    ventas.forEach(v => {
      v.detalles.forEach(d => {
        const nombre = d.variante.producto?.nombre || 'N/A';
        const precio = d.variante.precio || 0;
        csv += `${v.fecha},${v.id},${v.total},"${nombre}",${d.cantidad},${precio},${d.subtotal}\n`;
      });
    });
    return csv;
  };

  // Handler reporte
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const ventas = ventasFiltradas();
      const csv = generarCSV(ventas);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ventas_${fechaInicio}_${fechaFin}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setError('Error al generar el informe');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const estadisticas = obtenerEstadisticas();
  const ventas = ventasFiltradas();

  return (
    <div id="reports-view" className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Informes de Ventas</h2>
        <button
          onClick={cargarDatos}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center disabled:opacity-50"
        >
          <i className="fas fa-sync mr-2"></i>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">{error}</div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400">Total Ventas</p>
          <p className="text-2xl font-bold">{estadisticas.totalVentas}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400">Ingresos Totales</p>
          <p className="text-2xl font-bold text-green-400">
            S/{estadisticas.totalIngresos.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400">Productos Vendidos</p>
          <p className="text-2xl font-bold text-blue-400">
            {estadisticas.totalProductos}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400">Promedio por Venta</p>
          <p className="text-2xl font-bold text-purple-400">
            S/
            {estadisticas.totalVentas > 0
              ? (estadisticas.totalIngresos / estadisticas.totalVentas).toFixed(2)
              : '0.00'}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 block mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Categoría</label>
            <select
              value={categoriaFiltro}
              onChange={e => setCategoriaFiltro(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"
            >
              <option value="">Todas</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg flex items-center disabled:opacity-50"
            >
              <i className="fas fa-file-export mr-2"></i>
              {isGeneratingReport ? 'Generando...' : 'Generar CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          Ventas Recientes
        </h3>
        {loading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-purple-400 mb-2"></i>
            <p className="text-gray-400">Cargando ventas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                    ID Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                    Total
                  </th>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {ventas.length > 0 ? (
                  ventas.map(v => (
                    <tr key={v.id}>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(v.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        #{v.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {v.detalles.map((d, i) => (
                          <div key={i}>
                            {d.variante.producto?.nombre || 'Desconocido'}{' '}
                            <span className="text-gray-500">x{d.cantidad}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-400 font-semibold">
                        S/{v.total.toFixed(2)}
                      </td>
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      No hay ventas en el período seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Generación */}
      {isGeneratingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:max-w-md">
            <div className="text-center">
              <div className="animate-spin rounded-lg-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-xl font-bold text-white">Generando Informe</p>
              <p className="text-gray-400 mt-2">
                Por favor espere mientras procesamos su solicitud...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
