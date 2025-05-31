import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: 'job_seeker' | 'recruiter') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Sign in error:', JSON.stringify(error, null, 2));
    } else {
      console.log('Sign in successful');
    }
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'job_seeker' | 'recruiter'
  ) => {
    console.log('Attempting to sign up with:', JSON.stringify({ email, password, fullName, role }, null, 2));

    // Validate inputs
    if (!password || password.length < 6) {
      const error = { message: 'Password must be at least 6 characters.' };
      console.error('Sign up error:', JSON.stringify(error, null, 2));
      return { error };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = { message: 'Invalid email format.' };
      console.error('Sign up error:', JSON.stringify(error, null, 2));
      return { error };
    }
    if (!fullName || fullName.trim().length === 0) {
      const error = { message: 'Full name is required.' };
      console.error('Sign up error:', JSON.stringify(error, null, 2));
      return { error };
    }

    // Perform signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Sign up error:', JSON.stringify(error, null, 2));
      return { error };
    }

    const user = data.user;

    // Set session to authenticate the user for profile insertion
    if (data.session) {
      await supabase.auth.setSession(data.session);
      setSession(data.session);
      setUser(user);
    }

    // Insert profile into 'profiles' table
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        email: email, // Required by schema
        full_name: fullName,
        role: role,
      },
    ]);

    if (insertError) {
      console.error('Insert profile error:', JSON.stringify({ message: insertError.message, code: insertError.code, details: insertError.details }, null, 2));
      return { error: { message: `Failed to create profile: ${insertError.message}` } };
    }

    console.log('Sign up successful with role:', role);
    return { error: null };
  };

  const signOut = async () => {
    console.log('Signing out');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
