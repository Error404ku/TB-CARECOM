import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { AdminRoute, PMORoute, PerawatRoute } from './routes/AdminRoute';
import { LoadingProvider, useLoading } from './store/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import { setLoadingHandlers } from './api/client';

// Public Pages (No authentication required)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Edukasi from './pages/Edukasi';
import FormLaporan from './pages/FormLaporan';
import RiwayatLaporan from './pages/RiwayatLaporan';
import DailyMonitoring from './pages/DailyMonitoring';
import NotFound from './pages/NotFound';

// Admin/PMO Public Dashboards (Temporary public access - should be moved to private later)
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardPMO from './pages/DashboardPMO';
import SuperAdmin from './pages/SuperAdmin';

// Private Pages (Authentication required)
import Profile from './pages/Profile';
import DashboardUser from './pages/DashboardUser';
import ProfileUser from './pages/ProfileUser';

// Admin Only Pages (Admin authentication required)
import ProfileAdmin from './pages/ProfileAdmin';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import UserManagement from './features/admin/pages/UserManagement';
import PMOManagement from './features/admin/pages/PMOManagement';
import PMODetail from './features/admin/pages/PMODetail';
import EducationalMaterials from './features/admin/pages/EducationalMaterials';
import DailyMonitoringAdmin from './features/admin/pages/DailyMonitoringAdmin';

// Perawat/Nurse Pages (Nurse authentication required)
import DashboardPerawat from './pages/DashboardPerawat';
import PatientList from './features/perawat/pages/PatientList';
import PatientDetail from './features/perawat/pages/PatientDetail';
import DailyMonitoringPage from './features/perawat/pages/DailyMonitoringPage';

const LoadingSetup: React.FC = () => {
  const { increment, decrement } = useLoading();
  useEffect(() => {
    setLoadingHandlers(increment, decrement);
  }, [increment, decrement]);
  return null;
};

const App = () => {
  const { loading } = useLoading();
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Router>
          <LoadingOverlay show={loading} />
          <Routes>
            {/* =========================== PUBLIC ROUTES =========================== */}
            {/* These routes don't require authentication and use publicClient */}
            
            {/* Core Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edukasi" element={<Edukasi />} />
            
            {/* Public Barcode Scanning */}
            <Route path="/scan/:barcodeId" element={<FormLaporan />} />
            <Route path="/scan/:barcodeId/history" element={<RiwayatLaporan />} />
            
            {/* Public Daily Monitoring (QR Code based) */}
            <Route path="/daily-monitoring" element={<DailyMonitoring />} />
            
            {/* Temporary Public Admin Dashboards (TODO: Move to private) */}
            <Route path="/dashboardadmin" element={<DashboardAdmin />} />
            <Route path="/superadmin" element={<SuperAdmin />} />

            {/* =========================== PRIVATE ROUTES =========================== */}
            {/* These routes require user authentication and use privateClient */}
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="/dashboarduser" element={
              <PrivateRoute>
                <DashboardUser />
              </PrivateRoute>
            } />
            
            <Route path="/profileuser" element={
              <PrivateRoute>
                <ProfileUser />
              </PrivateRoute>
            } />

            {/* =========================== PMO ROUTES =========================== */}
            {/* These routes require PMO authentication and use privateClient */}
            
            <Route path="/dashboardpmo" element={
              <PMORoute>
                <DashboardPMO />
              </PMORoute>
            } />

            {/* =========================== ADMIN ROUTES =========================== */}
            {/* These routes require admin authentication and use privateClient */}
            
            <Route path="/profileadmin" element={
              <AdminRoute>
                <ProfileAdmin />
              </AdminRoute>
            } />
            
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            
            <Route path="/admin/pmo" element={
              <AdminRoute>
                <PMOManagement />
              </AdminRoute>
            } />
            
            <Route path="/admin/pmo/:id" element={
              <AdminRoute>
                <PMODetail />
              </AdminRoute>
            } />
            
            <Route path="/admin/educational-materials" element={
              <AdminRoute>
                <EducationalMaterials />
              </AdminRoute>
            } />
            
            <Route path="/admin/monitoring" element={
              <AdminRoute>
                <DailyMonitoringAdmin />
              </AdminRoute>
            } />

            {/* =========================== PERAWAT/NURSE ROUTES =========================== */}
            {/* These routes require nurse authentication and use privateClient */}
            
            <Route path="/perawat/dashboard" element={
              <PerawatRoute>
                <DashboardPerawat />
              </PerawatRoute>
            } />
            
            <Route path="/perawat/patients" element={
              <PerawatRoute>
                <PatientList />
              </PerawatRoute>
            } />
            
            <Route path="/perawat/patients/:id" element={
              <PerawatRoute>
                <PatientDetail />
              </PerawatRoute>
            } />
            
            <Route path="/perawat/patients/:id/monitoring" element={
              <PerawatRoute>
                <DailyMonitoringPage />
              </PerawatRoute>
            } />

            {/* =========================== 404 ROUTE =========================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

const AppWithProvider = () => (
  <LoadingProvider>
    <LoadingSetup />
    <App />
  </LoadingProvider>
);

export default AppWithProvider;
