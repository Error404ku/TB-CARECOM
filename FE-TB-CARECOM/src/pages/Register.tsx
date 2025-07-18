import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import apiClient from '../api/client';
interface RegisterFormData {
  // User Register
  name_pmo: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // PMO Register
  gender_pmo: string;
  no_telp_pmo: string;
  relationship: string;
  
  // Patient Register
  name_patient: string;
  address_patient: string;
  gender_patient: string;
  no_telp_patient: string;
  start_treatment_date: string;
  assigned_nurse_id: string;
  status_patient: string;
}

interface Nurse {
  id: number;
  name: string;
  rs: string | null;
}

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    // User Register
    name_pmo: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // PMO Register
    gender_pmo: '',
    no_telp_pmo: '',
    relationship: '',
    
    // Patient Register
    name_patient: '',
    address_patient: '',
    gender_patient: '',
    no_telp_patient: '',
    start_treatment_date: '',
    assigned_nurse_id: '',
    status_patient: 'Aktif'
  });

  // Nurse selection states
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [nurseSearchTerm, setNurseSearchTerm] = useState('');
  const [showNurseDropdown, setShowNurseDropdown] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    // kalo belum diisi semua, maka tidak bisa ke step selanjutnya
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle final registration logic here
    try {
      const response = await register(formData);
      if (response.data.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const stepTitles = [
    'Informasi Akun',
    'Data PMO',
    'Data Pasien'
  ];

  const stepDescriptions = [
    'Buat akun untuk login ke sistem',
    'Informasi Pengawas Minum Obat',
    'Informasi pasien yang akan diawasi'
  ];

  const navigate = useNavigate();

  // Fetch nurses data when component mounts or when reaching step 3
  useEffect(() => {
    if (currentStep === 3 && nurses.length === 0) {
      fetchNurses();
    }
  }, [currentStep]);

  const fetchNurses = async () => {
    setLoadingNurses(true);
    try {
      const response = await apiClient.get('/perawat');
      if (response.data && response.data.data) {
        setNurses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch nurses:', error);
    } finally {
      setLoadingNurses(false);
    }
  };

  const filteredNurses = nurses.filter(nurse => 
    nurse.name.toLowerCase().includes(nurseSearchTerm.toLowerCase()) ||
    (nurse.rs && nurse.rs.toLowerCase().includes(nurseSearchTerm.toLowerCase()))
  );

  const handleNurseSelect = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setFormData({
      ...formData,
      assigned_nurse_id: nurse.id.toString()
    });
    setNurseSearchTerm(`${nurse.name} - ${nurse.rs || 'Rumah Sakit tidak tersedia'}`);
    setShowNurseDropdown(false);
  };

  const handleNurseSearchChange = (value: string) => {
    setNurseSearchTerm(value);
    setShowNurseDropdown(value.length > 0);
    
    // Clear selection if search term is cleared
    if (value === '') {
      setSelectedNurse(null);
      setFormData({
        ...formData,
        assigned_nurse_id: ''
      });
    }
  };

  // Step validation
  const isStep1Valid =
    formData.name_pmo.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '';

  const isStep2Valid =
    formData.gender_pmo.trim() !== '' &&
    formData.no_telp_pmo.trim() !== '' &&
    formData.relationship.trim() !== '';

  const isStep3Valid = 
    formData.name_patient.trim() !== '' &&
    formData.address_patient.trim() !== '' &&
    formData.gender_patient.trim() !== '' &&
    formData.no_telp_patient.trim() !== '' &&
    formData.start_treatment_date.trim() !== '' &&
    formData.assigned_nurse_id.trim() !== '' &&
    formData.status_patient.trim() !== '';


  // Step 1: User Register
  const renderUserRegisterStep = () => (
    <div className="space-y-6">
      {/* Name PMO */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Lengkap *
         
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            name="name_pmo"
            value={formData.name_pmo}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Masukkan nama lengkap Anda"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Masukkan email Anda"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kata Sandi *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Minimal 8 karakter"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.662-2.337A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.662 2.337A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.938-1.938M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.938 4.675A9.956 9.956 0 0112 21c2.21 0 4.267-.72 5.938-1.938M21 12c0 1.657-.336 3.236-.938 4.675m-1.662 2.337A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Konfirmasi Kata Sandi *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Ulangi kata sandi Anda"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
            aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.662-2.337A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.662 2.337A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.938-1.938M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.938 4.675A9.956 9.956 0 0112 21c2.21 0 4.267-.72 5.938-1.938M21 12c0 1.657-.336 3.236-.938 4.675m-1.662 2.337A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Step 2: PMO Register
  const renderPMORegisterStep = () => (
    <div className="space-y-6">
      {/* Gender PMO */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Kelamin PMO *
        </label>
        <select
          name="gender_pmo"
          value={formData.gender_pmo}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          <option value="">Pilih jenis kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      {/* Phone PMO */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nomor Telepon PMO *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            name="no_telp_pmo"
            value={formData.no_telp_pmo}
            onChange={handleChange}
            required
            maxLength={13}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Contoh: 08123456789"
          />
        </div>
      </div>

      {/* Relationship */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hubungan dengan Pasien *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <input
            type="text"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Contoh: Orang Tua, Suami/Istri, Anak, dll"
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Patient Register
  const renderPatientRegisterStep = () => (
    <div className="space-y-6">
      {/* Patient Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Lengkap Pasien *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            name="name_patient"
            value={formData.name_patient}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Masukkan nama lengkap pasien"
          />
        </div>
      </div>

      {/* Patient Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Pasien *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            name="address_patient"
            value={formData.address_patient}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Masukkan alamat lengkap pasien"
          />
        </div>
      </div>

      {/* Patient Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Kelamin Pasien *
        </label>
        <select
          name="gender_patient"
          value={formData.gender_patient}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          <option value="">Pilih jenis kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      {/* Patient Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nomor Telepon Pasien *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            name="no_telp_patient"
            value={formData.no_telp_patient}
            onChange={handleChange}
            required
            maxLength={13}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Contoh: 08123456789"
          />
        </div>
      </div>

      {/* Treatment Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Mulai Pengobatan *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="date"
            name="start_treatment_date"
            value={formData.start_treatment_date}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Assigned Nurse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Perawat yang Ditugaskan *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            value={nurseSearchTerm}
            onChange={(e) => handleNurseSearchChange(e.target.value)}
            onFocus={() => setShowNurseDropdown(true)}
            onBlur={() => {
              // Delay hiding dropdown to allow for selection
              setTimeout(() => setShowNurseDropdown(false), 200);
            }}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder={loadingNurses ? "Memuat data perawat..." : "Cari nama perawat atau rumah sakit..."}
            disabled={loadingNurses}
          />
          
          {/* Loading indicator */}
          {loadingNurses && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          )}
          
          {/* Dropdown */}
          {showNurseDropdown && !loadingNurses && filteredNurses.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredNurses.map((nurse) => (
                <div
                  key={nurse.id}
                  onClick={() => handleNurseSelect(nurse)}
                  className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{nurse.name}</p>
                      <p className="text-sm text-gray-600">
                        {nurse.rs || 'Rumah Sakit tidak tersedia'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      ID: {nurse.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No results message */}
          {showNurseDropdown && !loadingNurses && nurseSearchTerm && filteredNurses.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
              <div className="px-4 py-3 text-center text-gray-500">
                Tidak ada perawat yang ditemukan
              </div>
            </div>
          )}
        </div>
        
        {/* Selected nurse info */}
        {selectedNurse && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Perawat terpilih: {selectedNurse.name} 
                {selectedNurse.rs && ` - ${selectedNurse.rs}`}
                <span className="text-green-600 ml-2">(ID: {selectedNurse.id})</span>
              </span>
            </div>
          </div>
        )}
        
        <p className="mt-2 text-sm text-gray-500">
          Ketik untuk mencari perawat berdasarkan nama atau rumah sakit
        </p>
      </div>

      {/* Patient Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status Pasien *
        </label>
        <select
          name="status_patient"
          value={formData.status_patient}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          <option value="Aktif">Aktif</option>
          <option value="Tidak Aktif">Tidak Aktif</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>
    </div>
  );

  return (
    <ModernLayout title="Daftar TB CareCom" subtitle="Bergabunglah dengan komunitas pengobatan TB yang peduli">
      <div className="mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {stepTitles[currentStep - 1]}
              </h3>
              <p className="text-sm text-gray-600">
                {stepDescriptions[currentStep - 1]}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={currentStep === 3 ? handleSubmit : undefined}>
            {currentStep === 1 && renderUserRegisterStep()}
            {currentStep === 2 && renderPMORegisterStep()}
            {currentStep === 3 && renderPatientRegisterStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                Sebelumnya
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isStep3Valid}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    !isStep3Valid ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Daftar Sekarang
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Benefits Section - only show on first step */}
          {currentStep === 1 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-200/50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Keuntungan Bergabung
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Akses Dashboard Modern</h4>
                    <p className="text-xs text-gray-600 mt-1">Kelola data pasien dengan mudah</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Pelaporan Real-time</h4>
                    <p className="text-xs text-gray-600 mt-1">Monitor perkembangan pengobatan</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Edukasi Terpadu</h4>
                    <p className="text-xs text-gray-600 mt-1">Akses materi edukasi lengkap</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Dukungan 24/7</h4>
                    <p className="text-xs text-gray-600 mt-1">Tim support siap membantu</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModernLayout>
  );
};

export default Register; 