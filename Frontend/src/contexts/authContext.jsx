import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../supabase"

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  const signUp = async (email, password, userData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Signup failed - no user returned');
      }

   
      if (authData.session && authData.user) {
        try {
  
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single();
          
          if (existingProfile) {

            await supabase
              .from('profiles')
              .update({
                first_name: userData.firstName.trim(),
                last_name: userData.lastName.trim(),
                email: email.toLowerCase().trim(),
                role: userData.role,
              })
              .eq('id', authData.user.id);
          } else {

            await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                first_name: userData.firstName.trim(),
                last_name: userData.lastName.trim(),
                email: email.toLowerCase().trim(),
                role: userData.role,
              });
          }
        } catch (profileErr) {

          console.warn('Profile creation failed, will be created on first login');
        }
      }

      return { data: authData, error: null };

    } catch (error) {

      if (error.message?.includes('User already registered')) {
        error.message = 'An account with this email already exists. Please try signing in instead.';
      } else if (error.message?.includes('Invalid email')) {
        error.message = 'Please enter a valid email address.';
      } else if (error.message?.includes('Password should be at least')) {
        error.message = 'Password must be at least 6 characters long.';
      } else if (error.status === 500) {
        error.message = 'Server error occurred. Please check your internet connection and try again.';
      } else if (!error.message) {
        error.message = 'An unexpected error occurred during signup.';
      }

      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          error.message = 'Invalid email or password. Please check your credentials and try again.';
        }
      }

      return { data, error };
    } catch (error) {
      throw error;
    }
  };


  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
      setProfile(null);
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error };
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  };


  useEffect(() => {

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        }
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getInitialSession();


    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {

          let profileData = await fetchProfile(session.user.id);
          

          if (!profileData) {
            try {
              const userData = session.user.user_metadata || {};
              
              await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  first_name: userData.first_name || '',
                  last_name: userData.last_name || '',
                  email: session.user.email,
                  role: userData.role || 'student',
                });
              
              profileData = await fetchProfile(session.user.id);
            } catch (profileError) {
            }
          }
          
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};