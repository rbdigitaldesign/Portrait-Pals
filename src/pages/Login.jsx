import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Educator — admin@school.com', email: 'admin@school.com',    password: 'pass123', role: 'educator' },
  { label: "Parent — Maggie's Family",    email: 'maggie@parent.com',   password: 'pass123', role: 'parent'   },
  { label: 'Parent — Sibling Account',    email: 'siblings@parent.com', password: 'pass123', role: 'parent'   },
];

/* ── Decorative components ──────────────────────────────────────────────── */

function Rainbow() {
  const bands = [
    { color: '#f43f5e', r: 195, w: 26 },
    { color: '#fb923c', r: 168, w: 26 },
    { color: '#fbbf24', r: 141, w: 26 },
    { color: '#4ade80', r: 114, w: 26 },
    { color: '#60a5fa', r: 87,  w: 26 },
    { color: '#c084fc', r: 60,  w: 26 },
  ];
  return (
    <svg viewBox="0 0 380 210" className="w-full" aria-hidden="true" style={{ marginBottom: '-32px' }}>
      {/* Cloud left */}
      <ellipse cx="22" cy="198" rx="26" ry="16" fill="white" opacity="0.95" />
      <ellipse cx="36" cy="190" rx="20" ry="14" fill="white" opacity="0.95" />
      {/* Cloud right */}
      <ellipse cx="358" cy="198" rx="26" ry="16" fill="white" opacity="0.95" />
      <ellipse cx="344" cy="190" rx="20" ry="14" fill="white" opacity="0.95" />
      {/* Rainbow arcs */}
      {bands.map(({ color, r, w }) => (
        <path
          key={r}
          d={`M ${190 - r} 205 A ${r} ${r} 0 0 1 ${190 + r} 205`}
          fill="none"
          stroke={color}
          strokeWidth={w}
          strokeLinecap="round"
        />
      ))}
      {/* Ground cloud to hide arc bases */}
      <ellipse cx="190" cy="208" rx="215" ry="28" fill="white" />
    </svg>
  );
}

function Crayon({ color, accent, rotate = 0, className = '' }) {
  return (
    <svg viewBox="0 0 32 96" className={className} aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
      {/* Shadow */}
      <ellipse cx="16" cy="94" rx="9" ry="3" fill="black" opacity="0.1" />
      {/* Wood tip */}
      <polygon points="8,72 24,72 16,90" fill="#d4a96a" />
      <polygon points="12,78 20,78 16,90" fill="#b8874e" />
      {/* Body */}
      <rect x="8" y="14" width="16" height="60" rx="2" fill={color} />
      {/* Shine stripe */}
      <rect x="11" y="16" width="4" height="56" rx="2" fill="white" opacity="0.18" />
      {/* Label band */}
      <rect x="8" y="28" width="16" height="22" rx="1" fill="white" opacity="0.22" />
      <rect x="8" y="34" width="16" height="1.5" fill="white" opacity="0.3" />
      <rect x="8" y="38" width="16" height="1.5" fill="white" opacity="0.3" />
      {/* Top cap */}
      <rect x="8" y="8" width="16" height="10" rx="2" fill={accent ?? color} />
      <rect x="8" y="6" width="16" height="6" rx="3" fill="white" opacity="0.25" />
      {/* Crimp ring */}
      <rect x="8" y="68" width="16" height="5" fill={accent ?? color} opacity="0.7" />
    </svg>
  );
}

function Sparkle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 1 L13.5 9.5 L22 11 L13.5 12.5 L12 21 L10.5 12.5 L2 11 L10.5 9.5 Z" />
    </svg>
  );
}

function Heart({ className = '' }) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 21 C12 21 1 13.5 1 6.5 C1 3.4 3.4 1 6.5 1 C8.6 1 10.4 2.1 11.5 3.8 C11.7 4.1 12.3 4.1 12.5 3.8 C13.6 2.1 15.4 1 17.5 1 C20.6 1 23 3.4 23 6.5 C23 13.5 12 21 12 21 Z" />
    </svg>
  );
}

const CRAYONS = [
  { color: '#f43f5e', accent: '#be123c', rotate: -18 },
  { color: '#fb923c', accent: '#c2410c', rotate: -8  },
  { color: '#fbbf24', accent: '#b45309', rotate: 2   },
  { color: '#4ade80', accent: '#15803d', rotate: -4  },
  { color: '#60a5fa', accent: '#1d4ed8', rotate: 10  },
  { color: '#c084fc', accent: '#7e22ce', rotate: -12 },
  { color: '#f472b6', accent: '#be185d', rotate: 6   },
];

/* ── Login page ─────────────────────────────────────────────────────────── */

