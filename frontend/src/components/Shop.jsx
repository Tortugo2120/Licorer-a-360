import React, { useState } from 'react';

const mockProducts = [
    {
        id: 1,
        name: 'Whisky Jack Daniel’s',
        category: 'whisky',
        price: 120.0,
        image: 'https://i.imgur.com/whisky.jpg'
    },
    {
        id: 2,
        name: 'Ron Zacapa 23',
        category: 'ron',
        price: 180.0,
        image: 'https://i.imgur.com/ron.jpg'
    },
    {
        id: 3,
        name: 'Vodka Absolut',
        category: 'vodka',
        price: 90.0,
        image: 'https://i.imgur.com/vodka.jpg'
    }
];

const Shop = () => {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(p => p.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev =>
            prev.map(p =>
                p.id === productId
                    ? { ...p, quantity: Math.max(1, p.quantity + delta) }
                    : p
            )
        );
    };

    const filteredProducts = mockProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-white">
            {/* Catálogo */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Catálogo de Licores</h2>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="w-full mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-gray-800 rounded p-4 shadow-md">
                            <img src={product.image} alt={product.name} className="h-32 w-full object-cover rounded mb-2" />
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                            <p className="font-bold text-purple-400">${product.price.toFixed(2)}</p>
                            <button
                                className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-1 rounded"
                                onClick={() => addToCart(product)}
                            >
                                Añadir al Carrito
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carrito */}
            <div>
                <h2 className="text-2xl font-bold mb-4">🛒 Carrito</h2>
                {cart.length === 0 ? (
                    <p className="text-gray-400">El carrito está vacío.</p>
                ) : (
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center bg-gray-800 p-4 rounded justify-between">
                                <div>
                                    <h4 className="font-semibold">{item.name}</h4>
                                    <p className="text-sm text-gray-400">${item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="px-2 py-1 bg-gray-700 rounded"
                                        onClick={() => updateQuantity(item.id, -1)}
                                    >−</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="px-2 py-1 bg-gray-700 rounded"
                                        onClick={() => updateQuantity(item.id, 1)}
                                    >+</button>
                                    <button
                                        className="text-red-500 hover:text-red-600 ml-2"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="text-right mt-4 font-bold text-lg text-green-400">
                            Total: ${total.toFixed(2)}
                        </div>
                        <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded mt-2">
                            Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
