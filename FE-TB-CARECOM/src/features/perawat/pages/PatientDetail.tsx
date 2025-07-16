// features/perawat/pages/PatientDetail.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePatient, useRestartTreatment } from '../hooks';
import { perawatUtils } from '../services';
import ModernLayout from '../../../layouts/ModernLayout';
import Swal from 'sweetalert2';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patientId = parseInt(id || '0');
  
  const { patient, loading, error, refetch } = usePatient(patientId);
  const { restartTreatment, loading: restartLoading } = useRestartTreatment();

  const handleRestartTreatment = async () => {
    const result = await Swal.fire({
      title: 'Restart Pengobatan?',
      text: `Apakah Anda yakin ingin me-restart pengobatan untuk pasien ${patient?.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Restart',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const success = await restartTreatment(patientId);
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pengobatan berhasil di-restart',
          timer: 1500,
          showConfirmButton: false
        });
        refetch(patientId);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pasien...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => refetch(patientId)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Pasien tidak ditemukan</p>
        <Link
          to="/perawat/patients"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Kembali ke Daftar Pasien
        </Link>
      </div>
    );
  }

  return (
    <ModernLayout title={`Detail Pasien - ${patient?.name || 'Loading...'}`} subtitle="Informasi lengkap pasien">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/perawat/patients"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Daftar Pasien
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">Detail Pasien</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-600 mt-2">Informasi lengkap pasien</p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/perawat/patients/${patient.id}/monitoring`}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Lihat Monitoring
          </Link>
          <button
            onClick={handleRestartTreatment}
            disabled={restartLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {restartLoading ? 'Memproses...' : 'Restart Pengobatan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <p className="mt-1 text-sm text-gray-900">{patient.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <p className="mt-1 text-sm text-gray-900">{perawatUtils.formatGender(patient.gender)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                <p className="mt-1 text-sm text-gray-900">{patient.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
                <p className="mt-1 text-sm text-gray-900">{patient.no_telp}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${perawatUtils.getStatusBadgeColor(patient.status)}`}>
                  {perawatUtils.formatPatientStatus(patient.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Pengobatan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Mulai Pengobatan</label>
                <p className="mt-1 text-sm text-gray-900">{perawatUtils.formatDate(patient.start_treatment_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lama Pengobatan</label>
                <p className="mt-1 text-sm text-gray-900">
                  {Math.floor((Date.now() - new Date(patient.start_treatment_date).getTime()) / (1000 * 60 * 60 * 24))} hari
                </p>
              </div>
            </div>
          </div>

          {/* PMO Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi PMO</h2>
            {patient.pmo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama PMO</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.pmo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kontak PMO</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.pmo.contact || '-'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada PMO yang ditugaskan</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Nurse */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Perawat yang Ditugaskan</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <p className="mt-1 text-sm text-gray-900">{patient.assignedNurse.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{patient.assignedNurse.email}</p>
              </div>
              {patient.assignedNurse.rs && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rumah Sakit</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.assignedNurse.rs}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <Link
                to={`/perawat/patients/${patient.id}/monitoring`}
                className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
              >
                Lihat Monitoring Harian
              </Link>
              {/* <Link
                to={`/perawat/patients/${patient.id}/add-monitoring`}
                className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition-colors"
              >
                Tambah Monitoring
              </Link> */}
              <button
                onClick={handleRestartTreatment}
                disabled={restartLoading}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {restartLoading ? 'Memproses...' : 'Restart Pengobatan'}
              </button>
            </div>
          </div>

          {/* Record Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Record</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dibuat:</span>
                <span className="text-gray-900">{perawatUtils.formatDate(patient.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diperbarui:</span>
                <span className="text-gray-900">{perawatUtils.formatDate(patient.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default PatientDetail; 