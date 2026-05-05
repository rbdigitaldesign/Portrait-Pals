import { createContext, useContext, useState, useCallback } from 'react';
import { ACCOUNTS } from '../data/seed';

const AuthContext = createContext(null);
const SESSION_KEY = 'pp_session';
const AUDIT_KEY   = 'pp_audit_log';

function logAuthAudit(action, email, role) {
  try {
    const entry = {
      ts:        new Date().toISOString(),
      userEmail: email ?? 'unknown',
      role:      role  ?? 'unknown',
      action,
      detail:    '',
    };
    const existing = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
    existing.push(entry);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(existing));
  } catch { /* non-fatal */ }
}

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
    const admin = ACCOUNTS.admin?.find((a) => a.email === email && a.password === password);
    if (admin) {
      const session = { email: admin.email, role: 'admin', name: admin.name };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      logAuthAudit('LOGIN', admin.email, 'admin');
      return { ok: true, role: 'admin' };
    }

    const edu = ACCOUNTS.educators.find((e) => e.email === email && e.password === password);
    if (edu) {
      const session = { email: edu.email, role: 'educator', name: edu.name };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      logAuthAudit('LOGIN', edu.email, 'educator');
      return { ok: true, role: 'educator' };
    }

    const parent = ACCOUNTS.parents.find((p) => p.email === email && p.password === password);
    if (parent) {
      const session = {
        email:    parent.email,
        role:     'parent',
        childIds: parent.childIds,
        name:     parent.name,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      logAuthAudit('LOGIN', parent.email, 'parent');
      return { ok: true, role: 'parent' };
    }

    return { ok: false };
  }, []);

  const logout = useCallback(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (session) logAuthAudit('LOGOUT', session.email, session.role);
    } catch { /* non-fatal */ }
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const addChildToSession = useCallback((childId) => {
    setUser((prev) => {
      if (!prev || prev.role !== 'parent') return prev;
      const updated = { ...prev, childIds: [...(prev.childIds ?? []), childId] };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, addChildToSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
