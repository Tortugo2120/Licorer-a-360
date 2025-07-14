import React, { useState } from 'react';

const Header = ({ pageTitle = "Licorería 360", userName = "Usuario" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Aquí puedes agregar lógica para filtrar productos
    console.log('Buscando:', e.target.value);
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 flex justify-between py-2 ml-32 shadow-xl/20">
      <div className="flex items-center px-4">
        <h1 className="text-xl font-bold mr-4">{pageTitle}</h1>
        <div className="flex-grow max-w-md">
          {/*<input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-1 rounded-full px-4 py-2 text-left text-sm/6 text-gray-950/50 inset-ring inset-ring-gray-950/8 sm:w-80 dark:bg-white/5 dark:text-white/50 dark:inset-ring-white/15"
            placeholder="Buscar productos..."
          />*/}
        </div>
      </div>
      <div className="flex items-center px-4">
        <span className="mr-2">{userName}</span>
        <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
          <i className="fas fa-user"></i>
        </div>
      </div>
    </div>

  );
};

export default Header;