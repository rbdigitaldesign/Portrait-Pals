import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Download, Mail, Clock, RotateCcw, ArrowRight, DoorOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { ROOMS } from '../data/seed';

const AUDIT_KEY = 'pp_audit_log';

const ACTION_STYLES = {
  LOGIN:               'bg-blue-50    text-blue-700',
  LOGOUT:              'bg-indigo-50  text-indigo-600',
  ADD_PORTRAIT:        'bg-teal-50    text-teal-700',
  DELETE_PORTRAIT:     'bg-rose-50    text-rose-700',
  UPDATE_CHILD:        'bg-amber-50   text-amber-700',
  ROOM_CHANGED:        'bg-sky-50     text-sky-700',
  DOWNLOAD_PHOTO:      'bg-purple-50  text-purple-700',
  CONSENT_GRANTED:     'bg-green-50   text-green-700',
  CONSENT_DECLINED:    'bg-orange-50  text-orange-700',
  PORTRAIT_REINSTATED: 'bg-violet-50  text-violet-700',
};

const CONSENT_STATUS_STYLE = {
  pending:  { pill: 'bg-amber-100 text-amber-700', label: 'Pending photo approval' },
  unlinked: { pill: 'bg-indigo-100 text-indigo-600', label: 'Family not linked'   },
};

