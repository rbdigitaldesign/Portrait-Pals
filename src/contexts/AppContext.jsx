import { createContext, useContext, useState, useCallback } from 'react';
import { ROOMS, CHILDREN, SEED_PORTRAITS, SEED_VERSION, ROOM_THRESHOLDS } from '../data/seed';

const AppContext = createContext(null);
const PORTRAITS_KEY     = 'pp_portraits';
const CHILDREN_KEY      = 'pp_children';
const VERSION_KEY       = 'pp_seed_version';
const AUDIT_KEY         = 'pp_audit_log';
const NOTIFICATIONS_KEY = 'pp_notifications';

function loadOrSeed(key, seed) {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (storedVersion !== SEED_VERSION) {
    localStorage.removeItem(PORTRAITS_KEY);
    localStorage.removeItem(CHILDREN_KEY);
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}

function writeAudit(action, detail) {
  try {
    const session = JSON.parse(localStorage.getItem('pp_session') || 'null');
    const entry = {
      ts:        new Date().toISOString(),
      userEmail: session?.email ?? 'unknown',
      role:      session?.role  ?? 'unknown',
      action,
      detail:    detail ?? '',
    };
    const existing = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
    existing.push(entry);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(existing));
  } catch { /* non-fatal */ }
}

function writeNotification(type, data) {
  try {
    const existing = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    existing.push({ id: `n${Date.now()}`, ts: new Date().toISOString(), type, read: false, ...data });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(existing));
  } catch { /* non-fatal */ }
}

export function calcRoomForAge(birthdate, today = new Date()) {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  const now   = typeof today === 'string' ? new Date(today) : today;
  let months  = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  for (const t of ROOM_THRESHOLDS) {
    if (months <= t.maxMonths) return t.roomId;
  }
  return ROOM_THRESHOLDS[ROOM_THRESHOLDS.length - 1].roomId;
}

export function AppProvider({ children }) {
  const [portraits,    setPortraits]    = useState(() => loadOrSeed(PORTRAITS_KEY, SEED_PORTRAITS));
  const [childrenList, setChildrenList] = useState(() => loadOrSeed(CHILDREN_KEY,  CHILDREN));

  const logAudit = useCallback((action, detail) => writeAudit(action, detail), []);

  const addPortrait = useCallback((portrait) => {
    setPortraits((prev) => {
      const next = [portrait, ...prev];
      localStorage.setItem(PORTRAITS_KEY, JSON.stringify(next));
      return next;
    });
    writeAudit('ADD_PORTRAIT', `Tagged: ${portrait.taggedIds.join(', ')}`);
  }, []);

  const addChild = useCallback((child) => {
    setChildrenList((prev) => {
      const next = [...prev, child];
      localStorage.setItem(CHILDREN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateChild = useCallback((childId, updates) => {
    setChildrenList((prev) => {
      const next = prev.map((c) => c.id === childId ? { ...c, ...updates } : c);
      localStorage.setItem(CHILDREN_KEY, JSON.stringify(next));
      return next;
    });
    writeAudit('UPDATE_CHILD', `Child: ${childId}`);
  }, []);

  const deletePortrait = useCallback((portraitId) => {
    setPortraits((prev) => {
      const next = prev.filter((p) => p.id !== portraitId);
      localStorage.setItem(PORTRAITS_KEY, JSON.stringify(next));
      return next;
    });
    writeAudit('DELETE_PORTRAIT', `Portrait: ${portraitId}`);
  }, []);

  const approvePortraitForChild = useCallback((portraitId, childId) => {
    setPortraits((prev) => {
      const next = prev.map((p) => {
        if (p.id !== portraitId) return p;
        return { ...p, pendingConsent: (p.pendingConsent ?? []).filter((id) => id !== childId) };
      });
      localStorage.setItem(PORTRAITS_KEY, JSON.stringify(next));
      return next;
    });
    writeAudit('CONSENT_GRANTED', `Portrait: ${portraitId}, Child: ${childId}`);
  }, []);

  const declinePortraitForChild = useCallback((portraitId, childId) => {
    setPortraits((prev) => {
      const portrait = prev.find((p) => p.id === portraitId);
      const next = prev.map((p) => {
        if (p.id !== portraitId) return p;
        return {
          ...p,
          pendingConsent: (p.pendingConsent ?? []).filter((id) => id !== childId),
          declinedBy:     [...(p.declinedBy ?? []), childId],
        };
      });
      localStorage.setItem(PORTRAITS_KEY, JSON.stringify(next));

      // Notify all other tagged children's parents that the photo was declined
      if (portrait) {
        const otherChildIds = (portrait.taggedIds ?? []).filter((id) => id !== childId);
        if (otherChildIds.length > 0) {
          writeNotification('PHOTO_DECLINED', {
            portraitId,
            declinedByChildId: childId,
            recipientChildIds: otherChildIds,
          });
        }
      }

      return next;
    });
    writeAudit('CONSENT_DECLINED', `Portrait: ${portraitId}, Child: ${childId}`);
  }, []);

  // Admin only: remove a child from declinedBy so the portrait reappears on all timelines
  const reinstatePortrait = useCallback((portraitId) => {
    setPortraits((prev) => {
      const next = prev.map((p) => {
        if (p.id !== portraitId) return p;
        return { ...p, declinedBy: [] };
      });
      localStorage.setItem(PORTRAITS_KEY, JSON.stringify(next));
      return next;
    });
    writeAudit('PORTRAIT_REINSTATED', `Portrait: ${portraitId}`);
  }, []);

  return (
    <AppContext.Provider value={{
      portraits,
      childrenList,
      rooms: ROOMS,
      addPortrait,
      addChild,
      updateChild,
      deletePortrait,
      approvePortraitForChild,
      declinePortraitForChild,
      reinstatePortrait,
      logAudit,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
