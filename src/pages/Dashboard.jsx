import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Plus, X, Users, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

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

/* ═══════════════════════════════════════════════════════════════════════
   PARENT TIMELINE
   ═══════════════════════════════════════════════════════════════════════ */

function TimelineEntry({ portrait, activeChildId, childrenList, onClick }) {
  const friends = portrait.taggedIds
    .filter((id) => id !== activeChildId)
    .map((id) => childrenList.find((c) => c.id === id))
    .filter(Boolean);

  const label   = friends.length > 0
    ? `With ${friends.map((f) => f.name).join(' & ')}`
    : 'A special moment';
  const dateStr = formatDateShort(portrait.date);

  return (
    <div className="flex gap-3">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center w-12 flex-shrink-0">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <Camera size={17} className="text-indigo-500" />
        </div>
        <div className="w-0.5 bg-indigo-100 flex-1 mt-1 mb-1" />
      </div>

      {/* Card */}
      <button
        onClick={onClick}
        className="flex-1 bg-white rounded-3xl shadow-md shadow-indigo-100 overflow-hidden text-left mb-5 active:scale-[0.98] transition-transform"
      >
        {/* Header row */}
        <div className="px-4 pt-4 pb-2.5 flex items-start justify-between gap-2">
          <h3 className="font-black text-indigo-900 text-base leading-tight">{label}</h3>
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            <span className="bg-amber-100 text-amber-600 font-extrabold text-[10px] px-2.5 py-1 rounded-full">
              School
            </span>
            <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full">
              {dateStr}
            </span>
          </div>
        </div>

        {/* Photo */}
        <div className="aspect-[4/3] overflow-hidden bg-indigo-100">
          <img
            src={portrait.photoUrl}
            alt={label}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Notes */}
        {portrait.notes ? (
          <p className="px-4 py-3.5 text-indigo-700 text-sm font-medium leading-snug">
            {portrait.notes}
          </p>
        ) : (
          <div className="py-3" />
        )}
      </button>
    </div>
  );
}

