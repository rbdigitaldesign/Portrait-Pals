import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Plus, X, Users, Play, Pencil, Trash2, Shield, Bell, Clock, Check, ArrowRight, GraduationCap, Cake, MapPin, Star, PartyPopper, Home, Sun, Heart, Frame, Users2, CheckCircle, ArrowDown, Sparkles, Smile, Info } from 'lucide-react';

const EVENT_TAG_ICONS = { Cake, MapPin, Star, PartyPopper, Home };
function EventTagIcon({ tag, size = 10, className = '' }) {
  const Icon = EVENT_TAG_ICONS[tag?.icon];
  return Icon ? <Icon size={size} className={className} /> : null;
}

function sourceLabel(portrait, childrenList) {
  if (portrait.source === 'parent') return 'Family Snap';
  const firstChild = portrait.taggedIds.map((id) => childrenList.find((c) => c.id === id)).filter(Boolean)[0];
  return ROOMS.find((r) => r.id === firstChild?.roomId)?.name ?? 'School';
}

const CAPTURE_TIPS = [
  { id: 'side-by-side', icon: 'Users',        headline: 'Side by side',            description: 'Position children shoulder-to-shoulder so both faces are clearly visible in the frame.' },
  { id: 'eye-level',    icon: 'ArrowDown',     headline: 'Get down to their level', description: 'Crouch so the camera is at eye height — it transforms a snapshot into a real connection.' },
  { id: 'lighting',     icon: 'Sun',           headline: 'Chase the light',         description: 'Face children toward a window or outdoor light source to avoid harsh shadows across their faces.' },
  { id: 'candid',       icon: 'Sparkles',      headline: 'Capture the candid',      description: 'Wait a beat after the posed smile fades — genuine laughs make the most memorable portraits.' },
  { id: 'connection',   icon: 'Heart',         headline: 'Show the connection',     description: 'A hand on a shoulder or a shared look tells a richer story than posed faces alone.' },
  { id: 'distance',     icon: 'Shield',        headline: 'Respectful distance',     description: 'Use zoom rather than crowding children — they\'re more natural when you\'re not too close.' },
  { id: 'background',   icon: 'Frame',         headline: 'Clean the background',    description: 'A simple background keeps families\' attention on the children, not the surroundings.' },
  { id: 'smile',        icon: 'Smile',         headline: 'Big smiles on cue',       description: 'Ask for their "special smile" — then snap the moment right after they start giggling.' },
  { id: 'group',        icon: 'Users2',        headline: 'Small groups are best',   description: 'Two or three children creates intimacy. Larger groups are harder to keep in focus.' },
  { id: 'consent',      icon: 'CheckCircle',   headline: 'Consent first, always',   description: 'Check the coloured dots before saving — teal means approved, amber means pending.' },
];
const TIP_ICONS = { Users, Users2, Sun, Heart, Frame, Smile, Shield, CheckCircle, ArrowDown, Sparkles, Camera };
import { useAuth } from '../contexts/AuthContext';
import { useApp, calcRoomForAge } from '../contexts/AppContext';
import { EVENT_TAGS, ROOMS } from '../data/seed';

/* ─── helpers ─────────────────────────────────────────────────────────── */

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatDateShort(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function ageAtDate(birthdate, portraitDate) {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  const photo = new Date(portraitDate);
  let years  = photo.getFullYear() - birth.getFullYear();
  let months = photo.getMonth()    - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years < 0)  return null;
  if (years === 0) return `${months}m`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}m`;
}

function ageAtDateLong(birthdate, portraitDate) {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  const photo = new Date(portraitDate);
  let years  = photo.getFullYear() - birth.getFullYear();
  let months = photo.getMonth()    - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years < 0)  return null;
  const y = years  > 0 ? `${years} ${years  === 1 ? 'year'  : 'years'}` : '';
  const m = months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '';
  return [y, m].filter(Boolean).join(' and ') || null;
}

function compressProfilePhoto(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 400;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio); h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = url;
  });
}

function useLongPress(onLongPress, delay = 1800) {
  const timer   = useRef(null);
  const fired   = useRef(false);
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef  = useRef(null);
  const startTs = useRef(null);

  function tick() {
    const elapsed = Date.now() - startTs.current;
    const pct = Math.min(elapsed / delay, 1);
    setProgress(pct);
    if (pct < 1) rafRef.current = requestAnimationFrame(tick);
  }

  function start() {
    fired.current = false;
    setPressing(true);
    setProgress(0);
    startTs.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
    timer.current = setTimeout(() => {
      fired.current = true;
      setPressing(false);
      setProgress(0);
      onLongPress();
    }, delay);
  }

  function cancel() {
    clearTimeout(timer.current);
    cancelAnimationFrame(rafRef.current);
    setPressing(false);
    setProgress(0);
  }

  useEffect(() => () => { clearTimeout(timer.current); cancelAnimationFrame(rafRef.current); }, []);

  return {
    pressing,
    progress,
    onMouseDown:  start,
    onMouseUp:    cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd:   cancel,
    onTouchMove:  cancel,
    onClick: (e) => { if (fired.current) { e.stopPropagation(); e.preventDefault(); } },
  };
}

const FUN_TITLES = [
  'A little moment ✨',
  'Just us! 💕',
  'Golden times 🌟',
  'One of those days 🌈',
  'Pure joy 🎉',
  'A beautiful memory 🌸',
  'Tiny adventures 🦋',
  'Sweet moments 🍀',
  'Together time 💛',
  'A day to remember 📸',
  'Full hearts 💖',
  'Making memories 🎨',
];

function funTitle(portrait) {
  const seed = portrait.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FUN_TITLES[seed % FUN_TITLES.length];
}

// unlinked is treated same as pending (amber) — both mean "family not yet confirmed"
const CONSENT_DOT = {
  approved: 'bg-teal-400',
  pending:  'bg-amber-400',
  declined: 'bg-rose-500',
  unlinked: 'bg-amber-400',
};

const CONSENT_LABEL = {
  approved: 'Photos approved',
  pending:  'Pending photo approval',
  declined: 'Photos declined',
  unlinked: 'Pending photo approval',
};

/* ═══════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl text-center">
        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-rose-500" />
        </div>
        <h2 className="font-black text-indigo-900 text-lg mb-1">Delete memory?</h2>
        <p className="text-indigo-400 font-semibold text-sm mb-6">This can't be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-amber-50 text-indigo-600 font-black rounded-2xl py-3.5 active:scale-95 transition-transform">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-rose-500 text-white font-black rounded-2xl py-3.5 shadow-lg shadow-rose-200 active:scale-95 transition-transform">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ChildPill (parent timeline switcher) ────────────────────────────── */

function ChildPill({ child, active, onClick, onLongPress }) {
  const lp = useLongPress(onLongPress ?? (() => {}), 600);
  return (
    <button
      {...lp}
      onClick={(e) => { lp.onClick(e); if (!e.defaultPrevented) onClick?.(); }}
      onContextMenu={(e) => e.preventDefault()}
      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 select-none ${
        active ? 'bg-teal-500 text-white shadow-md' : 'bg-amber-50 text-indigo-600'
      }`}
    >
      {child.name}
      <Pencil size={10} className={active ? 'text-white/50' : 'text-indigo-300'} />
    </button>
  );
}

