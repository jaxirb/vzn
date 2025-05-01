import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { Profile } from '@/services/supabase'; // Import the Profile type

// Define the shape of the context state
interface ProfileContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  fetchProfile: () => Promise<Profile | null>; // Modified return type
  signOut: () => Promise<void>;
}

// Create the context with a default value
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Define props for the provider component
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Start loading initially

  // Fetch initial session and subscribe to auth changes
  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      // Don't fetch profile here yet, wait for auth state change or manual call
      // setLoading(false); // Loading finishes after profile fetch attempt
       console.log('[ProfileContext] Initial session set:', !!initialSession);
    }).catch(error => {
         console.error('[ProfileContext] Error fetching initial session:', error);
         setLoading(false); // Stop loading on error
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('[ProfileContext] Auth state changed:', _event, 'New Session:', !!newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (!newSession) {
            // If user logs out, clear profile and stop loading
            setProfile(null);
            setLoading(false);
        }
        // Profile fetch will be triggered by session change effect below
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Function to fetch profile data
  const fetchProfile = async (): Promise<Profile | null> => { // Modified return type
    if (!user) {
      console.log('[ProfileContext] fetchProfile skipped: No user');
      setProfile(null);
      setLoading(false);
      return null; // Return null when no user
    }
    
    console.log(`[ProfileContext] Attempting to fetch profile for user: ${user.id}`);
    setLoading(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<Profile>(); // Use the Profile type

      if (error && status !== 406) {
        console.error('[ProfileContext] Error fetching profile:', error);
        setProfile(null);
        return null; // Return null on error
      } else if (data) {
        console.log('[ProfileContext] Profile fetched successfully:', data);
        
        // --- Task B4.2: Client-side Streak Check --- //
        let profileDataToSet = data; // Start with fetched data
        if (data.last_session_timestamp) {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          const lastTimestamp = new Date(data.last_session_timestamp);
          const lastSessionDate = new Date(lastTimestamp.getFullYear(), lastTimestamp.getMonth(), lastTimestamp.getDate());

          // If the last session was before yesterday, reset streak locally
          if (lastSessionDate.getTime() < yesterday.getTime()) {
            console.log(`[ProfileContext] Streak broken! Last session (${lastSessionDate.toISOString()}) was before yesterday (${yesterday.toISOString()}). Resetting local streak to 0.`);
            profileDataToSet = { ...data, streak: 0 };
          } else {
            console.log(`[ProfileContext] Streak maintained. Last session (${lastSessionDate.toISOString()}) was not before yesterday (${yesterday.toISOString()}).`);
          }
        } else {
            // If no last session timestamp exists and streak is > 0, reset it.
            if (data.streak > 0) {
                console.log(`[ProfileContext] No last session timestamp found, resetting local streak from ${data.streak} to 0.`);
                profileDataToSet = { ...data, streak: 0 };
            } else {
                console.log(`[ProfileContext] No last session timestamp, streak is already 0.`);
            }
        }
        // Set the potentially modified profile data to state
        setProfile(profileDataToSet);
        // --- End Task B4.2 --- //

        return profileDataToSet; // Return the fetched (and potentially modified) profile

      } else {
        console.log('[ProfileContext] No profile found, user might be new or trigger failed.');
        setProfile(null); // Ensure profile is null if not found
        return null; // Return null if not found
      }
    } catch (error) { 
      console.error('[ProfileContext] Exception during profile fetch:', error);
      setProfile(null);
      return null; // Return null on exception
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile when user object changes (i.e., on login)
  useEffect(() => {
    if (user) {
      fetchProfile(); 
    } else {
        // No user, ensure profile is cleared
        setProfile(null);
        setLoading(false);
    }
  }, [user]); // Dependency on user object

  // Sign out function
  const signOut = async () => {
      setLoading(true);
      console.log('[ProfileContext] Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
          console.error('[ProfileContext] Error signing out:', error);
      } else {
          console.log('[ProfileContext] Sign out successful.');
          // Auth listener will handle setting session/user/profile to null
      }
      // Loading state will be handled by the auth listener effect setting profile to null
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    session,
    user,
    profile,
    loading,
    fetchProfile,
    signOut,
  // IMPORTANT: fetchProfile is a function reference, adding it to dependencies is usually unnecessary 
  // unless the function identity itself changes, which it doesn't here. Including it can cause 
  // infinite loops if not careful. We'll rely on user/session changes to trigger context updates.
  }), [session, user, profile, loading]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the ProfileContext
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 