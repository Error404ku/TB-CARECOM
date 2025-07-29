import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { showProfileUpdateSuccess } from '../utils/sweetAlert';

export default function ProfileUser() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: 'patient@example.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Pasien No. 789, Jakarta',
    patientId: 'TB-2024-001',
    diagnosisDate: '2024-01-15',
    treatmentPhase: 'intensive',
    doctor: 'Dr. Sarah Johnson',
    hospital: 'RS Umum Jakarta',
    emergencyContact: '+62 812-3456-7891',
    emergencyName: 'Ahmad Rahman',
    emergencyRelation: 'Suami'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    showProfileUpdateSuccess('user');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Profil Pasien</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                {/* Treatment Progress */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Progress Pengobatan</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fase Intensif</span>
                        <span className="text-green-600 font-medium">60%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fase Lanjutan</span>
                        <span className="text-gray-400">0%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900">Hari Pengobatan</p>
                        <p className="text-2xl font-bold text-green-600">45</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">Kepatuhan</p>
                        <p className="text-2xl font-bold text-blue-600">92%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Appointment */}
                <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-900">Kontrol Berikutnya</p>
                      <p className="text-sm text-yellow-700">15 Maret 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Informasi Pasien</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    {isEditing ? 'Batal' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            const syntheticEvent = {
                              ...e,
                              target: {
                                ...e.target,
                                name: 'phone',
                                value: value
                              }
                            };
                            handleChange(syntheticEvent);
                          }}
                          placeholder="Contoh: 08123456789"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alamat</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID Pasien</label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.patientId}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Diagnosis</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="diagnosisDate"
                          value={profileData.diagnosisDate}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.diagnosisDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fase Pengobatan</label>
                      {isEditing ? (
                        <select
                          name="treatmentPhase"
                          value={profileData.treatmentPhase}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="intensive">Fase Intensif</option>
                          <option value="continuation">Fase Lanjutan</option>
                          <option value="completed">Selesai Pengobatan</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 capitalize">{profileData.treatmentPhase}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dokter Penanggung Jawab</label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.doctor}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rumah Sakit</label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.hospital}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Kontak Darurat</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="emergencyName"
                          value={profileData.emergencyName}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.emergencyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hubungan</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="emergencyRelation"
                          value={profileData.emergencyRelation}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.emergencyRelation}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            const syntheticEvent = {
                              ...e,
                              target: {
                                ...e.target,
                                name: 'emergencyContact',
                                value: value
                              }
                            };
                            handleChange(syntheticEvent);
                          }}
                          placeholder="Contoh: 08123456789"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.emergencyContact}</p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Simpan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 