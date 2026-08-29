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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
        await firebaseSignOut(auth);
      } catch (fbErr) {
        console.warn('Firebase signout skipped/failed:', fbErr);
      }
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: null }));
      return { error: null };
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { error: error.message };
    }
  };

  const hasLocalAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const localUser = localStorage.getItem('user');
      return !!(token || localUser);
    } catch (e) {
      return false;
    }
  };

  const value = {
    user,
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
