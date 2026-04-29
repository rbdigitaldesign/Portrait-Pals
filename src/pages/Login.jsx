import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Camera, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Educator — admin@school.com',        email: 'admin@school.com',    password: 'pass123', role: 'educator' },
  { label: "Parent — Maggie's Family",            email: 'maggie@parent.com',   password: 'pass123', role: 'parent'   },
  { label: 'Parent — Sibling Account',            email: 'siblings@parent.com', password: 'pass123', role: 'parent'   },
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate        = useNavigate();

  const [selectedIdx, setSelectedIdx] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const account = selectedIdx !== '' ? DEMO_ACCOUNTS[Number(selectedIdx)] : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!account) { setError('Please select an account.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    const ok = login(account.email, account.password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Login failed — check the demo data.');
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
            <div className="bg-rose-50 text-rose-600 rounded-2xl px-4 py-3 mb-5 font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account selector */}
            <div>
              <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
                Select account
              </label>
              <div className="relative">
                <select
                  value={selectedIdx}
                  onChange={(e) => { setSelectedIdx(e.target.value); setError(''); }}
                  className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold text-base outline-none focus:ring-2 focus:ring-rose-400 appearance-none pr-10"
                >
                  <option value="" disabled>Choose a demo account…</option>
                  {DEMO_ACCOUNTS.map((acc, i) => (
                    <option key={acc.email} value={i}>{acc.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Password — pre-filled, read-only */}
            <div>
              <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={account ? account.password : ''}
                readOnly
                placeholder="Select an account above"
                className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold text-base outline-none placeholder:text-indigo-300 cursor-default opacity-70"
              />
            </div>

            {/* Role badge */}
            {account && (
              <div className={`text-center text-xs font-extrabold uppercase tracking-widest py-2 rounded-2xl ${
                account.role === 'educator'
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-teal-50 text-teal-500'
              }`}>
                {account.role === 'educator' ? 'Educator — global access' : 'Parent — scoped access'}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !account}
              className="w-full bg-rose-500 text-white font-black text-lg rounded-2xl py-4 shadow-lg shadow-rose-200 active:scale-95 transition-transform disabled:opacity-40 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
