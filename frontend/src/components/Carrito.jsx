import React from 'react';

const Carrito = ({
  cart,
  variantes,
  handleCantidadChange,
  setCart,
  calcularTotal,
  handleCheckout,
  loading,
  success,
}) => {
  return (
    <div className="sticky top-16 z-40 bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🛒 Carrito</h2>
      {Object.keys(cart).filter(id => cart[id] > 0).length === 0 ? (
        <p className="text-gray-400">El carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(cart)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
              const item = variantes.find(v => v.id === Number(id));
              return (
                <div
                  key={id}
                  className="flex items-center bg-gray-800 p-4 rounded justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{item.producto.nombre}</h4>
                    <p className="text-sm text-gray-400">
                      S/{item.precio.toFixed(2)} x {qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-700 rounded"
                      onClick={() =>
                        handleCantidadChange(item.id, (cart[item.id] || 0) - 1)
                      }
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      className="px-2 py-1 bg-gray-700 rounded"
                      onClick={() =>
                        handleCantidadChange(item.id, (cart[item.id] || 0) + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 ml-2"
                      onClick={() =>
                        setCart(prev => {
                          const nuevo = { ...prev };
                          delete nuevo[item.id];
                          return nuevo;
                        })
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          <div className="text-right mt-4 font-bold text-lg text-green-400">
            Total: S/{calcularTotal().toFixed(2)}
          </div>
          <button
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded mt-2"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Finalizar Compra'}
          </button>
          {success && (
            <div className="text-green-500 font-medium mt-2">{success}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Carrito;
