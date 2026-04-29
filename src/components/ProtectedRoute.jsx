import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireEducator = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requireEducator && user.role !== 'educator') return <Navigate to="/dashboard" replace />;
  return children;
}
