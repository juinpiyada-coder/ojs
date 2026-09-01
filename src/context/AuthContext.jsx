import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUserFromStorage = () => {
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    const handleProfileUpdate = (e) => {
      if (e?.detail) {
        setUser(e.detail);
      } else {
        syncUserFromStorage();
      }
    };

    window.addEventListener('storage', syncUserFromStorage);
    window.addEventListener('user-profile-updated', handleProfileUpdate);

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(prev => {
            const current = prev || {};
            return {
              ...current,
              uid: firebaseUser.uid,
              email: firebaseUser.email || current.email,
              displayName: firebaseUser.displayName || current.display_name || current.displayName,
              photoURL: firebaseUser.photoURL || current.photo_url || current.avatar_url,
            };
          });
        }
        setLoading(false);
      });
    } catch (fbErr) {
      console.warn('Firebase auth listener error:', fbErr);
      setLoading(false);
    }

    return () => {
      window.removeEventListener('storage', syncUserFromStorage);
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  const logout = async () => {
    try {
      try {
        if (auth) {
          await firebaseSignOut(auth);
        }
      } catch (fbErr) {
        console.warn('Firebase signout skipped/failed:', fbErr);
      }
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: null }));
    }
    return { error: null };
  };

  const hasLocalAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const localUser = localStorage.getItem('user');
      return !!(token || localUser);
    } catch {
      return false;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user || hasLocalAuth(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
