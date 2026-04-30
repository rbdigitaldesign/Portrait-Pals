import { createContext, useContext, useState, useCallback } from 'react';
import { ROOMS, CHILDREN, SEED_PORTRAITS, SEED_VERSION } from '../data/seed';

const AppContext = createContext(null);
const PORTRAITS_KEY = 'pp_portraits';
const CHILDREN_KEY  = 'pp_children';
const VERSION_KEY   = 'pp_seed_version';

function loadOrSeed(key, seed) {
  // If the seed version has changed, wipe stored data so new seed takes effect.
  // User-captured portraits added via the camera are intentionally cleared too —
  // this is prototype behaviour; a production app would merge instead.
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

export function AppProvider({ children }) {
  const [portraits,    setPortraits]    = useState(() => loadOrSeed(PORTRAITS_KEY, SEED_PORTRAITS));
  const [childrenList, setChildrenList] = useState(() => loadOrSeed(CHILDREN_KEY,  CHILDREN));

  const addPortrait = useCallback((portrait) => {
    setPortraits((prev) => {
      const next = [portrait, ...prev];
      localStorage.setItem(PORTRAITS_KEY, JSON.stringify(next));
      return next;
    });
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
  }, []);

  return (
    <AppContext.Provider value={{ portraits, childrenList, rooms: ROOMS, addPortrait, addChild, updateChild }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
