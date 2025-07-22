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
  handleLogout,
  userData
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
        <Outlet context={{ userData }} />
      </main>
    </div>
  </div>
);

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const handleFileUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileDelete = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleLogin = (userData = null) => {
    setIsAuthenticated(true);
    if (userData) {
      setUserData(userData);
    }
  };

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
    
    // Actualizar estado de autenticación
    setIsAuthenticated(false);
    setUserData(null);
    
    // Limpiar archivos subidos si es necesario
    setUploadedFiles([]);
  };

  const verifyToken = async (token) => {
    try {
      console.log('Verificando token...');
      
      const res = await fetch('http://localhost:8000/auth/verify-token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', res.status, res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Token válido, datos del usuario:', data);
        return data;
      } else {
        console.log('Token inválido o expirado');
        return null;
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      return null;
    }
  };

  const getUserData = async (token) => {
    // Primero intentar desde localStorage
    const savedUserData = localStorage.getItem('user_data');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        console.log('Datos del usuario desde localStorage:', parsedData);
        
        // Asegurar que tenga un ID válido
        if (parsedData && (!parsedData.id || parsedData.id === null)) {
          console.log('Datos sin ID, intentando obtener desde el servidor...');
        } else {
          return parsedData;
        }
      } catch (e) {
        console.error('Error al parsear datos del localStorage:', e);
      }
    }

    // Si no hay datos en localStorage o no tienen ID, obtenerlos del endpoint /auth/me
    try {
      console.log('Obteniendo datos del perfil del usuario desde /auth/me...');
      const res = await fetch('http://localhost:8000/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const userData = await res.json();
        console.log('Datos del usuario desde /auth/me:', userData);
        
        // Asegurar que tenga los campos necesarios
        const normalizedUserData = {
          id: userData.id,
          username: userData.username || userData.nombre || userData.correo,
          name: userData.nombre || userData.username,
          nombres: userData.nombres || userData.nombre,
          correo: userData.correo,
          ...userData // Preservar otros campos
        };

        console.log('Datos normalizados del usuario:', normalizedUserData);
        
        // Guardar en localStorage para futuras consultas
        localStorage.setItem('user_data', JSON.stringify(normalizedUserData));
        localStorage.setItem('user_id', normalizedUserData.id.toString());
        
        // También guardar el nombre de usuario si no existe
        if (!localStorage.getItem('user_name')) {
          const displayName = normalizedUserData.nombres || normalizedUserData.username || normalizedUserData.correo;
          localStorage.setItem('user_name', displayName);
        }
        
        return normalizedUserData;
      } else {
        console.log('Error al obtener datos del perfil:', res.status);
        const errorText = await res.text();
        console.log('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error al obtener datos del perfil:', error);
    }

    // Si /auth/me no funciona, intentar obtener usuario por correo
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = tokenPayload.sub || tokenPayload.email;
      
      if (userEmail) {
        console.log('Intentando obtener usuario por correo:', userEmail);
        
        const res = await fetch(`http://localhost:8000/usuarios/email/${userEmail}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const userData = await res.json();
          console.log('Datos del usuario obtenidos por correo:', userData);
          
          const normalizedUserData = {
            id: userData.id,
            username: userData.username || userData.nombre || userData.correo,
            name: userData.nombre || userData.username,
            nombres: userData.nombres || userData.nombre,
            correo: userData.correo,
            ...userData
          };

          // Guardar en localStorage
          localStorage.setItem('user_data', JSON.stringify(normalizedUserData));
          localStorage.setItem('user_id', normalizedUserData.id.toString());
          
          return normalizedUserData;
        } else {
          console.log('No se pudo obtener usuario por correo:', res.status);
        }
      }
    } catch (error) {
      console.error('Error al obtener usuario por correo:', error);
    }

    // Si ningún método funciona, intentar crear un ID temporal basado en el correo
    const userName = localStorage.getItem('user_name');
    if (userName) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // Crear un ID temporal basado en el hash del correo o usar timestamp
        const tempId = Math.abs(userName.split('').reduce((hash, char) => {
          return ((hash << 5) - hash) + char.charCodeAt(0);
        }, 0));

        const basicUserData = {
          id: tempId,
          username: userName,
          name: userName,
          nombres: userName,
          correo: tokenPayload.sub || userName
        };
        
        console.log('Datos básicos del usuario creados con ID temporal:', basicUserData);
        
        // Guardar temporalmente
        localStorage.setItem('user_id', tempId.toString());
        
        return basicUserData;
      } catch (e) {
        console.error('Error al crear datos básicos:', e);
      }
    }

    return null;
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('Iniciando verificación de autenticación...');
        
        const token = localStorage.getItem('access_token');
        console.log('Token encontrado:', !!token);
        
        if (!token) {
          console.log('No hay token, usuario no autenticado');
          if (mounted) {
            setIsAuthenticated(false);
            setUserData(null);
            setIsLoading(false);
          }
          return;
        }

        // Verificar si el token es válido
        console.log('Verificando validez del token...');
        const tokenValid = await verifyToken(token);
        
        if (!mounted) return;

        if (tokenValid) {
          console.log('Token válido, estableciendo autenticación...');
          setIsAuthenticated(true);
          
          // Obtener datos del usuario
          console.log('Obteniendo datos del usuario...');
          const userDataResult = await getUserData(token);
          
          if (!mounted) return;
          
          if (userDataResult && userDataResult.id) {
            setUserData(userDataResult);
            console.log('Datos del usuario establecidos correctamente:', userDataResult);
            console.log('ID del usuario:', userDataResult.id, typeof userDataResult.id);
          } else {
            console.warn('No se pudieron obtener datos del usuario con ID válido');
            // Si no se puede obtener un ID válido, cerrar sesión
            handleLogout();
          }
        } else {
          console.log('Token inválido, limpiando localStorage y redirigiendo...');
          handleLogout();
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        if (mounted) {
          handleLogout();
        }
      } finally {
        if (mounted) {
          console.log('Finalizando verificación de autenticación');
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
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
                userData={userData}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/shop" replace />} />
          <Route path="shop" element={<Shop uploadedFiles={uploadedFiles} userData={userData} />} />
          <Route path="dashboard" element={<Dashboard uploadedFiles={uploadedFiles} userData={userData} />} />
          <Route path="products" element={<Products uploadedFiles={uploadedFiles} userData={userData} />} />
          <Route path="reports" element={<Reports uploadedFiles={uploadedFiles} userData={userData} />} />
          <Route path="settings" element={<Settings uploadedFiles={uploadedFiles} userData={userData} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;