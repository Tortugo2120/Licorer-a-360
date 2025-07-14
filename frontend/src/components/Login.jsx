import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.email === 'admin@licorgest.com' && form.password === '123456') {
            navigate('/dashboard'); // redirige después del login
        } else {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

                {error && (
                    <div className="bg-red-500 text-white text-sm px-4 py-2 mb-4 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Correo"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 mb-4"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 mb-6"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
