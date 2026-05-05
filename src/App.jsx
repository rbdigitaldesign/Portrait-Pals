import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Capture   from './pages/Capture';
import Slideshow from './pages/Slideshow';
import Privacy   from './pages/Privacy';
import Terms     from './pages/Terms';
import Admin     from './pages/Admin';
import Join      from './pages/Join';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/login"   element={<Login />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms"   element={<Terms />} />
          <Route path="/join"    element={<Join />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/capture" element={
            <ProtectedRoute><Capture /></ProtectedRoute>
          } />
          <Route path="/slideshow" element={
            <ProtectedRoute><Slideshow /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><Admin /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}
