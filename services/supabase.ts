import 'react-native-url-polyfill/auto'; // Required for Supabase to work in React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
// Remove @env import
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'; 
// Import Constants from expo-constants
import Constants from 'expo-constants';
import { AppState } from 'react-native';

// Access variables from Constants
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. Make sure they are set in your app.json extra field.'
  );
  // Consider throwing an error in production if these are critical
  // throw new Error('Supabase environment variables are not set.');
}

// Initialize client (use empty strings as fallback to satisfy createClient types if vars are missing)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href
  },
}); 

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is registered, you will
// see Supabase support automatically refreshing the session if the
// user is signed in.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Define a type for the profile data
export type Profile = {
  id: string; // UUID linked to auth.users
  onboarding_completed: boolean;
  xp: number;
  level: number;
  streak: number;
  // Add other profile fields here as needed
};

/**
 * Fetches the complete profile for the currently logged-in user.
 * Returns the profile data or null if not found or not logged in.
 * Logs errors to the console.
 */
export const getProfile = async (): Promise<Profile | null> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[getProfile] Error getting session:', sessionError);
    return null;
  }

  if (!session?.user) {
    console.log('[getProfile] No user session found.');
    return null;
  }

  const userId = session.user.id;
  
  try {
    console.log(`[getProfile] Fetching profile for user: ${userId}`);
    const { data, error, status } = await supabase
      .from('profiles')
      .select('*') // Select all columns
      .eq('id', userId)
      .single(); // Expect one row

    if (error && status !== 406) { // 406: Not acceptable (usually means no rows found)
      console.error('[getProfile] Error fetching profile:', error);
      throw error; // Re-throw other errors
    }

    if (data) {
      console.log(`[getProfile] Profile found for user: ${userId}`, data);
      return data as Profile; // Cast to Profile type
    } else {
      console.log(`[getProfile] No profile found for user: ${userId} (Status: ${status})`);
      // This case should ideally not happen if the handle_new_user trigger works
      return null;
    }
  } catch (error) {
    console.error('[getProfile] Exception during profile fetch:', error);
    return null;
  }
};

/**
 * Updates specific fields in the profile for the currently logged-in user.
 * @param updates An object containing the profile fields to update.
 * @returns The updated profile data or null if update fails or not logged in.
 */
export const updateProfile = async (updates: Partial<Omit<Profile, 'id'>>): Promise<Profile | null> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[updateProfile] Error getting session:', sessionError);
    return null;
  }

  if (!session?.user) {
    console.log('[updateProfile] No user session found.');
    return null;
  }

  const userId = session.user.id;
  console.log(`[updateProfile] Attempting to update profile for user: ${userId} with data:`, updates);

  try {
    // Perform the update
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select() // Select the updated row
      .single(); // Expect one row to be returned

    if (updateError) {
      console.error('[updateProfile] Error updating profile:', updateError);
      throw updateError; // Re-throw error
    }

    if (updateData) {
      console.log(`[updateProfile] Profile updated successfully for user: ${userId}`, updateData);
      return updateData as Profile;
    } else {
      // This case should ideally not happen if the user exists
      console.warn(`[updateProfile] Update seemed successful but no data returned for user: ${userId}`);
      return null;
    }
  } catch (error) { 
    // Catch re-thrown error or other exceptions
    console.error('[updateProfile] Exception during profile update:', error);
    return null;
  }
};

/**
 * Marks the current user's onboarding as complete in the database.
 * Throws an error if no user is logged in or if the update fails.
 */
export const markOnboardingComplete = async (): Promise<void> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Error getting session:', sessionError);
    throw new Error('Failed to get user session.');
  }

  if (!session?.user) {
    throw new Error('No user logged in to mark onboarding complete.');
  }

  const userId = session.user.id;
  console.log(`Attempting to mark onboarding complete for user: ${userId}`);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating profile onboarding status:', updateError);
    throw new Error('Failed to update onboarding status.');
  }

  console.log(`Successfully marked onboarding complete for user: ${userId}`);
}; 