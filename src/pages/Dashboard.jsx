import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Plus, X, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

/* ─── helpers ─────────────────────────────────────────────────────────── */

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/* ─── ChildChip ───────────────────────────────────────────────────────── */

function ChildChip({ child, active, onClick, isParent }) {
  const ring = isParent
    ? 'ring-teal-400 bg-teal-500'
    : 'ring-rose-400 bg-rose-500';
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 flex-shrink-0"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md transition-all ${
          active ? `${ring} ring-4 ring-offset-2 ring-offset-amber-50` : 'bg-indigo-200'
        }`}
      >
        {initials(child.name)}
      </div>
      <span className="text-xs font-bold text-indigo-700 w-16 text-center leading-tight">
        {child.name}
      </span>
    </button>
  );
}

/* ─── PortraitCard ────────────────────────────────────────────────────── */

function PortraitCard({ portrait, childrenList, onClick }) {
  const tagged = portrait.taggedIds
    .map((id) => childrenList.find((c) => c.id === id))
    .filter(Boolean);
  const names   = tagged.map((c) => c.name).join(' & ') || 'Unnamed';
  const dateStr = formatDate(portrait.date);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-3xl shadow-lg shadow-indigo-100 overflow-hidden active:scale-95 transition-transform text-left w-full"
    >
      <div className="aspect-[4/3] bg-indigo-100 overflow-hidden">
        <img
          src={portrait.photoUrl}
          alt={names}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3.5">
        <p className="font-black text-indigo-900 text-sm leading-tight">{names}</p>
        <p className="text-indigo-400 text-xs font-semibold mt-0.5">{dateStr}</p>
        {portrait.notes ? (
          <p className="text-indigo-600 text-xs mt-1.5 leading-snug line-clamp-2">
            {portrait.notes}
          </p>
        ) : null}
      </div>
    </button>
  );
}

/* ─── AddChildModal ───────────────────────────────────────────────────── */

function AddChildModal({ rooms, onClose, onAdd }) {
  const [name,   setName]   = useState('');
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ id: `c${Date.now()}`, name: trimmed, roomId });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-4 pb-6">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-xl text-indigo-900">Add Child</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-indigo-400"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
              First name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Child's first name"
              required
              className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-indigo-300"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">
              Room
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 text-indigo-900 font-semibold outline-none focus:ring-2 focus:ring-rose-400 appearance-none"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-rose-500 text-white font-black text-base rounded-2xl py-4 shadow-lg shadow-rose-200 active:scale-95 transition-transform mt-2"
          >
            Add Child
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────────────── */

export default function Dashboard() {
  const { user, logout }                  = useAuth();
  const { portraits, childrenList, rooms, addChild } = useApp();
  const navigate                          = useNavigate();

  const isEducator = user?.role === 'educator';
  const displayName = isEducator ? 'Educator' : (user?.name ?? 'Parent');

  const [selectedRoom,    setSelectedRoom]    = useState('all');
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [showAddChild,    setShowAddChild]    = useState(false);

  /* Children visible in the strip */
  const visibleChildren = isEducator
    ? childrenList.filter((c) => selectedRoom === 'all' || c.roomId === selectedRoom)
    : childrenList.filter((c) => (user?.childIds ?? []).includes(c.id));

  /* Portraits visible in the grid */
  const filteredPortraits = portraits.filter((p) => {
    const inView = p.taggedIds.some((id) => visibleChildren.some((c) => c.id === id));
    if (!inView) return false;
    if (selectedChildId) return p.taggedIds.includes(selectedChildId);
    return true;
  });

  function openSlideshow(index) {
    navigate('/slideshow', { state: { portraits: filteredPortraits, startIndex: index } });
  }

  function toggleChildFilter(childId) {
    setSelectedChildId((prev) => (prev === childId ? null : childId));
  }

  function handleRoomChange(roomId) {
    setSelectedRoom(roomId);
    setSelectedChildId(null);
  }

  /* Portrait count label */
  const filterLabel = selectedChildId
    ? `${childrenList.find((c) => c.id === selectedChildId)?.name ?? ''}'s Portraits`
    : 'Friendship Portraits';

  return (
    <div className="min-h-screen bg-amber-50 pb-28">

      {/* ── Header ── */}
      <div className="bg-white shadow-sm shadow-indigo-50 px-5 pt-safe pt-4 pb-4 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-indigo-900 leading-tight">Portrait Pals</h1>
            <p className={`text-xs font-extrabold mt-0.5 ${isEducator ? 'text-rose-500' : 'text-teal-500'}`}>
              {displayName}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-amber-50 rounded-2xl px-3.5 py-2.5 text-indigo-400 font-bold text-sm active:scale-95 transition-transform"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">

        {/* ── Room tabs (educator only) ── */}
        {isEducator && (
          <div className="flex gap-2 pt-5 pb-1 overflow-x-auto scrollbar-none -mx-1 px-1">
            {['all', ...rooms.map((r) => r.id)].map((roomId) => {
              const label =
                roomId === 'all'
                  ? 'All Rooms'
                  : rooms.find((r) => r.id === roomId)?.name ?? roomId;
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
        )}

        {/* ── Children strip ── */}
        <div
          className={`flex gap-4 overflow-x-auto scrollbar-none -mx-1 px-1 ${
            isEducator ? 'pt-4 pb-2' : 'pt-5 pb-2'
          }`}
        >
          {visibleChildren.map((child) => (
            <ChildChip
              key={child.id}
              child={child}
              active={!selectedChildId || selectedChildId === child.id}
              onClick={() => toggleChildFilter(child.id)}
              isParent={!isEducator}
            />
          ))}

          {/* Add child button — educator only */}
          {isEducator && (
            <button
              onClick={() => setShowAddChild(true)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-rose-300 flex items-center justify-center text-rose-400 active:scale-95 transition-transform">
                <Plus size={22} />
              </div>
              <span className="text-xs font-bold text-rose-400 w-16 text-center leading-tight">
                Add Child
              </span>
            </button>
          )}
        </div>

        {/* ── Section heading ── */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <h2 className="font-black text-lg text-indigo-900">{filterLabel}</h2>
          <span className="text-xs font-bold text-indigo-400 bg-white px-3 py-1.5 rounded-full shadow-sm">
            {filteredPortraits.length}
          </span>
        </div>

        {/* ── Portrait grid ── */}
        {filteredPortraits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mb-4">
              <Users size={34} className="text-rose-300" />
            </div>
            <p className="font-black text-indigo-900 text-lg">No portraits yet</p>
            <p className="text-indigo-400 text-sm font-semibold mt-1 max-w-xs">
              {isEducator
                ? 'Tap the camera button to capture a friendship moment.'
                : 'No friendship portraits have been shared yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredPortraits.map((portrait, index) => (
              <PortraitCard
                key={portrait.id}
                portrait={portrait}
                childrenList={childrenList}
                onClick={() => openSlideshow(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FAB: capture (educator only) ── */}
      {isEducator && (
        <button
          onClick={() => navigate('/capture')}
          className="fixed bottom-6 right-5 w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-300 active:scale-95 transition-transform z-30"
          aria-label="Capture portrait"
        >
          <Camera size={28} className="text-white" />
        </button>
      )}

      {/* ── Add child modal ── */}
      {showAddChild && (
        <AddChildModal
          rooms={rooms}
          onClose={() => setShowAddChild(false)}
          onAdd={addChild}
        />
      )}
    </div>
  );
}
