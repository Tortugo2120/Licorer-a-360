import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [form, setForm] = useState({ correo: '', contrasena: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Para debug

            if (response.ok) {
                // Guardar token en localStorage
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('token_type', data.token_type);

                // Guardar información del usuario
                if (data.user) {
                    // Si la API devuelve un objeto user
                    console.log('Usuario recibido:', data.user); // Para debug
                    localStorage.setItem('user_data', JSON.stringify(data.user));

                    // IMPORTANTE: Guardar el ID del usuario
                    const userId = data.user.id || data.user.user_id || data.user.usuario_id;
                    if (userId) {
                        localStorage.setItem('user_id', userId);
                        console.log('ID de usuario guardado:', userId);
                    }

                    // Intentar extraer el nombre de diferentes campos
                    const userName = data.user.nombre ||
                        data.user.name ||
                        data.user.username ||
                        data.user.correo?.split('@')[0] ||
                        form.correo.split('@')[0];

                    localStorage.setItem('user_name', userName);
                    console.log('Nombre de usuario guardado:', userName); // Para debug
                } else if (data.nombre || data.name || data.username) {
                    // Si la API devuelve el nombre directamente en el objeto principal
                    const userName = data.nombre || data.name || data.username;
                    localStorage.setItem('user_name', userName);
                    localStorage.setItem('user_data', JSON.stringify(data));

                    // IMPORTANTE: Guardar el ID del usuario desde el objeto principal
                    const userId = data.id || data.user_id || data.usuario_id;
                    if (userId) {
                        localStorage.setItem('user_id', userId);
                        console.log('ID de usuario guardado:', userId);
                    }

                    console.log('Nombre de usuario guardado:', userName); // Para debug
                } else {
                    // Fallback: usar la parte del email antes del @
                    const userName = form.correo.split('@')[0];
                    localStorage.setItem('user_name', userName);
                    localStorage.setItem('user_data', JSON.stringify({ correo: form.correo, nombre: userName }));
                    
                    // En caso de fallback, intentar obtener ID desde data
                    const userId = data.id || data.user_id || data.usuario_id;
                    if (userId) {
                        localStorage.setItem('user_id', userId);
                    }
                    console.log('Nombre de usuario (fallback):', userName); // Para debug
                }

                // Ejecutar callback de login
                if (onLogin) onLogin();

                // Mostrar éxito
                console.log('Login exitoso, redirigiendo...');

                // Redirigir
                navigate('/dashboard');
            } else {
                setError(data.detail || data.message || 'Credenciales inválidas');
            }
        } catch (err) {
            console.error('Error durante el login:', err);
            setError('Error de conexión. ¿El backend está activo?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <i className="fas fa-wine-bottle text-4xl text-purple-500 mb-2"></i>
                    <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
                    <p className="text-gray-400 text-sm">Accede a tu cuenta de LicorGest</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm px-4 py-3 mb-4 rounded-lg flex items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fas fa-envelope mr-2"></i>
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            name="correo"
                            value={form.correo}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fas fa-lock mr-2"></i>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="contrasena"
                            value={form.contrasena}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt mr-2"></i>
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-center text-gray-400 text-sm">
                        ¿No tienes cuenta?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            disabled={loading}
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;