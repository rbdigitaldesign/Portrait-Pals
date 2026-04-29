import { createContext, useContext, useState, useCallback } from 'react';
import { ROOMS, CHILDREN, SEED_PORTRAITS } from '../data/seed';

const AppContext = createContext(null);
const PORTRAITS_KEY = 'pp_portraits';
const CHILDREN_KEY  = 'pp_children';

function loadOrSeed(key, seed) {
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

  return (
    <AppContext.Provider value={{ portraits, childrenList, rooms: ROOMS, addPortrait, addChild }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