function ParentTimeline({ user, portraits, childrenList, logout, addChild, addChildToSession }) {
  const navigate       = useNavigate();
  const { rooms }      = useApp();
  const parentChildren = childrenList.filter((c) => (user.childIds ?? []).includes(c.id));
  const [activeId,         setActiveId]         = useState(parentChildren[0]?.id ?? null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [showAddChild,     setShowAddChild]      = useState(false);

  const activeChild = childrenList.find((c) => c.id === activeId);

  // All portraits featuring the active child, newest first
  const childPortraits = portraits
    .filter((p) => p.taggedIds.includes(activeId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Unique friends who appear alongside the active child
  const friends = childrenList.filter((c) => {
    if (c.id === activeId) return false;
    return childPortraits.some((p) => p.taggedIds.includes(c.id));
  });

  // Apply friend filter
  const displayPortraits = selectedFriendId
    ? childPortraits.filter((p) => p.taggedIds.includes(selectedFriendId))
    : childPortraits;

  const avatarUrl = activeChild.photoUrl ?? childPortraits[0]?.photoUrl ?? null;

  function playTimeline() {
    if (displayPortraits.length === 0) return;
    navigate('/slideshow', { state: { portraits: displayPortraits, startIndex: 0 } });
  }

  function toggleFriend(id) {
    setSelectedFriendId((prev) => (prev === id ? null : id));
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-indigo-900 leading-tight">{activeChild.name}</h1>
            <p className="text-xs font-extrabold text-teal-500 uppercase tracking-widest mt-0.5">
              Parent Timeline
            </p>
          </div>
          <button
            onClick={logout}
            className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-indigo-400 active:scale-90 transition-transform"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Child switcher + add child */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none">
          {parentChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => setActiveId(child.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                activeId === child.id
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-amber-50 text-indigo-600'
              }`}
            >
              {child.name}
            </button>
          ))}
          <button
            onClick={() => setShowAddChild(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-sm text-teal-500 bg-teal-50 active:scale-95 transition-transform"
          >
            <Plus size={15} /> Add Child
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* ── Hero card ── */}
        <div className="bg-white rounded-3xl shadow-lg shadow-indigo-100 p-6 mb-6 text-center">
          {/* Avatar */}
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

        {/* ── Friend filter strip ── */}
        {friends.length > 0 && (
          <div className="mb-5">
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
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-base shadow-md transition-all ${
                      active
                        ? 'bg-teal-500 ring-4 ring-offset-2 ring-offset-amber-50 ring-teal-300'
                        : 'bg-indigo-200'
                    }`}>
                      {initials(friend.name)}
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
                className="mt-3 text-xs font-bold text-teal-500 underline underline-offset-2"
              >
                Show all memories
              </button>
            )}
          </div>
        )}

        {/* ── Timeline feed ── */}
        {displayPortraits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-3xl flex items-center justify-center mb-4">
              <Camera size={28} className="text-teal-400" />
            </div>
            <p className="font-black text-indigo-900 text-lg">
              {selectedFriendId ? `No moments with ${friends.find(f => f.id === selectedFriendId)?.name} yet` : 'No memories yet'}
            </p>
            <p className="text-indigo-400 text-sm font-semibold mt-1 max-w-xs">
              Tap Add Memory below to capture {activeChild.name}'s first friendship moment.
            </p>
          </div>
        ) : (
          <div>
            {displayPortraits.map((portrait, index) => (
              <TimelineEntry
                key={portrait.id}
                portrait={portrait}
                activeChildId={activeId}
                childrenList={childrenList}
                onClick={() =>
                  navigate('/slideshow', {
                    state: { portraits: displayPortraits, startIndex: index },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Add child modal */}
      {showAddChild && (
        <AddChildModal
          rooms={rooms}
          onClose={() => setShowAddChild(false)}
          onAdd={(child) => {
            addChild(child);
            addChildToSession(child.id);
            setActiveId(child.id);
          }}
        />
      )}

      {/* ── Sticky: Add Memory ── */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-safe pb-6 pt-4 z-20 bg-gradient-to-t from-amber-50 via-amber-50/90 to-transparent">
        <button
          onClick={() => navigate('/capture')}
          className="w-full bg-teal-500 text-white font-black text-lg rounded-2xl py-4 flex items-center justify-center gap-2.5 shadow-xl shadow-teal-200 active:scale-95 transition-transform"
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

function ChildChip({ child, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md transition-all ${
          active
            ? 'bg-rose-500 ring-4 ring-offset-2 ring-offset-amber-50 ring-rose-300'
            : 'bg-indigo-200'
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

function PortraitCard({ portrait, childrenList, onClick }) {
  const tagged  = portrait.taggedIds.map((id) => childrenList.find((c) => c.id === id)).filter(Boolean);
  const names   = tagged.map((c) => c.name).join(' & ') || 'Unnamed';
  const dateStr = formatDate(portrait.date);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-3xl shadow-lg shadow-indigo-100 overflow-hidden active:scale-95 transition-transform text-left w-full"
    >
      <div className="aspect-[4/3] bg-indigo-100 overflow-hidden">
        <img src={portrait.photoUrl} alt={names} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-3.5">
        <p className="font-black text-indigo-900 text-sm leading-tight">{names}</p>
        <p className="text-indigo-400 text-xs font-semibold mt-0.5">{dateStr}</p>
        {portrait.notes ? (
          <p className="text-indigo-600 text-xs mt-1.5 leading-snug line-clamp-2">{portrait.notes}</p>
        ) : null}
      </div>
    </button>
  );
}

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
          <button onClick={onClose} className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-indigo-400">
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
                <option key={r.id} value={r.id}>{r.name}</option>
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

function EducatorDashboard({ user, portraits, childrenList, rooms, addChild, logout }) {
  const navigate = useNavigate();
  const [selectedRoom,    setSelectedRoom]    = useState('all');
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [showAddChild,    setShowAddChild]    = useState(false);

  const visibleChildren = childrenList.filter(
    (c) => selectedRoom === 'all' || c.roomId === selectedRoom
  );

  const filteredPortraits = portraits.filter((p) => {
    const inView = p.taggedIds.some((id) => visibleChildren.some((c) => c.id === id));
    if (!inView) return false;
    if (selectedChildId) return p.taggedIds.includes(selectedChildId);
    return true;
  });

  function openSlideshow(index) {
    navigate('/slideshow', { state: { portraits: filteredPortraits, startIndex: index } });
  }

  function handleRoomChange(roomId) {
    setSelectedRoom(roomId);
    setSelectedChildId(null);
  }

  const sectionLabel = selectedChildId
    ? `${childrenList.find((c) => c.id === selectedChildId)?.name ?? ''}'s Portraits`
    : 'Friendship Portraits';

  return (
    <div className="min-h-screen bg-amber-50 pb-28">
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

        {/* Section heading */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <h2 className="font-black text-lg text-indigo-900">{sectionLabel}</h2>
          <span className="text-xs font-bold text-indigo-400 bg-white px-3 py-1.5 rounded-full shadow-sm">
            {filteredPortraits.length}
          </span>
        </div>

        {/* Portrait grid */}
        {filteredPortraits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mb-4">
              <Users size={34} className="text-rose-300" />
            </div>
            <p className="font-black text-indigo-900 text-lg">No portraits yet</p>
            <p className="text-indigo-400 text-sm font-semibold mt-1 max-w-xs">
              Tap the camera button to capture a friendship moment.
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

      {/* Sticky bottom: Capture Portrait */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-safe pb-6 pt-4 z-20 bg-gradient-to-t from-amber-50 via-amber-50/90 to-transparent">
        <button
          onClick={() => navigate('/capture')}
          className="w-full bg-rose-500 text-white font-black text-lg rounded-2xl py-4 flex items-center justify-center gap-2.5 shadow-xl shadow-rose-200 active:scale-95 transition-transform"
        >
          <Camera size={20} />
          Capture Portrait
        </button>
      </div>

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

/* ═══════════════════════════════════════════════════════════════════════
   ROOT DASHBOARD — routes to the right view based on role
   ═══════════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const { user, logout, addChildToSession }          = useAuth();
  const { portraits, childrenList, rooms, addChild } = useApp();

  if (user?.role === 'parent') {
    return (
      <ParentTimeline
        user={user}
        portraits={portraits}
        childrenList={childrenList}
        logout={logout}
        addChild={addChild}
        addChildToSession={addChildToSession}
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
      logout={logout}
    />
  );
}