function formatTs(iso) {
  return new Date(iso).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function readLocalJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function downloadCSV(rawLog) {
  const headers = ['Timestamp', 'User Email', 'Role', 'Action', 'Detail'];
  const rows = rawLog.map((e) => [
    e.ts,
    e.userEmail ?? '',
    e.role      ?? '',
    e.action    ?? '',
    e.detail    ?? '',
  ]);
  const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `portrait-pals-audit-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Pending Consent Panel ───────────────────────────────────────────── */

function PendingConsentPanel({ children, portraits }) {
  // Children whose overall consent hasn't been given yet
  const pendingChildren = children.filter(
    (c) => c.consentStatus === 'pending' || c.consentStatus === 'unlinked'
  );

  // Portraits that are in a per-photo consent queue (tagged child hasn't approved yet)
  const pendingPortraitRows = portraits
    .filter((p) => (p.pendingConsent?.length ?? 0) > 0)
    .flatMap((p) =>
      p.pendingConsent.map((childId) => {
        const child = children.find((c) => c.id === childId);
        return child ? { portrait: p, child } : null;
      }).filter(Boolean)
    );

  const totalPending = pendingChildren.length + pendingPortraitRows.length;

  return (
    <div className="bg-white rounded-3xl shadow-md shadow-indigo-100 overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-amber-100 flex items-center justify-between">
        <div>
          <h2 className="font-black text-indigo-900 text-base">Consent Status</h2>
          <p className="text-xs font-semibold text-indigo-400 mt-0.5">
            Families who haven't yet approved photo sharing
          </p>
        </div>
        {totalPending > 0 && (
          <span className="bg-amber-500 text-white font-black text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
            {totalPending}
          </span>
        )}
      </div>

      {/* Overall consent — children whose family hasn't signed up yet */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Clock size={10} /> Awaiting family account / consent
        </p>
        {pendingChildren.length === 0 ? (
          <p className="text-sm font-semibold text-indigo-300 pb-3">All families have provided consent ✓</p>
        ) : (
          <div className="space-y-2 mb-2">
            {pendingChildren.map((child) => {
              const style = CONSENT_STATUS_STYLE[child.consentStatus] ?? CONSENT_STATUS_STYLE.pending;
              return (
                <div key={child.id} className="flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 font-black text-indigo-400 text-sm">
                    {child.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-indigo-900 text-sm">{child.name}</p>
                    <p className="text-xs font-semibold text-indigo-400 truncate">{child.roomId ?? 'No room assigned'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${style.pill}`}>
                      {style.label}
                    </span>
                    {child.parentEmail ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400">
                        <Mail size={9} />{child.parentEmail}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-rose-400">No parent email on file</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Per-photo consent queue */}
      <div className="px-5 pt-2 pb-5">
        <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Clock size={10} /> Photos awaiting family approval
        </p>
        {pendingPortraitRows.length === 0 ? (
          <p className="text-sm font-semibold text-indigo-300">No photos waiting for approval ✓</p>
        ) : (
          <div className="space-y-2">
            {pendingPortraitRows.map(({ portrait, child }, i) => (
              <div key={i} className="flex items-center gap-3 bg-rose-50 rounded-2xl px-4 py-3">
                {portrait.photoUrl && (
                  <img
                    src={portrait.photoUrl}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-indigo-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-indigo-900 text-sm">
                    {child.name}
                    <span className="font-semibold text-indigo-400 text-xs ml-1.5">tagged in photo</span>
                  </p>
                  <p className="text-xs font-semibold text-indigo-400">{formatDateShort(portrait.date)}{portrait.notes ? ` · ${portrait.notes}` : ''}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                    Awaiting approval
                  </span>
                  {child.parentEmail && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400">
                      <Mail size={9} />{child.parentEmail}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Declined Photos Panel ───────────────────────────────────────────── */

function downloadPhoto(photoUrl, portraitId) {
  const a = document.createElement('a');
  a.href = photoUrl;
  a.download = `portrait-pals-${portraitId}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function DeclinedPhotosPanel({ portraits, children, onReinstate }) {
  const declined = portraits.filter((p) => (p.declinedBy?.length ?? 0) > 0);

  return (
    <div className="bg-white rounded-3xl shadow-md shadow-indigo-100 overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-rose-100 flex items-center justify-between">
        <div>
          <h2 className="font-black text-indigo-900 text-base">Declined Photos</h2>
          <p className="text-xs font-semibold text-indigo-400 mt-0.5">
            Photos removed from timelines — reinstate after discussion with families
          </p>
        </div>
        {declined.length > 0 && (
          <span className="bg-rose-500 text-white font-black text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
            {declined.length}
          </span>
        )}
      </div>

      {declined.length === 0 ? (
        <p className="text-sm font-semibold text-indigo-300 px-5 py-5">No declined photos ✓</p>
      ) : (
        <div className="divide-y divide-rose-50">
          {declined.map((portrait) => {
            const tagged = (portrait.taggedIds ?? [])
              .map((id) => children.find((c) => c.id === id))
              .filter(Boolean);
            const decliners = (portrait.declinedBy ?? [])
              .map((id) => children.find((c) => c.id === id))
              .filter(Boolean);

            return (
              <div key={portrait.id} className="flex items-start gap-4 px-5 py-4">
                {portrait.photoUrl && (
                  <img
                    src={portrait.photoUrl}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-indigo-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-indigo-900 text-sm leading-tight">
                    {tagged.map((c) => c.name).join(' & ') || 'Unknown children'}
                  </p>
                  <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                    {formatDateShort(portrait.date)}{portrait.notes ? ` · ${portrait.notes}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {decliners.map((c) => (
                      <span key={c.id} className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Declined by {c.name}'s family
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {portrait.photoUrl && (
                      <button
                        onClick={() => downloadPhoto(portrait.photoUrl, portrait.id)}
                        className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl px-3 py-2 active:scale-95 transition-transform"
                      >
                        <Download size={12} /> Download
                      </button>
                    )}
                    <button
                      onClick={() => onReinstate(portrait.id)}
                      className="flex items-center gap-1.5 bg-teal-50 text-teal-600 font-bold text-xs rounded-xl px-3 py-2 active:scale-95 transition-transform"
                    >
                      <RotateCcw size={12} /> Reinstate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Room Changes Panel ─────────────────────────────────────────────── */

function roomLabel(id) {
  return ROOMS.find((r) => r.id === id)?.label ?? id;
}

function RoomChangesPanel({ rawLog }) {
  const changes = rawLog
    .filter((e) => e.action === 'ROOM_CHANGED')
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));

  return (
    <div className="bg-white rounded-3xl shadow-md shadow-indigo-100 overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-sky-100 flex items-center justify-between">
        <div>
          <h2 className="font-black text-indigo-900 text-base flex items-center gap-2">
            <DoorOpen size={16} className="text-sky-500" /> Room Changes
          </h2>
          <p className="text-xs font-semibold text-indigo-400 mt-0.5">
            Children who have moved rooms, with dates
          </p>
        </div>
        {changes.length > 0 && (
          <span className="bg-sky-500 text-white font-black text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
            {changes.length}
          </span>
        )}
      </div>

      {changes.length === 0 ? (
        <p className="text-sm font-semibold text-indigo-300 px-5 py-5">No room changes recorded yet</p>
      ) : (
        <div className="divide-y divide-sky-50">
          {changes.map((entry, i) => {
            // Detail format: "Child Name: from-room-id → to-room-id"
            const colonIdx = entry.detail.indexOf(': ');
            const childName = colonIdx > -1 ? entry.detail.slice(0, colonIdx) : entry.detail;
            const roomPart  = colonIdx > -1 ? entry.detail.slice(colonIdx + 2) : '';
            const [fromId, toId] = roomPart.split(' → ');
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <DoorOpen size={16} className="text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-indigo-900 text-sm">{childName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="bg-indigo-100 text-indigo-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {roomLabel(fromId)}
                    </span>
                    <ArrowRight size={11} className="text-indigo-300 flex-shrink-0" />
                    <span className="bg-sky-100 text-sky-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {roomLabel(toId)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-semibold text-indigo-300">
                    {new Date(entry.ts).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] font-semibold text-indigo-200 mt-0.5">
                    {new Date(entry.ts).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Admin page ──────────────────────────────────────────────────────── */

export default function Admin() {
  const { user, logout } = useAuth();
  const { reinstatePortrait } = useApp();
  const navigate = useNavigate();
  const [filterAction, setFilterAction] = useState('');
  const [filterUser,   setFilterUser]   = useState('');

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

  const rawLog    = readLocalJson(AUDIT_KEY, []);
  const portraits = readLocalJson('pp_portraits', []);
  const children  = readLocalJson('pp_children', []);

  const todayStr    = new Date().toDateString();
  const loginsToday = rawLog.filter((e) => e.action === 'LOGIN' && new Date(e.ts).toDateString() === todayStr).length;
  const pendingConsentCount =
    children.filter((c) => c.consentStatus === 'pending' || c.consentStatus === 'unlinked').length +
    portraits.reduce((acc, p) => acc + (p.pendingConsent?.length ?? 0), 0);

  const allActions = [...new Set(rawLog.map((e) => e.action))].sort();
  const allUsers   = [...new Set(rawLog.map((e) => e.userEmail))].sort();

  const log = [...rawLog].reverse().filter((e) => {
    if (filterAction && e.action !== filterAction) return false;
    if (filterUser   && e.userEmail !== filterUser) return false;
    return true;
  });

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
            { label: 'Total Portraits',   value: portraits.length,      color: 'text-teal-600'   },
            { label: 'Active Children',   value: children.length,       color: 'text-indigo-600' },
            { label: 'Logins Today',      value: loginsToday,           color: 'text-rose-600'   },
            { label: 'Pending Consents',  value: pendingConsentCount,   color: 'text-amber-600'  },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-3xl p-5 shadow-md shadow-indigo-100 text-center">
              <p className={`font-black text-3xl ${color}`}>{value}</p>
              <p className="text-xs font-bold text-indigo-400 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Pending consent detail */}
        <PendingConsentPanel children={children} portraits={portraits} />

        {/* Declined photos */}
        <DeclinedPhotosPanel
          portraits={portraits}
          children={children}
          onReinstate={reinstatePortrait}
        />

        {/* Room change history */}
        <RoomChangesPanel rawLog={rawLog} />

        {/* Filters + CSV download */}
        <div className="bg-white rounded-3xl p-5 shadow-md shadow-indigo-100">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 flex-wrap items-center">
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
              onClick={() => downloadCSV(rawLog)}
              disabled={rawLog.length === 0}
              className="flex items-center gap-1.5 bg-violet-50 text-violet-600 font-bold text-sm rounded-2xl px-4 py-2 active:scale-95 transition-transform disabled:opacity-40"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Log entries */}
        {log.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-md shadow-indigo-100">
            <p className="font-black text-indigo-400 text-lg">No log entries yet</p>
            <p className="text-indigo-300 text-sm mt-1">Actions will appear here as users interact with the app.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {log.map((entry, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm shadow-indigo-100 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${ACTION_STYLES[entry.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {entry.action.replace(/_/g, ' ')}
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
    </div>
  );
}
