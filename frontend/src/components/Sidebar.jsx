import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onFileUpload, onFileDelete, uploadedFiles }) => {
  const [showFileManager, setShowFileManager] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { id: 'products', icon: 'fas fa-wine-glass-alt', label: 'Productos' },
    { id: 'reports', icon: 'fas fa-file-alt', label: 'Informes' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Configuración' }
  ];

  const handleItemClick = (itemId) => {
    if (itemId === 'logout') {
      // Aquí puedes agregar lógica para cerrar sesión (limpiar localStorage, etc.)
      navigate('/login');
      return;
    }

    navigate(`/${itemId}`);
  };

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const fileObjects = files.map(file => ({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        uploadDate: new Date().toISOString()
      }));

      if (onFileUpload) {
        onFileUpload(fileObjects);
      }
    }

    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = (fileId) => {
    if (onFileDelete) {
      onFileDelete(fileId);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return 'fas fa-image';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fas fa-file-excel';
    if (fileType.includes('word')) return 'fas fa-file-word';
    if (fileType.includes('text')) return 'fas fa-file-alt';
    return 'fas fa-file';
  };

  const isActive = (path) => location.pathname === `/${path}`;

  return (
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
      <div className="sidebar-icon group mb-4 cursor-pointer" onClick={() => handleItemClick('logout')}>
        <i className="fas fa-sign-out-alt"></i>
        <span className="sidebar-tooltip group-hover:scale-100">Cerrar Sesión</span>
      </div>
    </div>
  );
};

export default Sidebar;
