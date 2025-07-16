import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError, showInfo } from '../utils/sweetAlert';

interface QRScannerProps {
  title?: string;
  description?: string;
  className?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  title = "Scan QR Code", 
  description = "Scan QR Code untuk daily monitoring",
  className = ""
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleManualInput = () => {
    if (!manualCode.trim()) {
      showError('QR Code Diperlukan', 'Mohon masukkan kode QR yang valid.');
      return;
    }

    // Validate QR code format (basic UUID validation)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(manualCode.trim())) {
      showError('Format QR Code Salah', 'QR Code harus berformat UUID yang valid.');
      return;
    }

    // Navigate to daily monitoring with QR code
    navigate(`/daily-monitoring?qr=${manualCode.trim()}`);
    setIsModalOpen(false);
    setManualCode('');
  };

  const showInfoModal = () => {
    showInfo(
      'Cara Menggunakan QR Scanner',
      'Scan QR Code yang diberikan oleh tenaga kesehatan Anda untuk mengakses form daily monitoring. Jika tidak memiliki scanner, Anda dapat memasukkan kode secara manual.'
    );
  };

  return (
    <>
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4.01M12 12V7.99" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-6">{description}</p>
          
          <div className="space-y-3">
            {/* Manual Input Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Masukkan Kode QR
            </button>
            
            {/* Info Button */}
            <button
              onClick={showInfoModal}
              className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-xl text-sm hover:bg-gray-200 transition-colors"
            >
              ℹ️ Bantuan
            </button>
          </div>
        </div>
      </div>

      {/* Manual Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Masukkan Kode QR</h3>
              <p className="text-gray-600 text-sm">Masukkan kode QR yang diberikan oleh tenaga kesehatan</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode QR *
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="a81bc81b-dead-4e5d-abff-90865d1e13b1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Format: UUID (contoh: a81bc81b-dead-4e5d-abff-90865d1e13b1)</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setManualCode('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleManualInput}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRScanner; 