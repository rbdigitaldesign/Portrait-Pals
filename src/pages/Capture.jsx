import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, RotateCcw, Check, Upload, SwitchCamera, X, Ban, Users, Smile, Cake, MapPin, Star, PartyPopper, Home, Sun, ArrowDown, Heart, Frame, Users2, CheckCircle, Sparkles, Shield } from 'lucide-react';

const EVENT_TAG_ICONS = { Cake, MapPin, Star, PartyPopper, Home };
function EventTagIcon({ tag, size = 11 }) {
  const Icon = EVENT_TAG_ICONS[tag?.icon];
  return Icon ? <Icon size={size} /> : null;
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

function CaptureSessionTip({ tip, onDismiss }) {
  const Icon = TIP_ICONS[tip.icon] ?? Camera;
  return (
    <div className="fixed inset-x-4 bottom-32 z-40 animate-slide-up">
      <div className="bg-indigo-900/95 backdrop-blur-sm rounded-3xl px-5 py-5 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest mb-1">
              Tip of the session
            </p>
            <p className="font-black text-white text-base leading-tight">{tip.headline}</p>
            <p className="text-indigo-300 font-semibold text-xs mt-1 leading-snug">{tip.description}</p>
          </div>
        </div>
        <div className="mt-4 bg-indigo-800/60 rounded-2xl px-4 py-3 flex items-center justify-around">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 flex-shrink-0" />
            <span className="text-xs font-bold text-indigo-200">Approved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-xs font-bold text-indigo-200">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 flex-shrink-0" />
            <span className="text-xs font-bold text-indigo-200">Declined</span>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="w-full mt-3 bg-rose-500 text-white font-black rounded-2xl py-3.5 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Check size={16} /> Got it — let's go!
        </button>
      </div>
    </div>
  );
}
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { EVENT_TAGS } from '../data/seed';

/* ─── Canvas helpers ──────────────────────────────────────────────────── */

function compressVideoFrame(videoEl) {
  const MAX = 800;
  let w = videoEl.videoWidth  || 800;
  let h = videoEl.videoHeight || 600;
  if (w > MAX || h > MAX) {
    const ratio = Math.min(MAX / w, MAX / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }
  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(videoEl, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.8);
}

function compressImageFile(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 800;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = url;
  });
}

/* ─── DuoSilhouette SVG overlay ──────────────────────────────────────── */

