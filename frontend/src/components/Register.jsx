import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ 
        nombres: '',
        apellidos: '', 
        correo: '', 
        contrasena: '', 
        confirmPassword: '',
        dni: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validaciones del frontend
        if (!form.nombres.trim()) {
            setError('El nombre es requerido');
            setLoading(false);
            return;
        }

        if (!form.apellidos.trim()) {
            setError('Los apellidos son requeridos');
            setLoading(false);
            return;
        }

        if (!form.dni.trim()) {
            setError('El DNI es requerido');
            setLoading(false);
            return;
        }

        if (form.dni.length !== 8) {
            setError('El DNI debe tener 8 dígitos');
            setLoading(false);
            return;
        }

        if (form.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        if (form.contrasena !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombres: form.nombres,
                    apellidos: form.apellidos,
                    correo: form.correo,
                    contrasena: form.contrasena,
                    dni: form.dni
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Usuario registrado exitosamente. Redirigiendo al login...');
                
                // Limpiar formulario
                setForm({
                    nombres: '',
                    apellidos: '', 
                    correo: '', 
                    contrasena: '', 
                    confirmPassword: '',
                    dni: ''
                });

                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.detail || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <i className="fas fa-wine-bottle text-4xl text-purple-500 mb-2"></i>
                    <h2 className="text-2xl font-bold">Crear Cuenta</h2>
                    <p className="text-gray-400 text-sm">Únete a LicorGest</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm px-4 py-3 mb-4 rounded-lg flex items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/20 border border-green-500 text-green-400 text-sm px-4 py-3 mb-4 rounded-lg flex items-center">
                        <i className="fas fa-check-circle mr-2"></i>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fas fa-user mr-2"></i>
                            Nombres
                        </label>
                        <input
                            type="text"
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            placeholder="Tus nombres"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fas fa-user mr-2"></i>
                            Apellidos
                        </label>
                        <input
                            type="text"
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            placeholder="Tus apellidos"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fas fa-id-card mr-2"></i>
                            DNI
                        </label>
                        <input
                            type="text"
                            name="dni"
                            value={form.dni}
                            onChange={handleChange}
                            placeholder="12345678"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            pattern="[0-9]{8}"
                            maxLength="8"
                            required
                            disabled={loading}
                        />
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fas fa-lock mr-2"></i>
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
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
                                Registrando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-user-plus mr-2"></i>
                                Registrarse
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-center text-gray-400 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            disabled={loading}
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;