/* ─── ChildChip (educator grid chip) ─────────────────────────────────── */

function ChildChip({ child, active, onClick, onLongPress }) {
  const lp = useLongPress(onLongPress ?? (() => {}), 600);
  const status = child.consentStatus ?? 'approved';
  const dot    = CONSENT_DOT[status] ?? 'bg-amber-400';
  const label  = CONSENT_LABEL[status] ?? 'Awaiting family';
  return (
    <button
      {...lp}
      onClick={(e) => { lp.onClick(e); if (!e.defaultPrevented) onClick?.(); }}
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 select-none"
    >
      <div className="relative">
        <div
          className={`w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-white font-black text-base shadow-md transition-all ${
            active
              ? 'bg-rose-500 ring-4 ring-offset-2 ring-offset-amber-50 ring-rose-300'
              : 'bg-indigo-200'
          }`}
        >
          {child.photoUrl
            ? <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
            : initials(child.name)}
        </div>
        {/* Pencil badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center">
          <Pencil size={9} className="text-indigo-400" />
        </div>
        {/* Consent dot */}
        <div className={`absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full border-2 border-white ${dot}`} title={label} />
      </div>
      <span className="text-xs font-bold text-indigo-700 w-16 text-center leading-tight">
        {child.name}
      </span>
    </button>
  );
}

/* ─── EditChildModal ────────────────────────────────────────────────────── */

