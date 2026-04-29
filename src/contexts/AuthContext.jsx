import { createContext, useContext, useState, useCallback } from 'react';
import { ACCOUNTS } from '../data/seed';

const AuthContext = createContext(null);
const SESSION_KEY = 'pp_session';

function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredSession);

  const login = useCallback((email, password) => {
    const edu = ACCOUNTS.educators.find(
      (e) => e.email === email && e.password === password
    );
    if (edu) {
      const session = { email: edu.email, role: 'educator' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return true;
    }
    const parent = ACCOUNTS.parents.find(
      (p) => p.email === email && p.password === password
    );
    if (parent) {
      const session = {
        email: parent.email,
        role: 'parent',
        childIds: parent.childIds,
        name: parent.name,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
