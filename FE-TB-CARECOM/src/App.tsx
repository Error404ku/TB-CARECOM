import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { AdminRoute } from './routes/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProfileAdmin from './pages/ProfileAdmin';
import ProfileUser from './pages/ProfileUser';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUser from './pages/DashboardUser';

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
];

const privateRoutes = [
  { path: '/profile', element: <Profile /> },
  { path: '/dashboarduser', element: <DashboardUser /> },
  { path: '/profileuser', element: <ProfileUser /> },
];

const adminRoutes = [
  { path: '/dashboardadmin', element: <DashboardAdmin /> },
  { path: '/profileadmin', element: <ProfileAdmin /> },
];

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          {privateRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
          ))}
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<AdminRoute>{element}</AdminRoute>} />
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