function EditChildModal({ child, rooms, onClose, onSave, userRole }) {
  const [name,         setName]         = useState(child.name);
  const [birthdate,    setBirthdate]    = useState(child.birthdate ?? '');
  const [photoUrl,     setPhotoUrl]     = useState(child.photoUrl  ?? '');
  const [preview,      setPreview]      = useState(child.photoUrl  ?? null);
  const [uploading,    setUploading]    = useState(false);
  const [autoApprove,  setAutoApprove]  = useState(child.autoApproveTagging ?? false);
  const fileRef = useRef(null);

  const photoLockedByParent = userRole === 'educator' && child.photoSource === 'parent' && !!child.photoUrl;

  async function handlePhotoFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const compressed = await compressProfilePhoto(file);
    setPhotoUrl(compressed);
    setPreview(compressed);
    setUploading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const updates = {
      name:               trimmed,
      birthdate:          birthdate || undefined,
      photoUrl:           photoUrl  || undefined,
      autoApproveTagging: autoApprove,
    };
    if (photoUrl && photoUrl !== child.photoUrl) {
      updates.photoSource = userRole === 'parent' ? 'parent' : 'educator';
    }
    onSave(updates);
  }

  return (
    <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-4 pb-6">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-xl text-indigo-900">Edit Profile</h2>
          <button onClick={onClose} className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-indigo-400">
            <X size={18} />
          </button>
        </div>

        {/* Photo section */}
        <div className="flex flex-col items-center mb-5">
          {photoLockedByParent ? (
            <>
              <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-100 ring-4 ring-indigo-100">
                <img src={child.photoUrl} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-3 bg-amber-50 rounded-2xl px-4 py-2.5 text-center max-w-[240px]">
                <p className="text-xs font-bold text-amber-600 flex items-center justify-center gap-1"><Camera size={12} /> Photo set by parent</p>
                <p className="text-[11px] text-indigo-400 font-semibold mt-0.5">
                  The family has chosen this profile picture.
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden bg-indigo-100 ring-4 ring-indigo-100 active:scale-95 transition-transform"
              >
                {preview
                  ? <img src={preview} alt={name} className="w-full h-full object-cover" />
                  : <span className="font-black text-2xl text-indigo-300">{initials(name)}</span>}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <Pencil size={18} className="text-white" />
                </div>
              </button>
              <p className="text-xs text-indigo-400 font-semibold mt-2">
                {uploading ? 'Uploading…' : 'Tap to change photo'}
              </p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFile} />
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
              Date of birth <span className="normal-case font-semibold">(optional)</span>
            </label>
            <input
              type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Auto-approve toggle — parent only */}
          {userRole === 'parent' && (
            <div className="flex items-center justify-between bg-amber-50 rounded-2xl px-4 py-3.5 gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-indigo-900 text-sm">Auto-approve shared photos</p>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5 leading-snug">
                  Photos tagged by other families appear without manual approval
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoApprove((v) => !v)}
                className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors ${autoApprove ? 'bg-teal-500' : 'bg-indigo-200'}`}
                aria-label="Toggle auto-approve"
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${autoApprove ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-rose-500 text-white font-black text-base rounded-2xl py-4 shadow-lg shadow-rose-200 active:scale-95 transition-transform mt-2"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── AddChildModal ─────────────────────────────────────────────────────── */

function AddChildModal({ rooms, onClose, onAdd, hideRoom = false, userRole = 'educator' }) {
  const [name,      setName]      = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [roomId,    setRoomId]    = useState(rooms[0]?.id ?? '');
  const [photoUrl,  setPhotoUrl]  = useState('');
  const [preview,   setPreview]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handlePhotoFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const compressed = await compressProfilePhoto(file);
    setPhotoUrl(compressed);
    setPreview(compressed);
    setUploading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({
      id:          `c${Date.now()}`,
      name:        trimmed,
      birthdate:   birthdate  || undefined,
      photoUrl:    photoUrl   || undefined,
      photoSource: photoUrl   ? userRole : undefined,
      roomId:      hideRoom   ? undefined : roomId,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-4 pb-6">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-xl text-indigo-900">Add Child</h2>
          <button onClick={onClose} className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-indigo-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden bg-indigo-100 ring-4 ring-indigo-100 active:scale-95 transition-transform"
          >
            {preview
              ? <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Plus size={24} className="text-indigo-300" /></div>}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
              <Pencil size={18} className="text-white" />
            </div>
          </button>
          <p className="text-xs text-indigo-400 font-semibold mt-2">
            {uploading ? 'Uploading…' : 'Tap to add photo (optional)'}
          </p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFile} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">First name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Child's first name" required
              className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-indigo-300"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
              Date of birth <span className="normal-case font-semibold">(optional)</span>
            </label>
            <input
              type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          {!hideRoom && (
            <div>
              <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">Room</label>
              <select
                value={roomId} onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold outline-none focus:ring-2 focus:ring-rose-400 appearance-none"
              >
                {rooms.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
              </select>
            </div>
          )}
          <button type="submit" className="w-full bg-rose-500 text-white font-black text-base rounded-2xl py-4 shadow-lg shadow-rose-200 active:scale-95 transition-transform mt-2">
            Add Child
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Event tag filter strip ─────────────────────────────────────────────── */

function EventTagFilter({ selected, onSelect, exclude = [] }) {
  const tags = EVENT_TAGS.filter((t) => !exclude.includes(t.id));
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-3 py-1.5 rounded-2xl font-bold text-xs transition-all active:scale-95 ${
          !selected ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 shadow-sm'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelect(selected === tag.id ? null : tag.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-xs transition-all active:scale-95 ${
            selected === tag.id
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white text-indigo-600 shadow-sm'
          }`}
        >
          <EventTagIcon tag={tag} size={11} />
          {tag.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Capture tips — stacked card deck ───────────────────────────────────── */

function CaptureTipsStrip() {
  const n = CAPTURE_TIPS.length;
  const [currentIdx, setCurrentIdx] = useState(new Date().getDate() % n);
  const [exiting,    setExiting]    = useState(false);
  const interacted = useRef(false);

  function next() {
    if (exiting) return;
    interacted.current = true;
    setExiting(true);
    setTimeout(() => {
      setCurrentIdx((i) => (i + 1) % n);
      setExiting(false);
    }, 290);
  }

  const tip  = CAPTURE_TIPS[currentIdx];
  const Icon = TIP_ICONS[tip.icon] ?? Camera;

  return (
    <div className="mb-2">
      {/* Stack wrapper */}
      <div className="relative cursor-pointer select-none" style={{ height: 220 }} onClick={next}>

        {/* Back card */}
        <div
          className="absolute inset-x-0 rounded-3xl bg-indigo-200"
          style={{ top: 8, bottom: 0, transform: 'rotate(3.5deg) translateX(4px)' }}
        />

        {/* Middle card */}
        <div
          className="absolute inset-x-0 rounded-3xl bg-indigo-400"
          style={{ top: 4, bottom: 0, transform: 'rotate(-2deg) translateX(-2px)' }}
        />

        {/* Front card */}
        <div
          key={currentIdx}
          className={`absolute inset-x-0 top-0 bottom-0 rounded-3xl bg-indigo-900 shadow-xl shadow-indigo-200 px-4 py-3 flex flex-col gap-1 ${
            exiting
              ? 'animate-card-exit'
              : interacted.current
                ? 'animate-card-enter'
                : ''
          }`}
        >
          <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon size={22} className="text-white" />
          </div>
          <p className="font-black text-white text-xl leading-tight">{tip.headline}</p>
          <p className="text-white/75 font-semibold text-sm leading-snug flex-1">{tip.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Tap to shuffle</span>
            <span className="text-white/35 text-[10px] font-bold">{currentIdx + 1} / {n}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStats({ portraitsThisWeek, childrenPhotographedToday }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-3">
      <div className="bg-white rounded-3xl px-4 py-3 shadow-md shadow-indigo-100 text-center">
        <p className="font-black text-xl text-indigo-900">{portraitsThisWeek}</p>
        <p className="text-[11px] font-bold text-indigo-400 mt-0.5 leading-tight">portraits this week</p>
      </div>
      <div className="bg-white rounded-3xl px-4 py-3 shadow-md shadow-indigo-100 text-center">
        <p className="font-black text-xl text-indigo-900">{childrenPhotographedToday}</p>
        <p className="text-[11px] font-bold text-indigo-400 mt-0.5 leading-tight">children today</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PARENT TIMELINE
   ═══════════════════════════════════════════════════════════════════════ */

function TimelineEntry({ portrait, activeChildId, childrenList, onClick, onDelete, onAddBirthday }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const lp = useLongPress(() => setConfirmDelete(true));
  const { pressing, progress } = lp;

  const friends = portrait.taggedIds
    .filter((id) => id !== activeChildId)
    .map((id) => childrenList.find((c) => c.id === id))
    .filter(Boolean);

  const activeChild = childrenList.find((c) => c.id === activeChildId);
  const ageLong = ageAtDateLong(activeChild?.birthdate, portrait.date);
  const friendNames = friends.map((f) => f.name).join(' & ');
  const hasFriends = friends.length > 0;
  const label = hasFriends
    ? (ageLong ? `With ${friendNames} at ${ageLong}` : `With ${friendNames}`)
    : funTitle(portrait);
  const showBirthdayNudge = hasFriends && !ageLong && !!activeChild;
  const dateStr = formatDateShort(portrait.date);
  const eventTag = EVENT_TAGS.find((t) => t.id === portrait.eventTag);

  return (
    <>
      {confirmDelete && (
        <DeleteConfirm
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => { setConfirmDelete(false); onDelete(); }}
        />
      )}
      <div className="flex gap-3">
        <div className="flex flex-col items-center w-12 flex-shrink-0">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <Camera size={17} className="text-indigo-500" />
          </div>
          <div className="w-0.5 bg-indigo-100 flex-1 mt-1 mb-1" />
        </div>

        <div
          {...lp}
          onClick={(e) => { lp.onClick(e); if (!e.defaultPrevented) onClick?.(); }}
          onContextMenu={(e) => e.preventDefault()}
          className={`flex-1 bg-white rounded-3xl shadow-md shadow-indigo-100 overflow-hidden text-left mb-5 transition-transform cursor-pointer select-none ${pressing && progress > 0.2 ? 'scale-[0.97]' : 'active:scale-[0.98]'}`}
        >
          {/* Header row */}
          <div className="px-4 pt-4 pb-2.5 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-indigo-900 text-base leading-tight">{label}</h3>
              {showBirthdayNudge && (
                <button
                  onClick={(e) => { e.stopPropagation(); onAddBirthday?.(); }}
                  className="mt-1 text-[11px] font-bold text-teal-500 underline underline-offset-2"
                >
                  + Add {activeChild.name}'s birthday to see their age
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5 flex-wrap justify-end">
              {eventTag && (
                <span className="bg-rose-50 text-rose-600 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <EventTagIcon tag={eventTag} size={9} /> {eventTag.label}
                </span>
              )}
              <span className={`font-extrabold text-[10px] px-2.5 py-1 rounded-full ${portrait.source === 'parent' ? 'bg-teal-100 text-teal-600' : 'bg-amber-100 text-amber-600'}`}>
                {sourceLabel(portrait, childrenList)}
              </span>
              <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                {dateStr}
              </span>
            </div>
          </div>

          {/* Photo with delete overlay + privacy badge */}
          <div className="aspect-[4/3] overflow-hidden bg-indigo-100 relative">
            <img
              src={portrait.photoUrl}
              alt={label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Privacy badge */}
            <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
              <Shield size={9} className="text-white/80 flex-shrink-0" />
              <span className="text-white/80 text-[9px] font-bold leading-none">Portrait Pals</span>
            </div>
            {/* Delete progress ring */}
            {pressing && progress > 0.2 && (
              <div className="absolute inset-0 bg-rose-900/50 flex flex-col items-center justify-center gap-2">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="5" />
                    <circle
                      cx="32" cy="32" r="26" fill="none" stroke="white" strokeWidth="5"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trash2 size={22} className="text-white" />
                  </div>
                </div>
                <span className="text-white font-black text-xs tracking-wide">Release to delete</span>
              </div>
            )}
          </div>

          {/* Notes + hint */}
          <div className="px-4 pt-3 pb-3.5 flex items-center justify-between gap-2">
            {portrait.notes ? (
              <p className="text-indigo-700 text-sm font-medium leading-snug">{portrait.notes}</p>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-300 flex-shrink-0">
              <Trash2 size={9} />
              Hold to delete
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Pending Approval card ───────────────────────────────────────────── */

function PendingApprovalCard({ portrait, childId, childrenList, onApprove, onDecline }) {
  const tagged = portrait.taggedIds
    .map((id) => childrenList.find((c) => c.id === id))
    .filter(Boolean);
  const names = tagged.map((c) => c.name).join(' & ') || 'Friendship Portrait';

  return (
    <div className="bg-white rounded-3xl shadow-md shadow-amber-100 overflow-hidden border-2 border-amber-200">
      <div className="aspect-[4/3] bg-indigo-100 relative">
        <img src={portrait.photoUrl} alt={names} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-amber-500/10 flex items-end p-3">
          <span className="bg-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
            <Clock size={11} /> Awaiting your approval
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="font-black text-indigo-900 text-sm leading-tight">{names}</p>
        <p className="text-indigo-400 text-xs font-semibold mt-0.5">{formatDate(portrait.date)}</p>
        {portrait.notes && (
          <p className="text-indigo-600 text-xs mt-2 leading-snug line-clamp-2">{portrait.notes}</p>
        )}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onDecline(portrait.id, childId)}
            className="flex-1 bg-amber-50 text-indigo-600 font-black text-sm rounded-2xl py-2.5 active:scale-95 transition-transform"
          >
            Decline
          </button>
          <button
            onClick={() => onApprove(portrait.id, childId)}
            className="flex-1 bg-teal-500 text-white font-black text-sm rounded-2xl py-2.5 shadow-md shadow-teal-200 active:scale-95 transition-transform"
          >
            <Check size={14} className="inline mr-1" />Approve
          </button>
        </div>
      </div>
    </div>
  );
}

function ParentTimeline({ user, portraits, childrenList, logout, addChild, addChildToSession, updateChild, deletePortrait, approvePortraitForChild, declinePortraitForChild }) {
  const navigate       = useNavigate();
  const { rooms }      = useApp();
  const parentChildren = childrenList.filter((c) => (user.childIds ?? []).includes(c.id));
  const [activeId,          setActiveId]          = useState(parentChildren[0]?.id ?? null);
  const [selectedFriendId,  setSelectedFriendId]  = useState(null);
  const [selectedEventTag,  setSelectedEventTag]  = useState(null);
  const [showAddChild,      setShowAddChild]      = useState(false);
  const [editingChild,      setEditingChild]      = useState(null);
  const [privacyDismissed,  setPrivacyDismissed]  = useState(
    () => sessionStorage.getItem('pp_privacy_banner') === '1'
  );
  const [showNotifications, setShowNotifications] = useState(false);

  const myChildIds = user.childIds ?? [];

  // Notifications addressed to any of this parent's children
  const allNotifications = (() => {
    try { return JSON.parse(localStorage.getItem('pp_notifications') || '[]'); } catch { return []; }
  })();
  const myNotifications = allNotifications
    .filter((n) => (n.recipientChildIds ?? []).some((id) => myChildIds.includes(id)))
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  function markAllRead() {
    try {
      const updated = allNotifications.map((n) =>
        (n.recipientChildIds ?? []).some((id) => myChildIds.includes(id)) ? { ...n, read: true } : n
      );
      localStorage.setItem('pp_notifications', JSON.stringify(updated));
    } catch { /* non-fatal */ }
  }

  const activeChild = childrenList.find((c) => c.id === activeId);

  // Portraits visible to this child — hidden if this child is pending/declined,
  // OR if any other tagged child has declined (photo removed from all timelines)
  const childPortraits = portraits
    .filter((p) =>
      p.taggedIds.includes(activeId) &&
      (p.source === 'school' || p.source === 'parent') &&
      !p.pendingConsent?.includes(activeId) &&
      !(p.declinedBy?.length > 0)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Portraits pending this child's approval
  const pendingPortraits = portraits.filter(
    (p) => p.taggedIds.includes(activeId) && p.pendingConsent?.includes(activeId)
  );

  const friends = childrenList.filter((c) => {
    if (c.id === activeId) return false;
    return childPortraits.some((p) => p.taggedIds.includes(c.id));
  });

  const displayPortraits = childPortraits.filter((p) => {
    if (selectedFriendId && !p.taggedIds.includes(selectedFriendId)) return false;
    if (selectedEventTag  && p.eventTag !== selectedEventTag) return false;
    return true;
  });

  const slideshowPortraits = [...displayPortraits].sort((a, b) => new Date(a.date) - new Date(b.date));

  const avatarUrl = activeChild?.photoUrl ?? childPortraits[0]?.photoUrl ?? null;

  function playTimeline() {
    if (slideshowPortraits.length === 0) return;
    navigate('/slideshow', { state: { portraits: slideshowPortraits, startIndex: 0 } });
  }

  function toggleFriend(id) {
    setSelectedFriendId((prev) => (prev === id ? null : id));
  }

  function dismissPrivacyBanner() {
    sessionStorage.setItem('pp_privacy_banner', '1');
    setPrivacyDismissed(true);
  }

  if (!activeChild) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center text-center px-6">
        <div>
          <p className="font-black text-indigo-900 text-xl mb-2">No children linked</p>
          <p className="text-indigo-400 font-semibold text-sm">Contact your educator to link your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-28">

      {/* ── Header ── */}
      <div className="bg-white shadow-md shadow-indigo-100 px-5 pt-safe pt-4 pb-5 sticky top-0 z-20 rounded-b-3xl">
        {/* Privacy info strip */}
        {!privacyDismissed && (
          <div className="flex items-center gap-2 bg-teal-50 rounded-2xl px-3 py-2.5 mb-3">
            <Shield size={14} className="text-teal-500 flex-shrink-0" />
            <p className="text-xs font-semibold text-teal-700 flex-1 leading-snug">
              Photos shared only within Portrait Pals — never on social media.
            </p>
            <button onClick={dismissPrivacyBanner} className="text-teal-400 flex-shrink-0 p-0.5">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-indigo-900 leading-tight">{activeChild.name}</h1>
            <p className="text-xs font-extrabold text-teal-500 uppercase tracking-widest mt-0.5">
              Parent Timeline
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowNotifications((v) => !v); if (unreadCount > 0) markAllRead(); }}
              className="relative w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-indigo-400 active:scale-90 transition-transform"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={logout}
              className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-indigo-400 active:scale-90 transition-transform"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Notifications panel */}
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
            <div className="relative z-20 mt-3 bg-indigo-50 rounded-2xl overflow-hidden">
              <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest px-4 pt-3 pb-2">
                Notifications
              </p>
              {myNotifications.length === 0 ? (
                <p className="text-sm font-semibold text-indigo-300 px-4 pb-3">No notifications yet</p>
              ) : (
                <div className="space-y-0 divide-y divide-indigo-100">
                  {myNotifications.map((n) => {
                    const recipientNames = (n.recipientChildIds ?? [])
                      .map((id) => childrenList.find((c) => c.id === id)?.name)
                      .filter(Boolean).join(' & ');
                    const declinerName = childrenList.find((c) => c.id === n.declinedByChildId)?.name ?? 'Another family';
                    const portrait = portraits.find((p) => p.id === n.portraitId);
                    const photoLabel = portrait?.notes
                      ? `"${portrait.notes}"`
                      : portrait
                        ? `Photo from ${new Date(portrait.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        : 'A shared photo';
                    return (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                          <Bell size={14} className="text-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-indigo-900 leading-snug">
                                {photoLabel} was removed
                              </p>
                              <p className="text-xs font-semibold text-indigo-400 mt-0.5 leading-snug">
                                {declinerName}'s family declined this photo — removed from {recipientNames}'s timeline. Contact your educator if you'd like to discuss.
                              </p>
                              <p className="text-[10px] text-indigo-300 mt-1">
                                {new Date(n.ts).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                            {portrait?.photoUrl && (
                              <img
                                src={portrait.photoUrl}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-indigo-100"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Child switcher + add child */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none">
          {parentChildren.map((child) => (
            <ChildPill
              key={child.id}
              child={child}
              active={activeId === child.id}
              onClick={() => setActiveId(child.id)}
              onLongPress={() => setEditingChild(child)}
            />
          ))}
          <button
            onClick={() => setShowAddChild(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-sm text-teal-500 bg-teal-50 active:scale-95 transition-transform"
          >
            <Plus size={15} /> Add Child
          </button>
        </div>
        <p className="text-[10px] font-semibold text-indigo-300 mt-1.5 tracking-wide">
          Hold a name to edit profile
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* ── Hero card ── */}
        <div className="bg-white rounded-3xl shadow-lg shadow-indigo-100 p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-indigo-100 ring-4 ring-indigo-100">
            {avatarUrl ? (
              <img src={avatarUrl} alt={activeChild.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-2xl text-indigo-300">
                {initials(activeChild.name)}
              </div>
            )}
          </div>
          <h2 className="font-black text-xl text-indigo-900">Friendship Timeline</h2>
          <p className="text-indigo-400 font-semibold text-sm mt-1.5">
            Capturing {activeChild.name}'s connections over time.
          </p>
          <button
            onClick={playTimeline}
            disabled={childPortraits.length === 0}
            className="w-full bg-indigo-600 text-white font-black text-base rounded-2xl py-4 mt-5 flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-200 active:scale-95 transition-transform disabled:opacity-40"
          >
            <Play size={17} className="fill-white text-white" />
            Play Timeline
          </button>
        </div>

        {/* ── Pending approvals ── */}
        {pendingPortraits.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                Pending Approval
              </p>
              <span className="bg-amber-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {pendingPortraits.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingPortraits.map((p) => (
                <PendingApprovalCard
                  key={p.id}
                  portrait={p}
                  childId={activeId}
                  childrenList={childrenList}
                  onApprove={approvePortraitForChild}
                  onDecline={declinePortraitForChild}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Friend filter strip ── */}
        {friends.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-3">
              Filter by friend
            </p>
            <div className="flex gap-4 overflow-x-auto scrollbar-none -mx-1 px-1 pt-2 pb-2">
              {friends.map((friend) => {
                const active = selectedFriendId === friend.id;
                return (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0"
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-white font-black text-base shadow-md transition-all ${
                      active
                        ? 'bg-teal-500 ring-4 ring-offset-2 ring-offset-amber-50 ring-teal-300'
                        : 'bg-indigo-200'
                    }`}>
                      {friend.photoUrl
                        ? <img src={friend.photoUrl} alt={friend.name} className="w-full h-full object-cover" />
                        : initials(friend.name)}
                    </div>
                    <span className={`text-xs font-bold w-16 text-center leading-tight ${active ? 'text-teal-600' : 'text-indigo-500'}`}>
                      {friend.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedFriendId && (
              <button
                onClick={() => setSelectedFriendId(null)}
                className="mt-2 text-xs font-bold text-teal-500 underline underline-offset-2"
              >
                Show all memories
              </button>
            )}
          </div>
        )}

        {/* ── Event tag filter ── */}
        <div className="mb-4">
          <p className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
            Filter by event
          </p>
          <EventTagFilter selected={selectedEventTag} onSelect={setSelectedEventTag} />
        </div>

        {/* ── Timeline feed ── */}
        {displayPortraits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-3xl flex items-center justify-center mb-4">
              <Camera size={28} className="text-teal-400" />
            </div>
            <p className="font-black text-indigo-900 text-lg">
              {selectedFriendId || selectedEventTag ? 'No matching memories' : 'No memories yet'}
            </p>
            <p className="text-indigo-400 text-sm font-semibold mt-1 max-w-xs">
              Tap Add Memory below to capture {activeChild.name}'s first friendship moment.
            </p>
          </div>
        ) : (
          <div>
            {displayPortraits.map((portrait) => (
              <TimelineEntry
                key={portrait.id}
                portrait={portrait}
                activeChildId={activeId}
                childrenList={childrenList}
                onClick={() =>
                  navigate('/slideshow', {
                    state: {
                      portraits: slideshowPortraits,
                      startIndex: slideshowPortraits.findIndex((p) => p.id === portrait.id),
                    },
                  })
                }
                onDelete={() => deletePortrait(portrait.id)}
                onAddBirthday={() => setEditingChild(activeChild)}
              />
            ))}
          </div>
        )}
      </div>

      {showAddChild && (
        <AddChildModal
          rooms={rooms}
          hideRoom
          userRole="parent"
          onClose={() => setShowAddChild(false)}
          onAdd={(child) => {
            addChild(child);
            addChildToSession(child.id);
            setActiveId(child.id);
          }}
        />
      )}

      {editingChild && (
        <EditChildModal
          child={editingChild}
          rooms={rooms}
          userRole="parent"
          onClose={() => setEditingChild(null)}
          onSave={(updates) => { updateChild(editingChild.id, updates); setEditingChild(null); }}
        />
      )}

      {/* ── Sticky: Add Memory ── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-6 z-20 bg-gradient-to-t from-amber-50 via-amber-50/90 to-transparent"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}
      >
        <button
          onClick={() => navigate('/capture')}
          className="w-full bg-teal-500 text-white font-black text-lg rounded-2xl py-4 flex items-center justify-center gap-2.5 shadow-2xl shadow-teal-300 active:scale-95 transition-transform"
        >
          <Camera size={20} />
          Add Memory
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   EDUCATOR DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */

function PortraitCard({ portrait, childrenList, onClick, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const lp = useLongPress(() => setConfirmDelete(true));
  const { pressing, progress } = lp;

  const tagged  = portrait.taggedIds.map((id) => childrenList.find((c) => c.id === id)).filter(Boolean);
  const names   = tagged.map((c) => c.name).join(' & ') || 'Unnamed';
  const dateStr = formatDate(portrait.date);
  const eventTag = EVENT_TAGS.find((t) => t.id === portrait.eventTag);
  const hasPending = false; // hidden from educator grid; badge kept for future admin use

  return (
    <>
      {confirmDelete && (
        <DeleteConfirm
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => { setConfirmDelete(false); onDelete(); }}
        />
      )}
      <div
        {...lp}
        onClick={(e) => { lp.onClick(e); if (!e.defaultPrevented) onClick?.(); }}
        onContextMenu={(e) => e.preventDefault()}
        className={`bg-white rounded-3xl shadow-lg shadow-indigo-100 overflow-hidden transition-transform text-left w-full cursor-pointer select-none ${pressing && progress > 0.2 ? 'scale-[0.96]' : 'active:scale-95'}`}
      >
        <div className="aspect-[4/3] bg-indigo-100 overflow-hidden relative">
          <img src={portrait.photoUrl} alt={names} className="w-full h-full object-cover" loading="lazy" />
          {/* Privacy badge */}
          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-0.5">
            <Shield size={8} className="text-white/70 flex-shrink-0" />
            <span className="text-white/70 text-[8px] font-bold leading-none">Portrait Pals</span>
          </div>
          {/* Pending consent badge */}
          {hasPending && (
            <div className="absolute top-2 right-2 bg-amber-500 rounded-full px-2 py-0.5">
              <span className="text-white text-[8px] font-bold leading-none flex items-center gap-0.5"><Clock size={8} /> Awaiting consent</span>
            </div>
          )}
          {/* Delete ring */}
          {pressing && progress > 0.2 && (
            <div className="absolute inset-0 bg-rose-900/50 flex flex-col items-center justify-center gap-1.5">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="19" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="4" />
                  <circle
                    cx="24" cy="24" r="19" fill="none" stroke="white" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 19}`}
                    strokeDashoffset={`${2 * Math.PI * 19 * (1 - progress)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trash2 size={16} className="text-white" />
                </div>
              </div>
              <span className="text-white font-black text-[10px] tracking-wide">Release to delete</span>
            </div>
          )}
        </div>
        <div className="p-3.5">
          <p className="font-black text-indigo-900 text-sm leading-tight">{names}</p>
          <p className="text-indigo-400 text-xs font-semibold mt-0.5">{dateStr}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="bg-amber-100 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
              {sourceLabel(portrait, childrenList)}
            </span>
            {eventTag && (
              <span className="bg-rose-50 text-rose-600 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <EventTagIcon tag={eventTag} size={9} /> {eventTag.label}
              </span>
            )}
          </div>
          {portrait.notes ? (
            <p className="text-indigo-600 text-xs mt-1.5 leading-snug line-clamp-2">{portrait.notes}</p>
          ) : null}
          <p className="flex items-center gap-1 text-[10px] font-bold text-rose-300 mt-1.5">
            <Trash2 size={8} />
            Hold to delete
          </p>
        </div>
      </div>
    </>
  );
}

function EducatorDashboard({ user, portraits, childrenList, rooms, addChild, updateChild, deletePortrait, logout }) {
  const navigate = useNavigate();
  const [selectedRoom,    setSelectedRoom]    = useState('all');
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedEventTag,setSelectedEventTag]= useState(null);
  const [showAddChild,    setShowAddChild]    = useState(false);
  const [editingChild,    setEditingChild]    = useState(null);
  const [roomToast,       setRoomToast]       = useState(null);
  const [activeTab,       setActiveTab]       = useState('capture');
  const [showTipsModal,   setShowTipsModal]   = useState(false);
  const migrationRan = useRef(false);

  // Auto room progression on first mount
  useEffect(() => {
    if (migrationRan.current) return;
    migrationRan.current = true;
    const today = new Date();
    let count = 0;
    childrenList.forEach((child) => {
      if (!child.birthdate) return;
      const correct = calcRoomForAge(child.birthdate, today);
      if (correct && correct !== child.roomId) {
        updateChild(child.id, { roomId: correct });
        count++;
      }
    });
    if (count > 0) {
      setRoomToast(count);
      setTimeout(() => setRoomToast(null), 5000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleChildren = childrenList.filter(
    (c) => selectedRoom === 'all' || c.roomId === selectedRoom
  );

  const filteredPortraits = portraits
    .filter((p) => {
      if (p.source !== 'school') return false;
      if ((p.pendingConsent?.length ?? 0) > 0) return false;
      const inView = p.taggedIds.some((id) => visibleChildren.some((c) => c.id === id));
      if (!inView) return false;
      if (selectedChildId && !p.taggedIds.includes(selectedChildId)) return false;
      if (selectedEventTag && p.eventTag !== selectedEventTag) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const slideshowPortraits = [...filteredPortraits].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Quick stats
  const todayStr = new Date().toISOString().split('T')[0];
  const startOfWeek = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(new Date().setDate(diff)).toISOString().split('T')[0];
  })();
  const schoolPortraits = portraits.filter((p) => p.source === 'school');
  const portraitsThisWeek = schoolPortraits.filter((p) => p.date >= startOfWeek).length;
  const childrenPhotographedToday = new Set(
    schoolPortraits.filter((p) => p.date === todayStr).flatMap((p) => p.taggedIds)
  ).size;

  function openSlideshow(portrait) {
    navigate('/slideshow', {
      state: {
        portraits: slideshowPortraits,
        startIndex: slideshowPortraits.findIndex((p) => p.id === portrait.id),
      },
    });
  }

  function handleRoomChange(roomId) {
    setSelectedRoom(roomId);
    setSelectedChildId(null);
  }

  const sectionLabel = selectedChildId
    ? `${childrenList.find((c) => c.id === selectedChildId)?.name ?? ''}'s Portraits`
    : 'Friendship Portraits';

  return (
    <div className="min-h-screen bg-amber-50 pb-8">

      {/* Room migration toast */}
      {roomToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-indigo-900 text-white rounded-2xl px-5 py-3 shadow-2xl text-sm font-bold flex items-center gap-2">
            <ArrowRight size={15} className="flex-shrink-0" />
            {roomToast} {roomToast === 1 ? 'child has' : 'children have'} been moved to a new room based on their birthdate
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md shadow-indigo-100 px-5 pt-safe pt-4 pb-5 sticky top-0 z-20 rounded-b-3xl">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-indigo-900 leading-tight">Portrait Pals</h1>
            <p className="text-xs font-extrabold text-rose-500 uppercase tracking-widest mt-0.5">Educator View</p>
          </div>
          <button
            onClick={logout}
            className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-indigo-400 active:scale-90 transition-transform"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">

        {/* Tab strip */}
        <div className="flex gap-2 pt-4 pb-1">
          {[
            { id: 'capture',   label: 'Capture',   Icon: Camera },
            { id: 'portraits', label: 'Portraits',  Icon: Users  },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                activeTab === id
                  ? 'bg-indigo-900 text-white shadow-md'
                  : 'bg-white text-indigo-400 shadow-sm'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Capture ── */}
        {activeTab === 'capture' && (
          <div className="flex flex-col justify-between" style={{ minHeight: 'calc(100svh - 160px)' }}>

            {/* (i) tips trigger — top right */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowTipsModal(true)}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-300 active:scale-90 transition-transform"
                aria-label="Photography tips"
              >
                <Info size={17} />
              </button>
            </div>

            {/* Circular capture CTA */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => navigate('/capture')}
                className="w-64 h-64 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform border-4 border-white"
                style={{ background: 'linear-gradient(135deg, #47b3ec, #39a6e8)', boxShadow: '0 12px 30px #39a6e828' }}
              >
                <Camera size={80} className="text-white" />
              </button>
              <p className="text-base font-black text-indigo-900 mt-3">Capture Portrait</p>
            </div>

            {/* Quick stats */}
            <QuickStats
              portraitsThisWeek={portraitsThisWeek}
              childrenPhotographedToday={childrenPhotographedToday}
            />

            {/* Compact room filter + declined section grouped */}
            <div>
            {/* Compact room filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 mb-2 pb-1">
              {['all', ...rooms.map((r) => r.id)].map((roomId) => {
                const label = roomId === 'all' ? 'All' : rooms.find((r) => r.id === roomId)?.name ?? roomId;
                return (
                  <button
                    key={roomId}
                    onClick={() => handleRoomChange(roomId)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-2xl font-bold text-xs transition-all active:scale-95 ${
                      selectedRoom === roomId
                        ? 'bg-indigo-900 text-white shadow-md shadow-indigo-200'
                        : 'bg-white text-indigo-600 shadow-sm'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Declined children — cannot be photographed */}
            {(() => {
              const declined = childrenList.filter(
                (c) => c.consentStatus === 'declined' &&
                  (selectedRoom === 'all' || c.roomId === selectedRoom)
              );
              if (declined.length === 0) {
                return (
                  <div className="bg-teal-50 rounded-2xl px-4 py-3 mb-3 flex items-center gap-2.5">
                    <CheckCircle size={14} className="text-teal-500 flex-shrink-0" />
                    <p className="text-xs font-semibold text-teal-700">
                      {selectedRoom === 'all' ? 'All children' : 'All children in this room'} are available to photograph.
                    </p>
                  </div>
                );
              }
              return (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-xs font-extrabold text-rose-500 uppercase tracking-widest">
                      Cannot be photographed
                    </p>
                    <span className="bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {declined.length}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-rose-400 mb-2 leading-snug">
                    These children have opted out — do not include them in photos.
                  </p>
                  <div className="flex gap-4 overflow-x-auto scrollbar-none -mx-1 px-1 pt-2 pb-3">
                    {declined.map((child) => (
                      <ChildChip
                        key={child.id}
                        child={child}
                        active={false}
                        onClick={() => {}}
                        onLongPress={() => setEditingChild(child)}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold text-indigo-300 mt-1">Hold to edit</p>
                </div>
              );
            })()}
            </div>{/* end room+declined group */}
          </div>
        )}

        {/* ── Tab 2: Portraits ── */}
        {activeTab === 'portraits' && (
          <div>
            {/* Room tabs */}
            <div className="flex gap-2 pt-5 pb-1 overflow-x-auto scrollbar-none -mx-1 px-1">
              {['all', ...rooms.map((r) => r.id)].map((roomId) => {
                const label = roomId === 'all' ? 'All Rooms' : rooms.find((r) => r.id === roomId)?.name ?? roomId;
                return (
                  <button
                    key={roomId}
                    onClick={() => handleRoomChange(roomId)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                      selectedRoom === roomId
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                        : 'bg-white text-indigo-600 shadow-sm'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Children strip */}
            <div className="flex gap-4 pt-4 pb-2 overflow-x-auto scrollbar-none -mx-1 px-1">
              {visibleChildren.map((child) => (
                <ChildChip
                  key={child.id}
                  child={child}
                  active={!selectedChildId || selectedChildId === child.id}
                  onClick={() => setSelectedChildId((prev) => (prev === child.id ? null : child.id))}
                  onLongPress={() => setEditingChild(child)}
                />
              ))}
              <button
                onClick={() => setShowAddChild(true)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-rose-300 flex items-center justify-center text-rose-400 active:scale-95 transition-transform">
                  <Plus size={22} />
                </div>
                <span className="text-xs font-bold text-rose-400 w-16 text-center leading-tight">Add Child</span>
              </button>
            </div>

            {/* Consent dot legend */}
            <p className="text-[10px] font-semibold text-indigo-300 mb-1 tracking-wide flex items-center gap-3 flex-wrap">
              <span>Hold to edit</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />Photos approved</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Pending approval</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Photos declined</span>
            </p>

            {/* Event tag filter */}
            <div className="mt-3 mb-1">
              <EventTagFilter selected={selectedEventTag} onSelect={setSelectedEventTag} exclude={['family']} />
            </div>

            {/* Section heading */}
            <div className="flex items-center justify-between mt-4 mb-3">
              <h2 className="font-black text-lg text-indigo-900">{sectionLabel}</h2>
              <span className="text-xs font-bold text-indigo-400 bg-white px-3 py-1.5 rounded-full shadow-sm">
                {filteredPortraits.length}
              </span>
            </div>

            {/* Portrait grid */}
            {filteredPortraits.length === 0 ? (() => {
              const child = childrenList.find((c) => c.id === selectedChildId);
              const status = child?.consentStatus;

              if (status === 'declined') return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mb-4">
                    <Shield size={34} className="text-rose-400" />
                  </div>
                  <p className="font-black text-rose-500 text-lg">Photography declined</p>
                  <p className="text-indigo-400 text-sm font-semibold mt-2 max-w-xs leading-snug">
                    {child.name}'s family has opted out of photography. They can still be part of the community — just no portraits.
                  </p>
                </div>
              );

              if (status === 'pending') return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-4">
                    <Clock size={34} className="text-amber-400" />
                  </div>
                  <p className="font-black text-amber-500 text-lg">Consent pending</p>
                  <p className="text-indigo-400 text-sm font-semibold mt-2 max-w-xs leading-snug">
                    {child.name}'s parent hasn't responded yet. Portraits will appear here once they approve.
                  </p>
                </div>
              );

              if (status === 'unlinked') return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mb-4">
                    <Users size={34} className="text-indigo-300" />
                  </div>
                  <p className="font-black text-indigo-900 text-lg">No parent linked yet</p>
                  <p className="text-indigo-400 text-sm font-semibold mt-2 max-w-xs leading-snug">
                    {child.name} doesn't have a parent account set up. Invite them to join Portrait Pals to enable consent and portraits.
                  </p>
                </div>
              );

              return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mb-4">
                    <Users size={34} className="text-rose-300" />
                  </div>
                  <p className="font-black text-indigo-900 text-lg">No portraits yet</p>
                  <p className="text-indigo-400 text-sm font-semibold mt-2 max-w-xs">
                    Switch to Capture to photograph a friendship moment.
                  </p>
                </div>
              );
            })() : (
              <div className="grid grid-cols-2 gap-3 pb-6">
                {filteredPortraits.map((portrait) => (
                  <PortraitCard
                    key={portrait.id}
                    portrait={portrait}
                    childrenList={childrenList}
                    onClick={() => openSlideshow(portrait)}
                    onDelete={() => deletePortrait(portrait.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {showAddChild && (
        <AddChildModal rooms={rooms} userRole="educator" onClose={() => setShowAddChild(false)} onAdd={addChild} />
      )}

      {editingChild && (
        <EditChildModal
          child={editingChild}
          rooms={rooms}
          userRole="educator"
          onClose={() => setEditingChild(null)}
          onSave={(updates) => { updateChild(editingChild.id, updates); setEditingChild(null); }}
        />
      )}

      {/* Tips modal */}
      {showTipsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 backdrop-blur-md"
          onClick={() => setShowTipsModal(false)}
        >
          <div className="w-full max-w-sm px-6" onClick={(e) => e.stopPropagation()}>
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/50 text-xs font-extrabold uppercase tracking-widest">Photography Tips</p>
              <button
                onClick={() => setShowTipsModal(false)}
                className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <X size={18} />
              </button>
            </div>
            <CaptureTipsStrip />
            <p className="text-center text-white/30 text-xs font-semibold mt-4">Tap outside to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const { user, logout, addChildToSession }          = useAuth();
  const { portraits, childrenList, rooms, addChild, updateChild, deletePortrait, approvePortraitForChild, declinePortraitForChild } = useApp();

  if (user?.role === 'parent') {
    return (
      <ParentTimeline
        user={user}
        portraits={portraits}
        childrenList={childrenList}
        logout={logout}
        addChild={addChild}
        addChildToSession={addChildToSession}
        updateChild={updateChild}
        deletePortrait={deletePortrait}
        approvePortraitForChild={approvePortraitForChild}
        declinePortraitForChild={declinePortraitForChild}
      />
    );
  }

  return (
    <EducatorDashboard
      user={user}
      portraits={portraits}
      childrenList={childrenList}
      rooms={rooms}
      addChild={addChild}
      updateChild={updateChild}
      deletePortrait={deletePortrait}
      logout={logout}
    />
  );
}
