import React, { useState, useEffect } from 'react';
import Carrito from './Carrito';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export default function Checkout() {
  const [variantes, setVariantes] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE}/variantes/`)
      .then((resp) => setVariantes(resp.data))
      .catch((err) =>
        setError(err.response?.data?.detail || err.message)
      );
  }, []);

  const handleCantidadChange = (varianteId, nuevaCantidad) => {
    const variante = variantes.find((v) => v.id === varianteId);
    const cantidadAnterior = cart[varianteId] || 0;
    const nuevaCantidadLimitada = Math.min(
      Math.max(nuevaCantidad, 0),
      variante?.stock || 0
    );

    // Calcular diferencia para ajustar stock
    const diferencia = nuevaCantidadLimitada - cantidadAnterior;

    // Actualizar carrito
    setCart((prev) => ({
      ...prev,
      [varianteId]: nuevaCantidadLimitada,
    }));

    // Actualizar stock del producto
    if (diferencia !== 0) {
      setVariantes((prev) =>
        prev.map((v) =>
          v.id === varianteId
            ? { ...v, stock: v.stock - diferencia }
            : v
        )
      );
    }
  };

  const agregarAlCarrito = (varianteId) => {
    const cantidadActual = cart[varianteId] || 0;
    const variante = variantes.find((v) => v.id === varianteId);

    if (variante.stock > 0) {
      handleCantidadChange(varianteId, cantidadActual + 1);
    }
  };

  const calcularTotal = () =>
    Object.entries(cart).reduce((sum, [varianteId, qty]) => {
      const variante = variantes.find((v) => v.id === Number(varianteId));
      return sum + (variante?.precio || 0) * qty;
    }, 0);

  const handleCheckout = async () => {
    setError(null);
    setSuccess(null);
    const total = calcularTotal();
    if (total <= 0) {
      setError('El carrito está vacío.');
      return;
    }

    setLoading(true);
    try {
      const fechaHoy = new Date().toISOString().slice(0, 10);
      const compraResp = await axios.post(`${API_BASE}/compras/`, {
        fecha: fechaHoy,
        total,
      });
      const compraId = compraResp.data.id;

      const detallesDatos = Object.entries(cart)
        .filter(([_, qty]) => qty > 0)
        .map(([varId, cantidad]) => {
          const variante = variantes.find((v) => v.id === Number(varId));
          return {
            cantidad,
            subtotal: variante.precio * cantidad,
            id_compra: compraId,
            id_variante: Number(varId),
          };
        });

      await Promise.all(
        detallesDatos.map((detalle) =>
          axios.post(`${API_BASE}/detalle_compras/`, detalle)
        )
      );

      // Actualizar stock en el backend después de la compra exitosa
      await Promise.all(
        Object.entries(cart)
          .filter(([_, qty]) => qty > 0)
          .map(([varId, cantidad]) => {
            const variante = variantes.find((v) => v.id === Number(varId));
            const nuevoStock = Math.max(0, variante.stock - cantidad);

            // Actualizar stock en el backend
            return axios.patch(`${API_BASE}/variantes/stock/${varId}`, {
              stock: nuevoStock
            });
          })
      );

      setSuccess('Compra realizada con éxito.');
      setCart({});

      // Recargar variantes para obtener stock actualizado del servidor
      const resp = await axios.get(`${API_BASE}/variantes`);
      setVariantes(resp.data);

    } catch (success) {
      console.error(success);
      setSuccess(success.response?.data?.detail || 'Compra realizada con éxito.');
      // En caso de error, recargar variantes para restaurar stock correcto
      try {
        const resp = await axios.get(`${API_BASE}/variantes`);
        setVariantes(resp.data);
      } catch (reloadErr) {
        console.error('Error recargando variantes:', reloadErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredVariantes = variantes.filter((v) =>
    v.producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-white">
      {/* Catálogo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Catálogo de Productos</h2>
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && (
          <div className="text-red-500 font-semibold mb-4">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-purple-400 mb-2"></i>
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredVariantes.length > 0 ? (
              filteredVariantes.map((v) => (
                <div
                  key={v.id}
                  className="bg-gray-800 rounded p-4 shadow-md"
                >
                  <img
                    src={v.imagen}
                    alt={v.producto.nombre}
                    className="h-60 w-full rounded mb-2 object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/200x200?text=Sin+Imagen';
                    }}
                  />
                  <h3 className="text-lg font-semibold">{v.producto.nombre}</h3>
                  <p className="text-sm text-gray-400 capitalize">
                    {v.producto.categoria?.nombre || 'Sin categoría'}
                  </p>
                  <p className="text-sm text-gray-500">{v.descripcion}</p>
                  <p className="text-sm text-gray-500">
                    Presentación: {v.cantidad + " ml"}
                  </p>
                  <p className="font-bold text-purple-400">
                    S/{v.precio.toFixed(2)}
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex flex-row gap-4">
                      <span
                        className={`text-sm ${v.stock > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                      >
                        Stock: {v.stock}
                      </span>

                      {/* Mostrar cantidad en el carrito si existe */}
                      {cart[v.id] > 0 && (
                        <span className="text-sm text-blue-400">
                          En carrito: {cart[v.id]}
                        </span>
                      )}
                    </div>
                    {/* Botón de agregar al carrito */}
                    <button
                      onClick={() => agregarAlCarrito(v.id)}
                      disabled={v.stock === 0 || (cart[v.id] || 0) >= v.stock}
                      className={`w-full py-2 px-4 rounded font-medium transition-colors ${v.stock === 0 || (cart[v.id] || 0) >= v.stock
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                    >
                      {v.stock === 0
                        ? 'Sin stock'
                        : (cart[v.id] || 0) >= v.stock
                          ? 'Stock máximo alcanzado'
                          : 'Agregar al carrito'
                      }
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 py-8">
                <i className="fas fa-search text-3xl mb-2"></i>
                <p>No se encontraron productos</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Carrito */}
      <div>
        <Carrito
          cart={cart}
          variantes={variantes}
          setCart={setCart}
          handleCantidadChange={handleCantidadChange}
          calcularTotal={calcularTotal}
          handleCheckout={handleCheckout}
          loading={loading}
          success={success}
        />
      </div>
    </div>
  );
}