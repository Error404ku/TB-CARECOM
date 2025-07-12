// pages/Login.tsx
import { useAuth } from '../store/AuthContext';

export default function Login() {
  const { login } = useAuth();

  const handleLoginAsAdmin = () => {
    login({ name: 'Admin User', role: 'admin' });
  };

  const handleLoginAsUser = () => {
    login({ name: 'Regular User', role: 'user' });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLoginAsAdmin}>Login as Admin</button>
      <button onClick={handleLoginAsUser}>Login as User</button>
    </div>
  );
}
