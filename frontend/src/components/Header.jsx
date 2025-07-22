import React, { useEffect, useState } from 'react';

const Header = ({ pageTitle = "Licorería 360", onLogout }) => {
  const [userName, setUserName] = useState('Usuario');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const getUserName = () => {
      // Intentar obtener el nombre de diferentes fuentes
      const storedName = localStorage.getItem('user_name');
      const userData = localStorage.getItem('user_data');
      
      if (storedName) {
        setUserName(storedName);
      } else if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          if (parsedData.name || parsedData.username || parsedData.email) {
            const name = parsedData.name || parsedData.username || parsedData.email.split('@')[0];
            setUserName(name);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    getUserName();

    // Escuchar cambios en localStorage para actualizar el nombre cuando el usuario haga login
    const handleStorageChange = (e) => {
      if (e.key === 'user_name' || e.key === 'user_data') {
        getUserName();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente por si el nombre cambia en la misma pestaña
    const interval = setInterval(getUserName, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 flex justify-between py-2 ml-32 shadow-xl/20">
      <div className="flex items-center px-4">
        <h1 className="text-xl font-bold mr-4 text-gray-800 dark:text-white">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center px-4 relative">
        <span className="mr-3 text-sm font-semibold text-gray-800 dark:text-white">
          ¡Hola, {userName}!
        </span>
        
        <div className="relative">
          <div 
            className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shadow-lg"
            onClick={handleUserMenuToggle}
          >
            <span className="text-sm font-bold">
              {getInitials(userName)}
            </span>
          </div>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border dark:border-slate-700">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-slate-700">
                <div className="font-semibold">{userName}</div>
                <div className="text-xs text-gray-500">Usuario logueado</div>
              </div>
              
              <button
                onClick={() => setShowUserMenu(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <i className="fas fa-user mr-2"></i>
                Mi Perfil
              </button>
              
              <button
                onClick={() => setShowUserMenu(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <i className="fas fa-cog mr-2"></i>
                Configuración
              </button>
              
              <hr className="my-1 dark:border-slate-700" />
              
              {onLogout && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Cerrar Sesión
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar el menu cuando se hace click fuera */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Header;