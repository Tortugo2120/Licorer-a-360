import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Products from './components/Products';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import Register from './components/Register';
import Shop from './components/Shop';

// Ruta protegida
const ProtectedRoute = ({ isAuthenticated, children }) =>
  isAuthenticated ? children : <Navigate to="/login" replace />;

// Layout de la aplicación
const AppLayout = ({
  uploadedFiles,
  handleFileUpload,
  handleFileDelete,
  handleLogout
}) => (
  <div className="bg-gray-900 text-white min-h-screen">
    <Header onLogout={handleLogout} />
    <div className="flex">
      <Sidebar
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
        uploadedFiles={uploadedFiles}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-32 p-4">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleFileUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileDelete = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_data');
    
    // Actualizar estado de autenticación
    setIsAuthenticated(false);
    
    // Limpiar archivos subidos si es necesario
    setUploadedFiles([]);
  };

  const verifyToken = async (token) => {
    try {
      console.log('Verificando token...'); // Para debug
      
      const res = await fetch('http://localhost:8000/auth/verify-token', { // Cambié 'verifi' por 'verify'
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', res.status, res.ok); // Para debug
      
      if (res.ok) {
        console.log('Token válido'); // Para debug
        return true;
      } else {
        console.log('Token inválido o expirado'); // Para debug
        return false;
      }
    } catch (error) {
      console.error('Error al verificar token:', error); // Para debug
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('Token encontrado:', !!token); // Para debug
        
        if (token) {
          const valid = await verifyToken(token);
          
          if (mounted) {
            if (valid) {
              console.log('Autenticación exitosa'); // Para debug
              setIsAuthenticated(true);
            } else {
              console.log('Token inválido, limpiando localStorage'); // Para debug
              // Limpiar localStorage si el token no es válido
              localStorage.removeItem('access_token');
              localStorage.removeItem('token_type');
              localStorage.removeItem('user_name');
              localStorage.removeItem('user_data');
              setIsAuthenticated(false);
            }
          }
        } else {
          console.log('No se encontró token'); // Para debug
          if (mounted) {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Mostrar pantalla de carga por más tiempo para dar chance a la verificación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl flex items-center">
          <i className="fas fa-spinner fa-spin mr-3"></i>
          Verificando sesión...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Rutas protegidas */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AppLayout
                uploadedFiles={uploadedFiles}
                handleFileUpload={handleFileUpload}
                handleFileDelete={handleFileDelete}
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/shop" replace />} />
          <Route path="shop" element={<Shop uploadedFiles={uploadedFiles} />} />
          <Route path="dashboard" element={<Dashboard uploadedFiles={uploadedFiles} />} />
          <Route path="products" element={<Products uploadedFiles={uploadedFiles} />} />
          <Route path="reports" element={<Reports uploadedFiles={uploadedFiles} />} />
          <Route path="settings" element={<Settings uploadedFiles={uploadedFiles} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;