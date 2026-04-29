import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Download,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const AUTO_ADVANCE_MS = 4000;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

function downloadPhoto(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ─── Progress dots ───────────────────────────────────────────────────── */

function Dots({ total, current, onSelect }) {
  if (total <= 1) return null;
  return (
    <div className="flex justify-center gap-1.5 mt-5 flex-wrap">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`h-1.5 rounded-full transition-all ${
            i === current ? 'w-6 bg-rose-500' : 'w-1.5 bg-indigo-200'
          }`}
          aria-label={`Portrait ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ─── Slideshow ───────────────────────────────────────────────────────── */

export default function Slideshow() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { childrenList } = useApp();

  const state     = location.state ?? {};
  const portraits = state.portraits ?? [];

  const [index,    setIndex]    = useState(state.startIndex ?? 0);
  const [immersive, setImmersive] = useState(false);
  const [playing,  setPlaying]  = useState(true);
  const timerRef  = useRef(null);

  const portrait = portraits[index];

  /* ── Navigation helpers ── */

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % portraits.length);
  }, [portraits.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + portraits.length) % portraits.length);
  }, [portraits.length]);

  /* ── Auto-advance ── */

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!playing || portraits.length <= 1) return;
    timerRef.current = setTimeout(goNext, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [index, playing, goNext, portraits.length]);

  function handleManualNav(fn) {
    clearTimeout(timerRef.current);
    fn();
  }

  /* ── No portraits ── */

  if (!portrait) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-black text-indigo-900 text-xl">Nothing to show</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-rose-500 text-white rounded-2xl px-6 py-3 font-black active:scale-95 transition-transform"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const tagged  = portrait.taggedIds
    .map((id) => childrenList.find((c) => c.id === id))
    .filter(Boolean);
  const names   = tagged.map((c) => c.name).join(' & ') || 'Friendship Portrait';
  const dateStr = formatDate(portrait.date);
  const taggedWithAges = tagged.map((c) => {
    const age = ageAtDate(c.birthdate, portrait.date);
    return age ? `${c.name} (${age})` : c.name;
  }).join(' & ') || 'Friendship Portrait';

  /* ── Immersive mode ── */

  if (immersive) {
    return (
      <div className="fixed inset-0 bg-black select-none">
        {/* Full-bleed image */}
        <img
          src={portrait.photoUrl}
          alt={names}
          fetchpriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
        />

        {/* Lateral nav */}
        <button
          onClick={() => handleManualNav(goPrev)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <button
          onClick={() => handleManualNav(goNext)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <ArrowRight size={20} className="text-white" />
        </button>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 pt-safe pt-4 px-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <span className="text-white/50 font-bold" style={{ fontSize: '10px' }}>
            {index + 1} / {portraits.length}
          </span>
          <button
            onClick={() => setImmersive(false)}
            className="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <Minimize2 size={16} className="text-white" />
          </button>
        </div>

        {/* Metadata overlay — spec: 9px font, semi-transparent */}
        <div className="absolute bottom-0 left-0 right-0 pb-safe bg-gradient-to-t from-black/75 via-black/40 to-transparent px-5 pt-10 pb-6">
          <p style={{ fontSize: '9px' }} className="text-white/70 font-extrabold uppercase tracking-wider">
            {dateStr}
          </p>
          <p style={{ fontSize: '9px' }} className="text-white font-black mt-0.5">
            {names}
          </p>
          {portrait.notes ? (
            <p style={{ fontSize: '9px' }} className="text-white/65 mt-1 leading-relaxed line-clamp-3">
              {portrait.notes}
            </p>
          ) : null}

          {/* Play / pause + download */}
          <div className="flex justify-center items-center gap-4 mt-3">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              {playing
                ? <Pause size={14} className="text-white" />
                : <Play  size={14} className="text-white" />}
            </button>
            <button
              onClick={() => downloadPhoto(portrait.photoUrl, names)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              aria-label="Download photo"
            >
              <Download size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Default (framed) mode ── */

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col select-none">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <span className="text-white/40 font-bold text-sm">
          {index + 1} / {portraits.length}
        </span>
        <button
          onClick={() => setImmersive(true)}
          className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Immersive mode"
        >
          <Maximize2 size={16} className="text-white" />
        </button>
      </div>

      {/* Image */}
      <div className="mx-4 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0" style={{ height: '52dvh' }}>
        <img
          src={portrait.photoUrl}
          alt={names}
          fetchpriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Preload next image */}
      {portraits.length > 1 && (
        <img
          src={portraits[(index + 1) % portraits.length].photoUrl}
          alt=""
          aria-hidden="true"
          fetchpriority="low"
          loading="eager"
          decoding="async"
          className="hidden"
        />
      )}

      {/* Metadata card */}
      <div className="flex-1 bg-amber-50 rounded-t-3xl mt-4 px-5 pt-6 pb-10 overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-black text-2xl text-indigo-900 leading-tight">{taggedWithAges}</h2>
            <p className="text-rose-500 font-bold text-sm mt-1">{dateStr}</p>
          </div>
          <button
            onClick={() => downloadPhoto(portrait.photoUrl, names)}
            className="flex-shrink-0 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md text-indigo-400 active:scale-90 transition-transform mt-0.5"
            aria-label="Download photo"
          >
            <Download size={17} />
          </button>
        </div>

        {portrait.notes ? (
          <p className="text-indigo-700 text-sm font-medium mt-3 leading-relaxed">
            {portrait.notes}
          </p>
        ) : null}

        {/* Tagged children chips */}
        {tagged.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tagged.map((child) => (
              <span
                key={child.id}
                className="bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-full"
              >
                {child.name}
              </span>
            ))}
          </div>
        )}

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-5 mt-7">
          <button
            onClick={() => handleManualNav(goPrev)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} className="text-indigo-700" />
          </button>

          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-300 active:scale-90 transition-transform"
          >
            {playing
              ? <Pause size={24} className="text-white" />
              : <Play  size={24} className="text-white" />}
          </button>

          <button
            onClick={() => handleManualNav(goNext)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <ArrowRight size={20} className="text-indigo-700" />
          </button>
        </div>

        <Dots
          total={portraits.length}
          current={index}
          onSelect={(i) => { clearTimeout(timerRef.current); setIndex(i); }}
        />
      </div>
    </div>
  );
}
