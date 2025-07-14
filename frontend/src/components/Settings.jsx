import { useState } from 'react';

const Settings = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'Admin',
    email: 'admin@licorgest.com'
  });

  const [userRole, setUserRole] = useState('admin');
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailReports: true
  });

  const handleProfileChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleChange = (role) => {
    setUserRole(role);
  };

  const handlePreferenceChange = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const handleSaveChanges = () => {
    // Aquí puedes agregar la lógica para guardar los cambios
    console.log('Guardando cambios:', {
      userProfile,
      userRole,
      preferences
    });
    alert('Cambios guardados exitosamente');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Configuración</h2>
      </div>

      <div className="bg-gray-800 rounded-lg text-left shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Perfil de Usuario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
            <input 
              type="text" 
              value={userProfile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={userProfile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-300 mb-4 mt-6">Rol de Usuario</h3>
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center">
            <input 
              id="role-admin" 
              name="role" 
              type="radio" 
              checked={userRole === 'admin'}
              onChange={() => handleRoleChange('admin')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
            />
            <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-300">
              Administrador
            </label>
          </div>
          <div className="flex items-center">
            <input 
              id="role-warehouse" 
              name="role" 
              type="radio" 
              checked={userRole === 'warehouse'}
              onChange={() => handleRoleChange('warehouse')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
            />
            <label htmlFor="role-warehouse" className="ml-2 block text-sm text-gray-300">
              Almacén
            </label>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-300 mb-4 mt-6">Preferencias</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input 
              id="notification" 
              type="checkbox" 
              checked={preferences.notifications}
              onChange={() => handlePreferenceChange('notifications')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700 rounded"
            />
            <label htmlFor="notification" className="ml-2 block text-sm text-gray-300">
              Notificaciones de stock bajo
            </label>
          </div>
          <div className="flex items-center">
            <input 
              id="email-reports" 
              type="checkbox" 
              checked={preferences.emailReports}
              onChange={() => handlePreferenceChange('emailReports')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700 rounded"
            />
            <label htmlFor="email-reports" className="ml-2 block text-sm text-gray-300">
              Enviar informes por email
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            onClick={handleSaveChanges}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;