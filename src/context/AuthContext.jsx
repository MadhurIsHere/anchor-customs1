import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUser = (user) => {
    setCurrentUser(user);
    // Hardcoded admin check for Anchor Customs
    const adminEmail = 'karampreets090@gmail.com';
    const adminPhone = '+91XXXXXXXXXX'; // Replace with your actual phone number to enable admin access via phone

    if (user && (user.email?.toLowerCase() === adminEmail || user.phone === adminPhone)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const signInWithPhone = async (phone) => {
    return await supabase.functions.invoke('msg91-auth', {
      body: { action: 'send', phone }
    });
  };

  const verifyOtp = async (phone, token) => {
    const { data, error } = await supabase.functions.invoke('msg91-auth', {
      body: { action: 'verify', phone, otp: token }
    });

    if (!error && data?.success && data?.login_link) {
      const link = new URL(data.login_link);
      const tokenHash = link.searchParams.get('token_hash');
      return await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'magiclink'
      });
    }

    return { data, error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  const demoLogin = () => {
    const devUser = {
      id: '00000000-0000-0000-0000-000000000000',
      phone: '+919999999999',
      user_metadata: { full_name: 'Developer Admin' }
    };
    setCurrentUser(devUser);
    setIsAdmin(true);
    setLoading(false);
    toast.success('Developer Admin Access Granted!');
  };

  const value = {
    currentUser,
    isAdmin,
    signInWithPhone,
    verifyOtp,
    logout,
    demoLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
