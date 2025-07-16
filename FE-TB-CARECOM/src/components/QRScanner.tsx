import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError, showInfo, showSuccess } from '../utils/sweetAlert';

// jsQR library for real QR code detection
import jsQR from 'jsqr';

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
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // QR Code detection function
  const detectQRCode = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for QR detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    try {
      // Real QR detection with jsQR library
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      
      if (qrCode && qrCode.data) {
        console.log('QR Code detected:', qrCode.data);
        handleQRDetected(qrCode.data);
      }
      
    } catch (error) {
      console.error('QR detection error:', error);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start QR detection loop
      const detectLoop = setInterval(() => {
        detectQRCode();
      }, 500);

      // Store interval reference for cleanup
      (videoRef.current as any)._detectInterval = detectLoop;

    } catch (error: any) {
      console.error('Camera access error:', error);
      setCameraError(
        error.name === 'NotAllowedError' 
          ? 'Akses kamera ditolak. Mohon izinkan akses kamera untuk scan QR code.'
          : 'Tidak dapat mengakses kamera. Pastikan perangkat memiliki kamera.'
      );
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      const interval = (videoRef.current as any)._detectInterval;
      if (interval) {
        clearInterval(interval);
      }
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setCameraError(null);
  };

  const handleCameraModalClose = () => {
    stopCamera();
    setIsCameraModalOpen(false);
  };

  const handleQRDetected = (qrCode: string) => {
    console.log('Raw QR Code detected:', qrCode);
    
    // Extract UUID from URL format: http://localhost:5173/daily-monitoring?qr=96381c89-525d-472f-b22c-62892fdb850a
    let extractedUUID = '';
    
    // Check if QR code contains daily-monitoring?qr= pattern
    const urlPattern = /daily-monitoring\?qr=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
    const urlMatch = qrCode.match(urlPattern);
    
    if (urlMatch && urlMatch[1]) {
      // Extract UUID from URL
      extractedUUID = urlMatch[1];
    } else {
      // Check if it's just a plain UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(qrCode.trim())) {
        extractedUUID = qrCode.trim();
      }
    }
    
    if (extractedUUID) {
      console.log('Extracted UUID:', extractedUUID);
      stopCamera();
      setIsCameraModalOpen(false);
      showSuccess('QR Code Terdeteksi!', 'Mengalihkan ke halaman daily monitoring...');
      
      setTimeout(() => {
        navigate(`/daily-monitoring?qr=${extractedUUID}`);
      }, 1000);
    } else {
      showError('QR Code Tidak Valid', 'QR Code harus berformat URL daily-monitoring atau UUID yang valid.');
    }
  };



  const handleManualInput = () => {
    if (!manualCode.trim()) {
      showError('QR Code Diperlukan', 'Mohon masukkan kode QR yang valid.');
      return;
    }

    const inputCode = manualCode.trim();
    let extractedUUID = '';
    
    // Check if input contains daily-monitoring?qr= pattern
    const urlPattern = /daily-monitoring\?qr=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
    const urlMatch = inputCode.match(urlPattern);
    
    if (urlMatch && urlMatch[1]) {
      // Extract UUID from URL
      extractedUUID = urlMatch[1];
    } else {
      // Check if it's just a plain UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(inputCode)) {
        extractedUUID = inputCode;
      }
    }

    if (!extractedUUID) {
      showError('Format QR Code Salah', 'QR Code harus berformat URL daily-monitoring atau UUID yang valid.');
      return;
    }

    // Navigate to daily monitoring with extracted UUID
    navigate(`/daily-monitoring?qr=${extractedUUID}`);
    setIsModalOpen(false);
    setManualCode('');
  };

  const showInfoModal = () => {
    showInfo(
      'Cara Menggunakan QR Scanner',
      'Scan QR Code yang diberikan oleh tenaga kesehatan Anda untuk mengakses form daily monitoring. QR Code berupa URL seperti "http://localhost:5173/daily-monitoring?qr=UUID" atau UUID saja. Jika tidak memiliki scanner, Anda dapat memasukkan kode secara manual.'
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
            {/* Camera Scan Button */}
            <button
              onClick={() => setIsCameraModalOpen(true)}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Scan dengan Kamera</span>
            </button>

            {/* Manual Input Button */}
            {/* <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Masukkan Kode Manual</span>
            </button> */}
            
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

      {/* Camera Scanner Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Scan QR Code</h3>
                <button
                  onClick={handleCameraModalClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-1">Arahkan kamera ke QR Code</p>
            </div>

            {/* Camera Content */}
            <div className="p-4">
              {cameraError ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-red-600 text-sm mb-4">{cameraError}</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Input Manual
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Camera Preview */}
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-square">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 border-2 border-green-500 rounded-xl">
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
                    </div>
                    
                    {/* Center guide */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-white border-opacity-50 rounded-lg"></div>
                    </div>

                    {isScanning && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          Memindai QR Code...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex space-x-3">
                                         {!isScanning ? (
                       <button
                         onClick={startCamera}
                         className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                       >
                         Mulai Scan
                       </button>
                    ) : (
                      <button
                        onClick={stopCamera}
                        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                      >
                        Berhenti Scan
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        handleCameraModalClose();
                        setIsModalOpen(true);
                      }}
                      className="bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Manual
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-blue-800 text-sm text-center">
                      📱 Arahkan kamera ke QR Code dan pastikan QR Code berada di dalam frame
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                  placeholder="http://localhost:5173/daily-monitoring?qr=96381c89-525d-472f-b22c-62892fdb850a"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Format: URL lengkap atau UUID saja (contoh: 96381c89-525d-472f-b22c-62892fdb850a)</p>
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