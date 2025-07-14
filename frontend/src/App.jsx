import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Products from './components/Products';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import Shop from './components/Shop';
import { useState } from 'react';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (files) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleFileDelete = (fileId) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  return (
    <Router>
      <Routes>
        {/* Página de login primero */}
        <Route path="/login" element={<Login />} />
        {/* Resto de la app: dashboard, productos, etc. */}
        <Route
          path="/*"
          element={
            <div className="bg-gray-900 text-white min-h-screen">
              <Header />
              <div className="flex">
                <Sidebar
                  onFileUpload={handleFileUpload}
                  onFileDelete={handleFileDelete}
                  uploadedFiles={uploadedFiles}
                />
                <main className="flex-1 ml-32">
                  <Routes>
                    <Route path="/" element={<Navigate to="/shop" replace />} />
                    <Route path="/shop" element={<Shop uploadedFiles={uploadedFiles} />} />
                    <Route path="/dashboard" element={<Dashboard uploadedFiles={uploadedFiles} />} />
                    <Route path="/products" element={<Products uploadedFiles={uploadedFiles} />} />
                    <Route path="/reports" element={<Reports uploadedFiles={uploadedFiles} />} />
                    <Route path="/settings" element={<Settings uploadedFiles={uploadedFiles} />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
