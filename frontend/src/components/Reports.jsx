// src/components/Reports.jsx
import React, { useState } from 'react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('ventas');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const reports = [
        {
            nombre: 'Ventas_Abril_2025.csv',
            tipo: 'Ventas',
            fecha: '15/04/2025',
            tamano: '245 KB',
        },
        {
            nombre: 'Stock_Marzo_2025.csv',
            tipo: 'Stock',
            fecha: '31/03/2025',
            tamano: '312 KB',
        },
        {
            nombre: 'Ventas_Marzo_2025.csv',
            tipo: 'Ventas',
            fecha: '15/03/2025',
            tamano: '240 KB',
        },
    ];

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        
        try {
            // Aquí iría tu lógica para generar el informe
            // Por ejemplo, hacer una llamada a tu API
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulación de 3 segundos
            
            // Aquí podrías agregar el nuevo reporte a la lista
            console.log('Informe generado exitosamente');
            
        } catch (error) {
            console.error('Error al generar el informe:', error);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <div id="reports-view" className="p-6 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Informes</h2>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center border-b border-gray-700 mb-4">
                    <button
                        className={`py-4 px-6 text-sm font-medium ${activeTab === 'ventas' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'
                            }`}
                        onClick={() => setActiveTab('ventas')}
                    >
                        Informe de Ventas
                    </button>
                    <button
                        className={`py-4 px-6 text-sm font-medium ${activeTab === 'stock' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'
                            }`}
                        onClick={() => setActiveTab('stock')}
                    >
                        Informe de Stock
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Fecha Inicio</label>
                        <input type="date" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Fecha Fin</label>
                        <input type="date" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                        <select className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white">
                            <option value="">Todas</option>
                            <option value="wine">Vinos</option>
                            <option value="whisky">Whisky</option>
                            <option value="vodka">Vodka</option>
                            <option value="rum">Ron</option>
                            <option value="tequila">Tequila</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        id="generate-report-btn"
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleGenerateReport}
                        disabled={isGeneratingReport}
                    >
                        <i className="fas fa-file-export mr-2"></i> 
                        {isGeneratingReport ? 'Generando...' : 'Generar Informe'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Informes Recientes</h3>
                <div className="overflow-x-auto text-left">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Tamaño
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {reports.map((report, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.tipo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.fecha}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.tamano}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <button className="text-blue-400 hover:text-blue-500 mr-3">
                                            <i className="fas fa-download"></i>
                                        </button>
                                        <button className="text-red-400 hover:text-red-500">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de carga */}
            {isGeneratingReport && (
                <div className="modal opacity-100 fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
                    <div 
                        className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
                        onClick={() => setIsGeneratingReport(false)}
                    ></div>

                    <div className="modal-container bg-gray-800 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-8 text-center px-6">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                                <p className="text-xl font-bold text-white">Generando Informe</p>
                                <p className="text-gray-400 mt-2">Por favor espere mientras procesamos su solicitud...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;