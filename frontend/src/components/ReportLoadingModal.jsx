import React from 'react';

const ReportLoadingModal = ({ isVisible = false, onClose = () => { } }) => {
    if (!isVisible) return null;

    return (
        <div className="modal opacity-100 fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
            <div
                className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
                onClick={onClose}
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
    );
};

export default ReportLoadingModal;