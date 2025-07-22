import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [editForm, setEditForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    dni: '',
    contrasena: ''
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/usuarios/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      dni: user.dni,
      contrasena: '' // No mostramos la contraseña actual
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      
      // Preparar datos para enviar (solo los campos que han cambiado)
      const updateData = {};
      
      if (editForm.nombres !== selectedUser.nombres) updateData.nombres = editForm.nombres;
      if (editForm.apellidos !== selectedUser.apellidos) updateData.apellidos = editForm.apellidos;
      if (editForm.correo !== selectedUser.correo) updateData.correo = editForm.correo;
      if (editForm.dni !== selectedUser.dni) updateData.dni = editForm.dni;
      if (editForm.contrasena.trim()) updateData.contrasena = editForm.contrasena;

      const response = await fetch(`http://localhost:8000/usuarios/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Actualizar la lista de usuarios
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        
        // Actualizar el usuario seleccionado
        setSelectedUser(updatedUser);
        
        setSuccess('Usuario actualizado exitosamente');
        setIsEditing(false);
        
        // Limpiar el campo de contraseña
        setEditForm(prev => ({ ...prev, contrasena: '' }));
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Error al actualizar usuario');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
          <p className="text-gray-400 text-sm">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          disabled={loading}
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Actualizar
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Usuarios */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <i className="fas fa-users mr-2 text-purple-500"></i>
              Lista de Usuarios
            </h3>
            
            {loading ? (
              <div className="text-center text-gray-400 py-4">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Cargando usuarios...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                No hay usuarios registrados
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser && selectedUser.id === user.id
                        ? 'bg-purple-600/30 border border-purple-500'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          {user.nombres} {user.apellidos}
                        </div>
                        <div className="text-sm text-gray-400">{user.correo}</div>
                        <div className="text-xs text-gray-500">DNI: {user.dni}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel de Edición */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <i className="fas fa-user-edit mr-2 text-purple-500"></i>
                {selectedUser ? 'Editar Usuario' : 'Selecciona un Usuario'}
              </h3>
              {selectedUser && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    isEditing
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              )}
            </div>

            {selectedUser ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-user mr-2"></i>
                      Nombres
                    </label>
                    <input
                      type="text"
                      value={editForm.nombres}
                      onChange={(e) => handleEditFormChange('nombres', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors ${
                        !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-user mr-2"></i>
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={editForm.apellidos}
                      onChange={(e) => handleEditFormChange('apellidos', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors ${
                        !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-envelope mr-2"></i>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={editForm.correo}
                      onChange={(e) => handleEditFormChange('correo', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors ${
                        !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-id-card mr-2"></i>
                      DNI
                    </label>
                    <input
                      type="text"
                      value={editForm.dni}
                      onChange={(e) => handleEditFormChange('dni', e.target.value)}
                      disabled={!isEditing}
                      maxLength="8"
                      pattern="[0-9]{8}"
                      className={`w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors ${
                        !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-lock mr-2"></i>
                      Nueva Contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      value={editForm.contrasena}
                      onChange={(e) => handleEditFormChange('contrasena', e.target.value)}
                      placeholder="Dejar vacío para mantener la actual"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La contraseña será encriptada automáticamente al guardar
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-400">
                    <div><strong>ID:</strong> {selectedUser.id}</div>
                    <div><strong>Fecha de Registro:</strong> {new Date(selectedUser.fecha_registro).toLocaleDateString()}</div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <i className="fas fa-user-friends text-4xl mb-4 text-gray-600"></i>
                <p>Selecciona un usuario de la lista para ver y editar sus datos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;