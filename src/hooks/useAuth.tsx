import React, {createContext, useContext, useEffect, useState} from 'react';
import {authService} from '../services/authService';
import {User} from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    authService.getCurrentUser()
      .then(currentUser => {
        setUser(currentUser);
        setLoading(false);
      })
      .catch(error => {
        console.error('Auth initialization error:', error);
        setUser(null);
        setLoading(false);
      });

    // Listen for auth changes
    const {data: subscription} = authService.onAuthStateChange(user => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await authService.signIn(email, password);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return {success: response.success, error: response.error};
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
