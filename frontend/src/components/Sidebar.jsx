import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onFileUpload, onFileDelete, uploadedFiles, onLogout }) => {
  const [showFileManager, setShowFileManager] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { id: 'products', icon: 'fas fa-wine-glass-alt', label: 'Productos' },
    { id: 'reports', icon: 'fas fa-file-alt', label: 'Informes' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Configuración' }
  ];

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type');

      // Opcional: Si tienes un endpoint de logout en tu backend, puedes llamarlo aquí
      // try {
      //   await fetch('http://localhost:8000/auth/logout', {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `${tokenType} ${token}`,
      //       'Content-Type': 'application/json'
      //     }
      //   });
      // } catch (error) {
      //   console.error('Error al hacer logout en el servidor:', error);
      // }

      // Llamar a la función de logout del componente padre (App.jsx)
      if (onLogout) {
        onLogout();
      }
      
      // Cerrar el modal
      setShowLogoutModal(false);
      
      // Redirigir al login
      navigate('/login');
      
    } catch (error) {
      console.error('Error durante el logout:', error);
      
      // Incluso si hay error, llamamos a onLogout para limpiar el estado
      if (onLogout) {
        onLogout();
      }
      
      setShowLogoutModal(false);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleItemClick = (itemId) => {
    if (itemId === 'logout') {
      handleLogoutClick();
      return;
    }

    navigate(`/${itemId}`);
  };

  const isActive = (path) => location.pathname === `/${path}`;

  return (
    <>
      <div className="fixed top-0 h-screen p-4 flex flex-col justify-evenly bg-gray-800 text-white shadow-lg z-10 w-30">
        {/* Logo con navegación al Shop */}
        <div
          className="sidebar-icon group mt-4 cursor-pointer"
          onClick={() => navigate('/shop')}
        >
          <i className="fas fa-wine-bottle"></i>
          <span className="sidebar-tooltip group-hover:scale-100">LicorGest</span>
        </div>

        <hr className="sidebar-hr" />

        {/* Menu Items */}
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-icon group my-4 cursor-pointer ${isActive(item.id) ? 'bg-green-600 text-white' : ''
              }`}
            onClick={() => handleItemClick(item.id)}
          >
            <i className={item.icon}></i>
            <span className="sidebar-tooltip group-hover:scale-100">{item.label}</span>
          </div>
        ))}

        <hr className="sidebar-hr" />

        {/* Logout */}
        <div className="sidebar-icon group mb-4 cursor-pointer" onClick={handleLogoutClick}>
          <i className="fas fa-sign-out-alt"></i>
          <span className="sidebar-tooltip group-hover:scale-100">Cerrar Sesión</span>
        </div>
      </div>

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <i className="fas fa-sign-out-alt text-4xl text-red-500 mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Cerrar Sesión</h3>
              <p className="text-gray-300 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Cerrando...
                    </>
                  ) : (
                    'Cerrar Sesión'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;