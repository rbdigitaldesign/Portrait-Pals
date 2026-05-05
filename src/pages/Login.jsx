import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { ChevronDown, Lock, ShieldCheck, Sparkles, Trash2, GraduationCap, ShieldAlert, Home, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Educator — admin@school.com',    email: 'admin@school.com',       password: 'pass123',  role: 'educator' },
  { label: "Parent — Maggie's Family",       email: 'maggie@parent.com',      password: 'pass123',  role: 'parent'   },
  { label: 'Parent — Sibling Account',       email: 'siblings@parent.com',    password: 'pass123',  role: 'parent'   },
  { label: 'Parent — Demo (Mia & Noah)',     email: 'demo@parent.com',        password: 'pass123',  role: 'parent'   },
  { label: 'Admin — App Administrator',      email: 'admin@portraitpals.com', password: 'admin2024', role: 'admin'   },
];

/* ── SVG illustration ───────────────────────────────────────────────────── */

function PhotoHero() {
  return (
    <svg viewBox="0 -25 380 255" className="w-full" aria-hidden="true">
      <defs>
        <filter id="pshadow">
          <feDropShadow dx="1" dy="3" stdDeviation="5" floodOpacity="0.18" />
        </filter>
        <filter id="cshadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0369a1" floodOpacity="0.25" />
        </filter>
        {/* Soft rainbow wash behind everything */}
        <radialGradient id="rainbowWash" cx="50%" cy="100%" r="75%">
          <stop offset="0%"   stopColor="#fbbf24" stopOpacity="0.22" />
          <stop offset="35%"  stopColor="#f43f5e" stopOpacity="0.10" />
          <stop offset="65%"  stopColor="#60a5fa" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.05" />
        </radialGradient>
      </defs>


      {/* ── Tiny rainbow arc — subtle, behind camera ── */}
      {[
        { color: '#f43f5e', r: 95, op: 0.18 },
        { color: '#fb923c', r: 80, op: 0.18 },
        { color: '#fbbf24', r: 65, op: 0.18 },
        { color: '#4ade80', r: 50, op: 0.18 },
        { color: '#60a5fa', r: 35, op: 0.18 },
      ].map(({ color, r, op }) => (
        <path key={r} d={`M ${190 - r} 210 A ${r} ${r} 0 0 1 ${190 + r} 210`}
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity={op} />
      ))}

      {/* ── Polaroid — top left ── */}
      <g style={{ animation: 'ppFloat 4s ease-in-out infinite', animationDelay: '0s' }}>
      <g transform="translate(52,42) rotate(-18)" filter="url(#pshadow)">
        <rect x="-34" y="-44" width="68" height="84" rx="4" fill="white" />
        {/* photo area — warm yellow, sun */}
        <rect x="-27" y="-37" width="54" height="50" rx="2" fill="#fef08a" />
        <circle cx="0" cy="-14" r="11" fill="#fbbf24" />
        {[0,45,90,135,180,225,270,315].map(a => (
          <line key={a}
            x1={Math.cos(a*Math.PI/180)*14} y1={-14+Math.sin(a*Math.PI/180)*14}
            x2={Math.cos(a*Math.PI/180)*18} y2={-14+Math.sin(a*Math.PI/180)*18}
            stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {/* bottom strip lines */}
        <rect x="-16" y="18" width="32" height="2.5" rx="1.2" fill="#e5e7eb" />
        <rect x="-10" y="23" width="20" height="2" rx="1" fill="#f3f4f6" />
      </g>
      </g>

      {/* ── Polaroid — top right ── */}
      <g style={{ animation: 'ppFloat 4.5s ease-in-out infinite', animationDelay: '0.7s' }}>
      <g transform="translate(326,36) rotate(16)" filter="url(#pshadow)">
        <rect x="-34" y="-44" width="68" height="84" rx="4" fill="white" />
        {/* photo area — rose, heart */}
        <rect x="-27" y="-37" width="54" height="50" rx="2" fill="#ffe4e6" />
        <path d="M0,-6 C7,-15 17,-15 17,-6 C17,3 0,15 0,15 C0,15 -17,3 -17,-6 C-17,-15 -7,-15 0,-6Z"
          fill="#f43f5e" opacity="0.85" />
        <rect x="-16" y="18" width="32" height="2.5" rx="1.2" fill="#e5e7eb" />
        <rect x="-10" y="23" width="20" height="2" rx="1" fill="#f3f4f6" />
      </g>
      </g>

      {/* ── Polaroid — bottom left ── */}
      <g style={{ animation: 'ppFloat 5s ease-in-out infinite', animationDelay: '1.4s' }}>
      <g transform="translate(46,186) rotate(14)" filter="url(#pshadow)">
        <rect x="-34" y="-44" width="68" height="84" rx="4" fill="white" />
        {/* photo area — teal, star */}
        <rect x="-27" y="-37" width="54" height="50" rx="2" fill="#ccfbf1" />
        <path d="M0,-16 L3,-7 L12,-7 L5,-1 L8,8 L0,2 L-8,8 L-5,-1 L-12,-7 L-3,-7 Z"
          fill="#14b8a6" opacity="0.9" />
        <rect x="-16" y="18" width="32" height="2.5" rx="1.2" fill="#e5e7eb" />
        <rect x="-10" y="23" width="20" height="2" rx="1" fill="#f3f4f6" />
      </g>

      </g>

      {/* ── Polaroid — bottom right ── */}
      <g style={{ animation: 'ppFloat 4.2s ease-in-out infinite', animationDelay: '2.1s' }}>
      <g transform="translate(330,182) rotate(-13)" filter="url(#pshadow)">
        <rect x="-34" y="-44" width="68" height="84" rx="4" fill="white" />
        {/* photo area — violet, flower */}
        <rect x="-27" y="-37" width="54" height="50" rx="2" fill="#ede9fe" />
        {[0,60,120,180,240,300].map(a => (
          <ellipse key={a} cx={Math.cos(a*Math.PI/180)*9} cy={-13+Math.sin(a*Math.PI/180)*9}
            rx="6" ry="5" fill="#a78bfa" opacity="0.75"
            transform={`rotate(${a}, ${Math.cos(a*Math.PI/180)*9}, ${-13+Math.sin(a*Math.PI/180)*9})`} />
        ))}
        <circle cx="0" cy="-13" r="6" fill="#fbbf24" />
        <rect x="-16" y="18" width="32" height="2.5" rx="1.2" fill="#e5e7eb" />
        <rect x="-10" y="23" width="20" height="2" rx="1" fill="#f3f4f6" />
      </g>
      </g>

      {/* ── Camera body ── */}
      <g style={{ animation: 'ppFloatCam 5.5s ease-in-out infinite', animationDelay: '0.3s' }}>
      <g transform="translate(130,72)" filter="url(#cshadow)">
        {/* Body */}
        <rect x="0" y="20" width="120" height="72" rx="13" fill="#0ea5e9" />
        {/* Body top highlight */}
        <rect x="0" y="20" width="120" height="30" rx="13" fill="white" opacity="0.14" />
        {/* Grip texture (left side bump) */}
        <rect x="0" y="30" width="18" height="52" rx="13" fill="#0284c7" />
        {/* Pentaprism hump */}
        <rect x="36" y="9" width="48" height="20" rx="9" fill="#0284c7" />
        <rect x="36" y="9" width="48" height="10" rx="9" fill="white" opacity="0.12" />
        {/* Accessory shoe */}
        <rect x="52" y="6" width="16" height="6" rx="2" fill="#0369a1" />
        {/* Flash */}
        <rect x="22" y="11" width="20" height="13" rx="4" fill="#fbbf24" />
        <rect x="22" y="11" width="20" height="7" rx="3" fill="white" opacity="0.35" />
        {/* Shutter button */}
        <circle cx="96" cy="20" r="7" fill="#f43f5e" />
        <circle cx="96" cy="20" r="4.5" fill="#fb7185" />
        {/* Lens outer barrel */}
        <circle cx="68" cy="58" r="30" fill="#1e293b" />
        <circle cx="68" cy="58" r="26" fill="#334155" />
        {/* Focus ring marks */}
        {[0,45,90,135,180,225,270,315].map(a => (
          <line key={a}
            x1={68+Math.cos(a*Math.PI/180)*23} y1={58+Math.sin(a*Math.PI/180)*23}
            x2={68+Math.cos(a*Math.PI/180)*26} y2={58+Math.sin(a*Math.PI/180)*26}
            stroke="white" strokeWidth="1.2" opacity="0.3" />
        ))}
        {/* Inner elements */}
        <circle cx="68" cy="58" r="20" fill="#0f172a" />
        <circle cx="68" cy="58" r="14" fill="#1e3a5f" />
        <circle cx="68" cy="58" r="8"  fill="#0c4a6e" />
        {/* Lens glare */}
        <ellipse cx="60" cy="50" rx="5" ry="3.5" fill="white" opacity="0.38" transform="rotate(-25,60,50)" />
        <circle  cx="63" cy="47" r="1.8" fill="white" opacity="0.55" />
        {/* Mode dial */}
        <circle cx="108" cy="33" r="10" fill="#0369a1" />
        <circle cx="108" cy="33" r="7"  fill="#0284c7" />
        {[0,60,120,180,240,300].map(a => (
          <line key={a}
            x1={108+Math.cos(a*Math.PI/180)*5} y1={33+Math.sin(a*Math.PI/180)*5}
            x2={108+Math.cos(a*Math.PI/180)*7} y2={33+Math.sin(a*Math.PI/180)*7}
            stroke="white" strokeWidth="1" opacity="0.5" />
        ))}
        {/* Strap lugs */}
        <rect x="-5" y="30" width="8" height="16" rx="3" fill="#0369a1" />
        <rect x="117" y="30" width="8" height="16" rx="3" fill="#0369a1" />
      </g>
      </g>

      {/* ── Flash burst (snap! sparkle) ── */}
      <g transform="translate(152,70)" style={{ animation: 'ppFlash 3s ease-in-out infinite', animationDelay: '1.2s' }}>
        {[0,45,90,135].map(a => (
          <line key={a}
            x1={Math.cos(a*Math.PI/180)*4} y1={Math.sin(a*Math.PI/180)*4}
            x2={Math.cos(a*Math.PI/180)*10} y2={Math.sin(a*Math.PI/180)*10}
            stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#fef9c3" />
      </g>

      {/* ── Scattered sparkles ── */}
      {[
        { x:170, y:20,  c:'#f43f5e', s:7,   delay:'0s'    },
        { x:218, y:15,  c:'#fb923c', s:5,   delay:'0.6s'  },
        { x:155, y:205, c:'#4ade80', s:6,   delay:'1.2s'  },
        { x:222, y:208, c:'#c084fc', s:5,   delay:'1.8s'  },
        { x:136, y:115, c:'#60a5fa', s:4,   delay:'0.3s'  },
        { x:246, y:108, c:'#fbbf24', s:4.5, delay:'0.9s'  },
      ].map(({ x, y, c, s, delay }, i) => (
        <g key={i} transform={`translate(${x},${y})`}
          style={{ animation: 'ppTwinkle 2.5s ease-in-out infinite', animationDelay: delay }}>
          <line x1="0" y1={-s} x2="0" y2={s} stroke={c} strokeWidth="2" strokeLinecap="round" />
          <line x1={-s} y1="0" x2={s} y2="0" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/* ── Crayon ─────────────────────────────────────────────────────────────── */

function Crayon({ color, accent, rotate = 0, className = '' }) {
  return (
    <svg viewBox="0 0 32 96" className={className} aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
      <ellipse cx="16" cy="94" rx="9" ry="3" fill="black" opacity="0.08" />
      <polygon points="8,72 24,72 16,90" fill="#d4a96a" />
      <polygon points="12,78 20,78 16,90" fill="#b8874e" />
      <rect x="8" y="14" width="16" height="60" rx="2" fill={color} />
      <rect x="11" y="16" width="4" height="56" rx="2" fill="white" opacity="0.18" />
      <rect x="8" y="28" width="16" height="22" rx="1" fill="white" opacity="0.22" />
      <rect x="8" y="34" width="16" height="1.5" fill="white" opacity="0.3" />
      <rect x="8" y="38" width="16" height="1.5" fill="white" opacity="0.3" />
      <rect x="8" y="8"  width="16" height="10" rx="2" fill={accent ?? color} />
      <rect x="8" y="6"  width="16" height="6"  rx="3" fill="white" opacity="0.25" />
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
  { color: '#fbbf24', accent: '#b45309', rotate:  2  },
  { color: '#4ade80', accent: '#15803d', rotate: -4  },
  { color: '#60a5fa', accent: '#1d4ed8', rotate: 10  },
  { color: '#c084fc', accent: '#7e22ce', rotate: -12 },
  { color: '#f472b6', accent: '#be185d', rotate:  6  },
];

/* ── Login page ─────────────────────────────────────────────────────────── */

export default function Login() {
  const { user, login } = useAuth();
  const navigate        = useNavigate();
  const [selectedIdx,   setSelectedIdx] = useState('');
  const [loading,       setLoading]     = useState(false);
  const [error,         setError]       = useState('');

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  const account = selectedIdx !== '' ? DEMO_ACCOUNTS[Number(selectedIdx)] : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!account) { setError('Please select an account.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    const result = login(account.email, account.password);
    setLoading(false);
    if (result.ok) navigate(result.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    else setError('Login failed — check the demo data.');
  }

  return (
    <>
    <style>{`
      @keyframes ppFloat    { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-6px)} }
      @keyframes ppFloatCam { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-4px)} }
      @keyframes ppTwinkle  { 0%,100%{opacity:.65;transform:scale(1)}  50%{opacity:1;transform:scale(1.35)} }
      @keyframes ppFlash    { 0%,70%,100%{opacity:.75;transform:scale(1)} 35%{opacity:1;transform:scale(1.25)} }
      @keyframes ppHeart    { 0%,100%{transform:scale(1)} 15%{transform:scale(1.2)} 30%{transform:scale(1)} 50%{transform:scale(1.1)} }
      @keyframes ppSway     { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(3deg)} 70%{transform:rotate(-3deg)} }
      @keyframes ppSparkle  { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.4) rotate(20deg)} }
    `}</style>
    <div
      className="min-h-screen flex flex-col items-center overflow-x-hidden pb-10"
      style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #fef9c3 45%, #fffbeb 100%)' }}
    >

      {/* ── Hero illustration ── */}
      <div className="w-full max-w-sm px-2 pt-4">
        <PhotoHero />
      </div>

      {/* ── Title ── */}
      <div className="relative flex flex-col items-center px-5 pb-1 text-center -mt-2">
        <Sparkle className="absolute -left-1 top-0 w-5 h-5 text-yellow-400" style={{ animation: 'ppSparkle 3s ease-in-out infinite', animationDelay: '0s' }} />
        <Sparkle className="absolute right-3 top-2 w-4 h-4 text-rose-400"  style={{ animation: 'ppSparkle 3s ease-in-out infinite', animationDelay: '1.5s' }} />

        <div className="flex items-center gap-3 mb-1">
          <Heart className="w-7 h-7 text-rose-400 drop-shadow-sm" style={{ animation: 'ppHeart 2.5s ease-in-out infinite', animationDelay: '0s' }} />
          <h1
            className="font-black text-indigo-900 leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 9vw, 3rem)' }}
          >
            Portrait Pals
          </h1>
          <Heart className="w-7 h-7 text-rose-400 drop-shadow-sm" style={{ animation: 'ppHeart 2.5s ease-in-out infinite', animationDelay: '0.4s' }} />
        </div>

        <p className="text-indigo-500 font-bold text-sm mt-1.5 flex items-center gap-1.5">
          <Sparkle className="w-3 h-3 text-yellow-400 inline-block" style={{ animation: 'ppSparkle 2.8s ease-in-out infinite', animationDelay: '0.8s' }} />
          Little friendships, captured forever
          <Sparkle className="w-3 h-3 text-yellow-400 inline-block" style={{ animation: 'ppSparkle 2.8s ease-in-out infinite', animationDelay: '2.2s' }} />
        </p>
        <p className="text-indigo-400 text-xs font-semibold mt-2.5 max-w-[260px] text-center leading-relaxed">
          A private, family-controlled alternative to sharing children's photos on social media.
        </p>
      </div>

      {/* ── Crayon row ── */}
      <div className="flex items-end justify-center gap-1 mt-5 mb-5 px-2" style={{ height: '82px' }}>
        {CRAYONS.map(({ color, accent, rotate }, i) => (
          <div key={i} style={{
            animation: 'ppSway 3s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
            transformOrigin: 'bottom center',
            height: '100%',
          }}>
            <Crayon color={color} accent={accent} rotate={rotate} className="w-9 h-full" />
          </div>
        ))}
      </div>

      {/* ── Login card ── */}
      <div className="w-full max-w-sm px-5 z-10">
        <div
          className="bg-white rounded-3xl p-7 relative overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(99,102,241,0.18), 0 2px 8px rgba(99,102,241,0.10)' }}
        >
          {/* Rainbow top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, #f43f5e, #fb923c, #fbbf24, #4ade80, #60a5fa, #c084fc)' }}
          />
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
                account.role === 'educator' ? 'bg-rose-50 text-rose-500' :
                account.role === 'admin'    ? 'bg-violet-50 text-violet-600' :
                                             'bg-teal-50 text-teal-600'
              }`}>
                <span className="flex items-center justify-center gap-1.5">
                  {account.role === 'educator' ? <><GraduationCap size={13} /> Educator — global access</> :
                   account.role === 'admin'    ? <><ShieldAlert size={13} /> Administrator — audit access</> :
                                                <><Home size={13} /> Parent — your family's memories</>}
                </span>
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
              {loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Entering…</span>
                : <span className="flex items-center justify-center gap-2">Let's go! <ArrowRight size={18} /></span>}
            </button>
          </form>
        </div>

        {/* Trust badges */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-3xl p-4 border border-white">
          <p className="text-center text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-3">
            Built for families. Built responsibly.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: <Lock size={16} strokeWidth={2.5} />,
                iconBg: 'bg-teal-100', iconColor: 'text-teal-600',
                cardBg: 'bg-teal-50',
                label: 'Private by default',
                sub: "Only linked accounts can see your child's photos",
              },
              {
                icon: <ShieldCheck size={16} strokeWidth={2.5} />,
                iconBg: 'bg-rose-100', iconColor: 'text-rose-500',
                cardBg: 'bg-rose-50',
                label: 'Never sold',
                sub: 'Your data is never sold or shared with third parties',
              },
              {
                icon: <Sparkles size={16} strokeWidth={2.5} />,
                iconBg: 'bg-violet-100', iconColor: 'text-violet-600',
                cardBg: 'bg-violet-50',
                label: 'No AI training',
                sub: 'Photos are never used to train AI models',
              },
              {
                icon: <Trash2 size={16} strokeWidth={2.5} />,
                iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
                cardBg: 'bg-amber-50',
                label: 'Delete anytime',
                sub: 'Request full removal of your data at any time',
              },
            ].map(({ icon, iconBg, iconColor, cardBg, label, sub }) => (
              <div key={label} className={`${cardBg} rounded-2xl p-3 flex gap-2.5 items-start`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
                  {icon}
                </div>
                <div>
                  <p className="font-black text-indigo-900 text-xs leading-tight">{label}</p>
                  <p className="text-indigo-400 text-[10px] font-semibold mt-0.5 leading-snug">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy links */}
        <div className="flex justify-center items-center gap-4 mt-4 pb-6">
          <Link to="/privacy" className="text-xs font-bold text-indigo-400 underline underline-offset-2 hover:text-indigo-600">
            Privacy Policy
          </Link>
          <span className="text-indigo-200">·</span>
          <Link to="/terms" className="text-xs font-bold text-indigo-400 underline underline-offset-2 hover:text-indigo-600">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
