import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { AdminRoute } from './routes/AdminRoute';
import { LoadingProvider, useLoading } from './store/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import { setLoadingHandlers } from './api/client';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProfileAdmin from './pages/ProfileAdmin';
import ProfileUser from './pages/ProfileUser';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUser from './pages/DashboardUser';
import FormLaporan from './pages/FormLaporan';
import RiwayatLaporan from './pages/RiwayatLaporan';
import Edukasi from './pages/Edukasi';
import DashboardPMO from './pages/DashboardPMO';
import SuperAdmin from './pages/SuperAdmin';

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboardadmin', element: <DashboardAdmin /> },
  { path: '/dashboardpmo', element: <DashboardPMO /> },
  { path: '/superadmin', element: <SuperAdmin /> },
];

const privateRoutes = [
  { path: '/profile', element: <Profile /> },
  { path: '/dashboarduser', element: <DashboardUser /> },
  { path: '/profileuser', element: <ProfileUser /> },
];

const adminRoutes = [
  { path: '/profileadmin', element: <ProfileAdmin /> },
];

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
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scan/:barcodeId" element={<FormLaporan />} />
            <Route path="/scan/:barcodeId/history" element={<RiwayatLaporan />} />
            <Route path="/edukasi" element={<Edukasi />} />
            <Route path="/dashboardadmin" element={<DashboardAdmin />} />
            <Route path="/dashboardpmo" element={<DashboardPMO />} />
            <Route path="/superadmin" element={<SuperAdmin />} />
            {/* Private routes */}
            {privateRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
            ))}
            {/* Admin routes */}
            {adminRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={<AdminRoute>{element}</AdminRoute>} />
            ))}
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