export default function Login() {
  const { user, login } = useAuth();
  const navigate        = useNavigate();
  const [selectedIdx,   setSelectedIdx] = useState('');
  const [loading,       setLoading]     = useState(false);
  const [error,         setError]       = useState('');

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
    if (ok) navigate('/dashboard', { replace: true });
    else setError('Login failed — check the demo data.');
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center overflow-x-hidden pb-10"
      style={{ background: 'linear-gradient(180deg, #bae6fd 0%, #fef9c3 42%, #fffbeb 100%)' }}
    >

      {/* ── Rainbow ── */}
      <div className="w-full relative z-0">
        <Rainbow />
      </div>

      {/* ── Hero title ── */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-2 pb-1 text-center">
        {/* Floating sparkles */}
        <Sparkle className="absolute -left-1 top-1 w-5 h-5 text-yellow-400" />
        <Sparkle className="absolute right-3 top-3 w-4 h-4 text-rose-400" />
        <Sparkle className="absolute left-10 top-10 w-3 h-3 text-violet-400" />
        <Sparkle className="absolute right-8 top-12 w-3 h-3 text-amber-400" />

        <div className="flex items-center gap-3 mb-1">
          <Heart className="w-8 h-8 text-rose-400 drop-shadow-sm" />
          <h1
            className="font-black text-indigo-900 leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 10vw, 3.2rem)', letterSpacing: '-0.02em' }}
          >
            Portrait Pals
          </h1>
          <Heart className="w-8 h-8 text-rose-400 drop-shadow-sm" />
        </div>

        <p className="text-indigo-500 font-bold text-sm mt-2 flex items-center gap-1.5">
          <Sparkle className="w-3.5 h-3.5 text-yellow-400 inline-block" />
          Little friendships, captured forever
          <Sparkle className="w-3.5 h-3.5 text-yellow-400 inline-block" />
        </p>
      </div>

      {/* ── Crayon row ── */}
      <div className="flex items-end justify-center gap-1 mt-4 mb-5 px-2" style={{ height: '88px' }}>
        {CRAYONS.map(({ color, accent, rotate }, i) => (
          <Crayon
            key={i}
            color={color}
            accent={accent}
            rotate={rotate}
            className="w-9 h-full"
          />
        ))}
      </div>

      {/* ── Login card ── */}
      <div className="w-full max-w-sm px-5 z-10">
        <div
          className="bg-white rounded-3xl p-7 relative overflow-hidden"
          style={{
            boxShadow: '0 8px 40px rgba(99,102,241,0.18), 0 2px 8px rgba(99,102,241,0.10)',
            border: '3px solid transparent',
            backgroundClip: 'padding-box',
            outline: '3px solid transparent',
          }}
        >
          {/* Top rainbow line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, #f43f5e, #fb923c, #fbbf24, #4ade80, #60a5fa, #c084fc)' }}
          />

          {/* Corner blooms */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-violet-400" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-10 bg-rose-400" />

          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="text-xl">👋</span>
            <p className="font-extrabold text-indigo-400 text-xs uppercase tracking-widest">
              Who's signing in today?
            </p>
            <span className="text-xl">✨</span>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 rounded-2xl px-4 py-3 mb-4 font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <select
                value={selectedIdx}
                onChange={(e) => { setSelectedIdx(e.target.value); setError(''); }}
                className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold text-base outline-none focus:ring-2 focus:ring-violet-400 appearance-none pr-10"
              >
                <option value="" disabled>Pick your account…</option>
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <option key={acc.email} value={i}>{acc.label}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
            </div>

            {account && (
              <div className={`text-center text-xs font-extrabold uppercase tracking-widest py-2.5 rounded-2xl ${
                account.role === 'educator'
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-teal-50 text-teal-600'
              }`}>
                {account.role === 'educator' ? '🏫 Educator — global access' : '🏡 Parent — your family\'s memories'}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !account}
              className="w-full text-white font-black text-xl rounded-2xl py-4 active:scale-95 transition-transform disabled:opacity-40 tracking-wide"
              style={{
                background: loading || !account
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #f43f5e 0%, #fb923c 50%, #fbbf24 100%)',
                boxShadow: loading || !account ? 'none' : '0 6px 24px rgba(244,63,94,0.38)',
              }}
            >
              {loading ? '✨ Entering…' : "Let's go! 🎉"}
            </button>
          </form>
        </div>

        {/* Footer emoji row */}
        <div className="flex justify-center gap-3 mt-6">
          {['🌈', '📸', '🎨', '💛', '🌟', '👫', '🖍️'].map((emoji) => (
            <span key={emoji} className="text-lg select-none">{emoji}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