function DuoSilhouette() {
  const o = {
    fill: 'none',
    stroke: 'white',
    strokeOpacity: 0.68,
    strokeWidth: 2.5,
    strokeDasharray: '10 6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  return (
    <svg
      viewBox="0 0 400 500"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="100" cy="112" r="50" {...o} className="silhouette-outline" />
      <path
        d="M 26 182 Q 100 160 174 182 C 174 298 160 392 142 424 Q 100 436 58 424 C 40 392 26 298 26 182 Z"
        {...o}
        className="silhouette-outline"
        style={{ animationDelay: '-0.7s' }}
      />
      <circle cx="300" cy="122" r="45" {...o}
        className="silhouette-outline"
        style={{ animationDelay: '-1.3s' }}
      />
      <path
        d="M 236 190 Q 300 170 364 190 C 364 303 351 393 334 424 Q 300 436 266 424 C 249 393 236 303 236 190 Z"
        {...o}
        className="silhouette-outline"
        style={{ animationDelay: '-2.0s' }}
      />
      <g transform="translate(200, 252)" opacity="0.52">
        <path
          d="M0,-10 C6,-18 16,-18 16,-8 C16,2 0,14 0,14 C0,14 -16,2 -16,-8 C-16,-18 -6,-18 0,-10 Z"
          fill="white"
        />
      </g>
      <g transform="translate(46, 60)" opacity="0.42">
        <line x1="0" y1="-7" x2="0" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="-7" y1="0" x2="7" y2="0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="-5" y1="-5" x2="5" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5" y1="-5" x2="-5" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <g transform="translate(354, 70)" opacity="0.42">
        <line x1="0" y1="-6" x2="0" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="-6" y1="0" x2="6" y2="0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

/* ─── Framing rule badges ─────────────────────────────────────────────── */

const TIPS = [
  { icon: Users,     label: 'Side by side'    },
  { icon: Camera,    label: 'Face the camera' },
  { icon: Smile,     label: 'Big smiles'      },
];

function FramingRules() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % TIPS.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute top-4 left-0 right-0 px-4">
      <p className="text-center text-white/55 text-[10px] font-extrabold uppercase tracking-widest mb-2">
        Framing suggestions
      </p>
      <div className="flex justify-center gap-1.5 flex-wrap">
        {TIPS.map(({ icon: Icon, label }, i) => (
          <span
            key={label}
            className={`backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              i === activeIdx ? 'bg-rose-500/80 scale-105' : 'bg-black/40'
            }`}
          >
            <Icon size={12} />{label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Consent status display ─────────────────────────────────────────── */

const CONSENT_INFO = {
  approved: { dot: 'bg-teal-400',  label: 'Photos approved'        },
  pending:  { dot: 'bg-amber-400', label: 'Pending photo approval' },
  declined: { dot: 'bg-rose-500',  label: 'Photos declined'        },
  unlinked: { dot: 'bg-amber-400', label: 'Pending photo approval' },
};

/* ─── Capture page ────────────────────────────────────────────────────── */

export default function Capture() {
  const navigate                          = useNavigate();
  const { childrenList, addPortrait }     = useApp();
  const { user }                          = useAuth();
  const videoRef                          = useRef(null);
  const streamRef                         = useRef(null);
  const fileInputRef                      = useRef(null);

  const [facingMode,          setFacingMode]          = useState('environment');
  const [cameraActive,        setCameraActive]        = useState(false);
  const [cameraError,         setCameraError]         = useState(null);
  const [captured,            setCaptured]            = useState(null);
  const [selectedIds,         setSelectedIds]         = useState([]);
  const [childSearch,         setChildSearch]         = useState('');
  const [notes,               setNotes]               = useState('');
  const [eventTag,            setEventTag]            = useState(null);
  const [saving,              setSaving]              = useState(false);
  const [saved,               setSaved]               = useState(false);
  const [declinedToast,       setDeclinedToast]       = useState('');
  const [showTipInterstitial, setShowTipInterstitial] = useState(
    () => sessionStorage.getItem('pp_capture_tip_shown') !== '1'
  );

  const sessionTip = CAPTURE_TIPS[new Date().getDate() % CAPTURE_TIPS.length];

  function dismissTipInterstitial() {
    sessionStorage.setItem('pp_capture_tip_shown', '1');
    setShowTipInterstitial(false);
  }

  /* ── Camera lifecycle ── */

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async (facing = 'environment') => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError(err.message || 'Camera access denied.');
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera(facingMode);
    return stopCamera;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function flipCamera() {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await startCamera(next);
  }

  /* ── Capture / file ── */

  function handleCapture() {
    if (!videoRef.current) return;
    const dataUrl = compressVideoFrame(videoRef.current);
    stopCamera();
    setCaptured(dataUrl);
  }

  function handleRetake() {
    setCaptured(null);
    setSelectedIds([]);
    setNotes('');
    setEventTag(null);
    setDeclinedToast('');
    startCamera(facingMode);
  }

  async function handleFileInput(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const dataUrl = await compressImageFile(file);
    setCaptured(dataUrl);
    e.target.value = '';
  }

  /* ── Tagging ── */

  function toggleChild(id) {
    const child = childrenList.find((c) => c.id === id);
    if (child?.consentStatus === 'declined') {
      if (!selectedIds.includes(id)) {
        // Lock them in — can only exit by retaking
        setSelectedIds((prev) => [...prev, id]);
        setDeclinedToast(
          `${child.name} is not in photos. You must retake this photo without them.`
        );
        setTimeout(() => setDeclinedToast(''), 5000);
      }
      // Already tagged — tapping again does nothing (retake is the only exit)
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  /* ── Save ── */

  function handleSave() {
    const taggedChildren = selectedIds.map((id) => childrenList.find((c) => c.id === id)).filter(Boolean);

    // Build pendingConsent: awaiting-family children + cross-parent tagged children without autoApprove
    const pendingIds = taggedChildren
      .filter((c) => c.consentStatus === 'pending' || c.consentStatus === 'unlinked')
      .map((c) => c.id);

    const extraPending = [];
    if (user?.role === 'parent') {
      const myChildIds = user.childIds ?? [];
      taggedChildren.forEach((c) => {
        if (!myChildIds.includes(c.id) && !c.autoApproveTagging && !pendingIds.includes(c.id)) {
          extraPending.push(c.id);
        }
      });
    }

    const allPendingIds = [...new Set([...pendingIds, ...extraPending])];

    setSaving(true);
    addPortrait({
      id:             `p${Date.now()}`,
      taggedIds:      selectedIds,
      date:           new Date().toISOString().split('T')[0],
      notes:          notes.trim(),
      photoUrl:       captured,
      source:         user?.role === 'parent' ? 'parent' : 'school',
      eventTag:       eventTag || null,
      pendingConsent: allPendingIds,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => navigate('/dashboard'), 1800);
  }

  /* ── Render ── */

  return (
    <div className="h-dvh bg-indigo-950 flex flex-col overflow-hidden">

      {/* ── Capture tip interstitial (once per session) ── */}
      {!captured && showTipInterstitial && (
        <CaptureSessionTip tip={sessionTip} onDismiss={dismissTipInterstitial} />
      )}

      {/* ── Declined child floating toast ── */}
      {declinedToast && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-rose-900 text-white rounded-2xl px-4 py-4 shadow-2xl flex items-start gap-3">
          <Ban size={18} className="flex-shrink-0 text-rose-300" />
          <p className="font-bold text-sm leading-snug">{declinedToast}</p>
        </div>
      )}

      {/* ── Saved toast ── */}
      {saved && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-indigo-900/95 backdrop-blur-sm text-white rounded-3xl px-10 py-7 text-center shadow-2xl">
            <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={28} className="text-white" strokeWidth={3} />
            </div>
            <p className="font-black text-xl">Saved!</p>
            <p className="text-indigo-300 font-semibold text-sm mt-1">Added to timeline</p>
          </div>
        </div>
      )}

      {/* ── Viewfinder / preview area ── */}
      <div
        className={`relative w-full bg-black overflow-hidden ${captured ? 'flex-shrink-0' : 'flex-1 min-h-0'}`}
        style={captured ? { maxHeight: '28vh' } : undefined}
      >
        {!captured ? (
          <>
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                <p className="text-white/60 font-semibold text-sm">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-rose-500 rounded-2xl px-5 py-3 font-black text-white flex items-center gap-2 shadow-lg"
                >
                  <Upload size={18} /> Choose from Gallery
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                <FramingRules />
              </>
            )}

            <button
              onClick={() => { stopCamera(); navigate('/dashboard'); }}
              className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-2xl flex items-center justify-center text-white z-10"
            >
              <ArrowLeft size={20} />
            </button>

            {!cameraError && (
              <button
                onClick={flipCamera}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-2xl flex items-center justify-center text-white z-10"
              >
                <SwitchCamera size={18} />
              </button>
            )}
          </>
        ) : (
          <>
            <img src={captured} alt="Captured" className="w-full h-full object-cover" />
            <button
              onClick={() => navigate('/dashboard')}
              className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-2xl flex items-center justify-center text-white"
            >
              <ArrowLeft size={20} />
            </button>
          </>
        )}
      </div>

      {/* ── Shutter controls ── */}
      {!captured && !cameraError && (
        <div className="flex items-center justify-center gap-8 pt-4 bg-indigo-950 flex-shrink-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform"
            aria-label="Upload from gallery"
          >
            <Upload size={20} />
          </button>
          <button
            onClick={handleCapture}
            className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-900 active:scale-90 transition-transform border-4 border-white/25"
            aria-label="Capture photo"
          >
            <Camera size={30} className="text-white" />
          </button>
          <div className="w-12 h-12" />
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* ── Post-capture form ── */}
      {captured && (
        <div className="bg-amber-50 rounded-t-3xl flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-6">
          {/* Header — Retake becomes the primary CTA when a declined child is locked in */}
          {(() => {
            const hasDeclined = selectedIds.some((id) => {
              const c = childrenList.find((ch) => ch.id === id);
              return c?.consentStatus === 'declined';
            });
            return (
              <div className={`flex items-center justify-between mb-3 ${hasDeclined ? 'flex-col gap-3' : ''}`}>
                <h2 className="font-black text-xl text-indigo-900 self-start">New Portrait</h2>
                {hasDeclined ? (
                  <button
                    onClick={handleRetake}
                    className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white rounded-2xl px-4 py-3.5 font-black text-base shadow-lg shadow-rose-200 active:scale-95 transition-transform"
                  >
                    <RotateCcw size={16} /> Retake photo without them
                  </button>
                ) : (
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-1.5 bg-white rounded-2xl px-3.5 py-2 text-indigo-500 font-bold text-sm shadow-sm active:scale-95 transition-transform"
                  >
                    <RotateCcw size={14} /> Retake
                  </button>
                )}
              </div>
            );
          })()}

          {/* Child checkboxes */}
          {(() => {
            const hasDeclined = selectedIds.some((id) => {
              const c = childrenList.find((ch) => ch.id === id);
              return c?.consentStatus === 'declined';
            });
            return (
              <div className="mb-3">
                <p className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
                  Who's in this photo?
                </p>
                <input
                  type="text"
                  value={childSearch}
                  onChange={(e) => setChildSearch(e.target.value)}
                  placeholder="Search children…"
                  className="w-full mb-2.5 px-3 py-2 rounded-xl bg-white border border-indigo-100 text-sm font-semibold text-indigo-900 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  {[...childrenList]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .filter((child) => child.name.toLowerCase().includes(childSearch.toLowerCase()))
                    .map((child) => {
                    const checked    = selectedIds.includes(child.id);
                    const status     = child.consentStatus ?? 'approved';
                    const info       = CONSENT_INFO[status] ?? CONSENT_INFO.approved;
                    const isDeclined = status === 'declined';
                    const lockedIn   = isDeclined && checked;
                    return (
                      <button
                        key={child.id}
                        onClick={() => toggleChild(child.id)}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 font-bold text-sm transition-all select-none ${
                          lockedIn
                            ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300 cursor-default'
                            : checked
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-200 active:scale-95'
                              : 'bg-white text-indigo-700 shadow-sm active:scale-95'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                            lockedIn ? 'border-white/50 bg-white/20' :
                            checked  ? 'border-white/60 bg-white/20' :
                                       'border-indigo-200'
                          }`}
                        >
                          {lockedIn
                            ? <X size={11} className="text-white" strokeWidth={3} />
                            : checked && <Check size={11} className="text-white" />}
                        </div>
                        <span className="flex-1 text-left truncate">{child.name}</span>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${info.dot}`} />
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-indigo-300 font-semibold mt-2 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />Photos approved</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Pending approval</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Photos declined</span>
                </p>
              </div>
            );
          })()}

          {/* Event tag picker */}
          <div className="mb-3">
            <p className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
              Event <span className="normal-case font-semibold">(optional)</span>
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
              {EVENT_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setEventTag((prev) => (prev === tag.id ? null : tag.id))}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                    eventTag === tag.id
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-white text-indigo-600 shadow-sm'
                  }`}
                >
                  <EventTagIcon tag={tag} />
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <p className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
              Notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe this friendship moment…"
              rows={2}
              className="w-full bg-white rounded-2xl px-4 py-2.5 text-indigo-900 font-semibold text-sm outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-indigo-300 resize-none shadow-sm"
            />
          </div>

          {/* Save */}
          {(() => {
            const hasDeclined = selectedIds.some((id) => {
              const c = childrenList.find((ch) => ch.id === id);
              return c?.consentStatus === 'declined';
            });
            return (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving || selectedIds.length === 0 || hasDeclined}
                  className="w-full bg-rose-500 text-white font-black text-lg rounded-2xl py-4 shadow-lg shadow-rose-200 active:scale-95 transition-transform disabled:opacity-40"
                >
                  {saving ? 'Saving…' : 'Save Portrait'}
                </button>
                {hasDeclined && (
                  <p className="text-center text-xs text-rose-500 font-bold mt-2.5">
                    Retake required — photo includes a child who is not in photos
                  </p>
                )}
                {!hasDeclined && selectedIds.length === 0 && (
                  <p className="text-center text-xs text-indigo-400 font-semibold mt-2.5">
                    Tag at least one child to save
                  </p>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
