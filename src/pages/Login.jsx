import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Camera, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Already logged in — redirect
  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    const ok = login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Incorrect email or password.');
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-rose-500 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-200 mb-5">
            <Camera size={44} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-indigo-900 tracking-tight">Portrait Pals</h1>
          <p className="text-indigo-400 font-semibold mt-1.5 text-base">Friendship, documented.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 text-rose-600 rounded-2xl px-4 py-3 mb-5 font-bold text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold text-base outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold text-base outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-indigo-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white font-black text-lg rounded-2xl py-4 shadow-lg shadow-rose-200 active:scale-95 transition-transform disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo hints */}
        <div className="mt-5 bg-white rounded-2xl p-5 shadow-md shadow-indigo-50 text-sm text-indigo-500 font-semibold space-y-1">
          <p className="font-black text-indigo-700 mb-2">Demo accounts</p>
          <p>admin@school.com / pass123 <span className="text-rose-400 font-bold">Educator</span></p>
          <p>maggie@parent.com / pass123 <span className="text-teal-500 font-bold">Parent</span></p>
          <p>siblings@parent.com / pass123 <span className="text-teal-500 font-bold">Parent</span></p>
        </div>
      </div>
    </div>
  );
}
