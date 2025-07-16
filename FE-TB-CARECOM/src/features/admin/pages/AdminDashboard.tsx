// features/admin/pages/AdminDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers, usePMOs, useDailyMonitoringAdmin } from '../hooks';
import { useEducationalMaterials } from '../../education/hooks';
import ModernLayout from '../../../layouts/ModernLayout';

const AdminDashboard: React.FC = () => {
  const { users, loading: usersLoading } = useUsers({ role: 'perawat' });
  const { pmos, loading: pmosLoading } = usePMOs();
  const { monitoring, loading: monitoringLoading } = useDailyMonitoringAdmin();
  const { data: educationData, loading: educationLoading } = useEducationalMaterials({ page: 1, per_page: 1 });

  // Calculate stats
  const totalPerawat = users.length;
  const totalPMO = pmos.length;
  const totalMonitoring = monitoring.length;
  const totalEducationalMaterials = educationData?.pagination?.total_items || 0;
  const recentMonitoring = monitoring.slice(0, 5);

  const StatCard = ({ title, value, color, icon, to }: {
    title: string;
    value: number | string;
    color: string;
    icon: string;
    to: string;
  }) => (
    <Link to={to} className={`${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 block`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-white bg-opacity-20">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <ModernLayout title="Dashboard Admin" subtitle="Kelola sistem TB CARECOM secara menyeluruh">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin!</h1>
            <p className="text-red-100">Kelola seluruh sistem pengobatan TB secara terpusat</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Perawat"
          value={usersLoading ? '...' : totalPerawat}
          color="bg-blue-600"
          icon="👩‍⚕️"
          to="/admin/users"
        />
        <StatCard
          title="Total PMO"
          value={pmosLoading ? '...' : totalPMO}
          color="bg-green-600"
          icon="👥"
          to="/admin/pmo"
        />
        <StatCard
          title="Monitoring Hari Ini"
          value={monitoringLoading ? '...' : totalMonitoring}
          color="bg-purple-600"
          icon="📊"
          to="/admin/monitoring"
        />
        <StatCard
          title="Materi Edukasi"
          value={educationLoading ? '...' : totalEducationalMaterials}
          color="bg-orange-600"
          icon="📚"
          to="/admin/educational-materials"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Aksi Cepat</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: 'Kelola Perawat', desc: 'Tambah dan kelola data perawat', to: '/admin/users', color: 'bg-blue-500', icon: '👩‍⚕️' },
            { title: 'Kelola PMO', desc: 'Kelola data PMO pasien', to: '/admin/pmo', color: 'bg-green-500', icon: '👥' },
            { title: 'Materi Edukasi', desc: 'Upload konten edukasi', to: '/admin/educational-materials', color: 'bg-purple-500', icon: '📚' },
            { title: 'Monitoring', desc: 'Pantau aktivitas harian', to: '/admin/monitoring', color: 'bg-orange-500', icon: '📊' }
          ].map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-left block"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} to-${action.color.replace('bg-', 'bg-')}-600 rounded-xl flex items-center justify-center mb-4`}>
                <span className="text-xl text-white">{action.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Monitoring */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Monitoring Terbaru</h2>
          <Link
            to="/admin/monitoring"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Lihat Semua →
          </Link>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          {monitoringLoading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Memuat data monitoring...</p>
            </div>
          ) : recentMonitoring.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Belum ada data monitoring hari ini</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentMonitoring.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ID: {item.id}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.patient.name}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{item.description}</p>
                      <p className="text-gray-500 text-xs">
                        Waktu obat: {new Date(item.medication_time).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModernLayout>
  );
};

export default AdminDashboard; 