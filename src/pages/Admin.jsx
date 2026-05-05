import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AUDIT_KEY = 'pp_audit_log';

const ACTION_STYLES = {
  LOGIN:            'bg-blue-50    text-blue-700',
  LOGOUT:           'bg-indigo-50  text-indigo-600',
  ADD_PORTRAIT:     'bg-teal-50    text-teal-700',
  DELETE_PORTRAIT:  'bg-rose-50    text-rose-700',
  UPDATE_CHILD:     'bg-amber-50   text-amber-700',
  DOWNLOAD_PHOTO:   'bg-purple-50  text-purple-700',
  CONSENT_GRANTED:  'bg-green-50   text-green-700',
  CONSENT_DECLINED: 'bg-orange-50  text-orange-700',
};

function formatTs(iso) {
  return new Date(iso).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

function readLocalJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filterAction, setFilterAction] = useState('');
  const [filterUser,   setFilterUser]   = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [tick, setTick] = useState(0);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center text-center px-6">
        <div>
          <p className="font-black text-indigo-900 text-xl mb-2">Not Authorised</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-rose-500 text-white rounded-2xl px-6 py-3 font-black mt-4 active:scale-95 transition-transform"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const rawLog  = readLocalJson(AUDIT_KEY, []);
  const portraits = readLocalJson('pp_portraits', []);
  const children  = readLocalJson('pp_children', []);

  const todayStr      = new Date().toDateString();
  const loginsToday   = rawLog.filter((e) => e.action === 'LOGIN' && new Date(e.ts).toDateString() === todayStr).length;
  const pendingConsents = portraits.reduce((acc, p) => acc + (p.pendingConsent?.length ?? 0), 0);

  const allActions = [...new Set(rawLog.map((e) => e.action))].sort();
  const allUsers   = [...new Set(rawLog.map((e) => e.userEmail))].sort();

  const log = [...rawLog].reverse().filter((e) => {
    if (filterAction && e.action !== filterAction) return false;
    if (filterUser   && e.userEmail !== filterUser) return false;
    return true;
  });

  function clearLog() {
    localStorage.removeItem(AUDIT_KEY);
    setConfirmClear(false);
    setTick((n) => n + 1);
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-10">

      {/* Header */}
      <div className="bg-white shadow-md shadow-indigo-100 px-5 pt-safe pt-4 pb-5 sticky top-0 z-20 rounded-b-3xl">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div>
            <h1 className="text-xl font-black text-indigo-900 leading-tight">Admin — Audit Trail</h1>
            <p className="text-xs font-extrabold text-violet-500 uppercase tracking-widest mt-0.5">App Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-indigo-400 active:scale-90 transition-transform"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-5">

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Portraits',  value: portraits.length,  color: 'text-teal-600'   },
            { label: 'Active Children',  value: children.length,   color: 'text-indigo-600' },
            { label: 'Logins Today',     value: loginsToday,       color: 'text-rose-600'   },
            { label: 'Pending Consents', value: pendingConsents,   color: 'text-amber-600'  },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-3xl p-5 shadow-md shadow-indigo-100 text-center">
              <p className={`font-black text-3xl ${color}`}>{value}</p>
              <p className="text-xs font-bold text-indigo-400 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-5 shadow-md shadow-indigo-100">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-amber-50 rounded-2xl px-3 py-2 text-indigo-900 font-semibold text-sm outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
              >
                <option value="">All actions</option>
                {allActions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="bg-amber-50 rounded-2xl px-3 py-2 text-indigo-900 font-semibold text-sm outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
              >
                <option value="">All users</option>
                {allUsers.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              {(filterAction || filterUser) && (
                <button
                  onClick={() => { setFilterAction(''); setFilterUser(''); }}
                  className="text-xs font-bold text-indigo-400 underline underline-offset-2"
                >
                  Clear filters
                </button>
              )}
            </div>
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 bg-rose-50 text-rose-500 font-bold text-sm rounded-2xl px-4 py-2 active:scale-95 transition-transform"
            >
              <Trash2 size={14} /> Clear log
            </button>
          </div>
        </div>

        {/* Log entries */}
        {log.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-md shadow-indigo-100">
            <p className="font-black text-indigo-400 text-lg">No log entries</p>
            <p className="text-indigo-300 text-sm mt-1">Actions will appear here as users interact with the app.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {log.map((entry, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm shadow-indigo-100 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${ACTION_STYLES[entry.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {entry.action.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-indigo-900 text-sm">{entry.userEmail}</span>
                    <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest">{entry.role}</span>
                  </div>
                  {entry.detail && (
                    <p className="text-indigo-500 text-xs font-semibold mt-0.5 truncate">{entry.detail}</p>
                  )}
                </div>
                <span className="flex-shrink-0 text-[10px] font-semibold text-indigo-300 mt-0.5 text-right whitespace-nowrap">
                  {formatTs(entry.ts)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm clear */}
      {confirmClear && (
        <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl text-center">
            <h2 className="font-black text-indigo-900 text-lg mb-2">Clear audit log?</h2>
            <p className="text-indigo-400 font-semibold text-sm mb-6">
              All {rawLog.length} entries will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 bg-amber-50 text-indigo-600 font-black rounded-2xl py-3.5 active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={clearLog}
                className="flex-1 bg-rose-500 text-white font-black rounded-2xl py-3.5 shadow-lg shadow-rose-200 active:scale-95 transition-transform"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
