// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// Import necessary modules. Ensure Deno can resolve these URLs.
// Use jsr for Supabase functions types if available, otherwise rely on esm.sh
import "jsr:@supabase/functions-js/edge-runtime.d.ts"; // Check if this resolves correctly
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Hello from Functions!")

// --- B4.3: Helper function to get YYYY-MM-DD key in user's local time ---
function getLocalDateKey(utcTimestampStr: string | number | Date, offsetMinutes: number): string {
  // Create a Date object (handles string, number, or Date input)
  const utcDate = new Date(utcTimestampStr);
  
  // Calculate the timestamp adjusted for the user's offset.
  // JS getTimezoneOffset() returns minutes WEST of UTC (e.g., +300 for EST which is UTC-5).
  // We need to SUBTRACT the offset provided by the client (which uses the same sign convention)
  // to shift the UTC time to the user's local time perspective.
  const localTimestamp = utcDate.getTime() - (offsetMinutes * 60 * 1000);
  
  // Create a new Date object representing the point in time corresponding to the user's local time
  const localDate = new Date(localTimestamp);

  // Extract YYYY, MM, DD from the local date object, using UTC methods 
  // because the date object itself represents the shifted point in time.
  const year = localDate.getUTCFullYear();
  const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = localDate.getUTCDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Define level thresholds directly in the function for self-containment
// (Alternatively, consider fetching from a shared location or DB table in future)
const LEVELS: Array<{ level: number; xpRequired: number }> = [
  { level: 1, xpRequired: 0 }, { level: 2, xpRequired: 50 }, { level: 3, xpRequired: 120 }, 
  { level: 4, xpRequired: 210 }, { level: 5, xpRequired: 489 }, { level: 6, xpRequired: 729 }, 
  { level: 7, xpRequired: 1009 }, { level: 8, xpRequired: 1326 }, { level: 9, xpRequired: 1678 }, 
  { level: 10, xpRequired: 2063 }, { level: 11, xpRequired: 2479 }, { level: 12, xpRequired: 2924 }, 
  { level: 13, xpRequired: 3397 }, { level: 14, xpRequired: 3897 }, { level: 15, xpRequired: 4422 }, 
  { level: 16, xpRequired: 4971 }, { level: 17, xpRequired: 5543 }, { level: 18, xpRequired: 6136 }, 
  { level: 19, xpRequired: 6749 }, { level: 20, xpRequired: 7381 }, { level: 21, xpRequired: 8031 }, 
  { level: 22, xpRequired: 8699 }, { level: 23, xpRequired: 9382 }, { level: 24, xpRequired: 10081 }, 
  { level: 25, xpRequired: 10794 }, { level: 26, xpRequired: 11521 }, { level: 27, xpRequired: 12261 }, 
  { level: 28, xpRequired: 13014 }, { level: 29, xpRequired: 13779 }, { level: 30, xpRequired: 14556 }, 
  { level: 31, xpRequired: 15344 }, { level: 32, xpRequired: 16143 }, { level: 33, xpRequired: 16953 }, 
  { level: 34, xpRequired: 17772 }, { level: 35, xpRequired: 18601 }, { level: 36, xpRequired: 19439 }, 
  { level: 37, xpRequired: 20287 }, { level: 38, xpRequired: 21143 }, { level: 39, xpRequired: 22007 }, 
  { level: 40, xpRequired: 22880 }, { level: 41, xpRequired: 23761 }, { level: 42, xpRequired: 24649 }, 
  { level: 43, xpRequired: 25545 }, { level: 44, xpRequired: 26448 }, { level: 45, xpRequired: 27359 }, 
  { level: 46, xpRequired: 28276 }, { level: 47, xpRequired: 29199 }, { level: 48, xpRequired: 30129 }, 
  { level: 49, xpRequired: 31066 }, { level: 50, xpRequired: 32008 }, { level: 51, xpRequired: 32956 }, 
  { level: 52, xpRequired: 33910 }, { level: 53, xpRequired: 34869 }, { level: 54, xpRequired: 35834 }, 
  { level: 55, xpRequired: 36804 }, { level: 56, xpRequired: 37779 }, { level: 57, xpRequired: 38759 }, 
  { level: 58, xpRequired: 39743 }, { level: 59, xpRequired: 40732 }, { level: 60, xpRequired: 41725 }, 
  { level: 61, xpRequired: 42722 }, { level: 62, xpRequired: 43723 }, { level: 63, xpRequired: 44728 }, 
  { level: 64, xpRequired: 45737 }, { level: 65, xpRequired: 46750 }, { level: 66, xpRequired: 47766 }, 
  { level: 67, xpRequired: 48786 }, { level: 68, xpRequired: 49808 }, { level: 69, xpRequired: 50834 }, 
  { level: 70, xpRequired: 51862 }, { level: 71, xpRequired: 52894 }, { level: 72, xpRequired: 53928 }, 
  { level: 73, xpRequired: 54965 }, { level: 74, xpRequired: 56004 }, { level: 75, xpRequired: 57046 }, 
  { level: 76, xpRequired: 58090 }, { level: 77, xpRequired: 59136 }, { level: 78, xpRequired: 60184 }, 
  { level: 79, xpRequired: 61235 }, { level: 80, xpRequired: 62287 }, { level: 81, xpRequired: 63342 }, 
  { level: 82, xpRequired: 64398 }, { level: 83, xpRequired: 65456 }, { level: 84, xpRequired: 66516 }, 
  { level: 85, xpRequired: 67577 }, { level: 86, xpRequired: 68640 }, { level: 87, xpRequired: 69704 }, 
  { level: 88, xpRequired: 70769 }, { level: 89, xpRequired: 71836 }, { level: 90, xpRequired: 72904 }, 
  { level: 91, xpRequired: 73973 }, { level: 92, xpRequired: 75043 }, { level: 93, xpRequired: 76114 }, 
  { level: 94, xpRequired: 77186 }, { level: 95, xpRequired: 78258 }, { level: 96, xpRequired: 79332 }, 
  { level: 97, xpRequired: 80406 }, { level: 98, xpRequired: 81480 }, { level: 99, xpRequired: 82555 }, 
  { level: 100, xpRequired: 100000 }
];

// Function to determine level based on XP
function calculateLevel(xp: number): number {
  let calculatedLevel = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      calculatedLevel = LEVELS[i].level;
      break;
    }
  }
  return calculatedLevel;
}

// Define expected shape for profile data fetched/updated
interface ProfileData {
    xp: number;
    level: number;
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase Admin Client (requires VZN_SUPABASE_SERVICE_ROLE_KEY)
    // Note: Using admin client is necessary for secure operations like modifying user profiles.
    // Ensure VZN_SUPABASE_URL and VZN_SUPABASE_SERVICE_ROLE_KEY are set in Edge Function secrets.
    const supabaseUrl = Deno.env.get("VZN_SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("VZN_SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    // Explicitly type the client
    const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        // Important: Disable auto-refresh and persistence for server-side client
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 2. Authenticate the request using the user's JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error("Missing or invalid authorization header");
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);

    if (userError || !user) {
      console.error('Auth Error:', userError);
      return new Response(JSON.stringify({ error: 'Authentication failed: ' + (userError?.message || 'No user found') }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = user.id;
    console.log(`[award-xp] Authenticated user: ${userId}`);

    // 3. Read data from request body (including timezone offset)
    let sessionDurationMinutes: number;
    let focusMode: 'easy' | 'hard' = 'easy'; // Default to easy
    let userTimezoneOffsetMinutes: number = 0; // Default to UTC offset
    try {
        const body = await req.json();
        if (typeof body?.sessionDurationMinutes !== 'number' || body.sessionDurationMinutes <= 0) {
             throw new Error('Invalid sessionDurationMinutes provided.');
        }
        sessionDurationMinutes = body.sessionDurationMinutes;
        // Validate focusMode if provided
        if (body?.focusMode === 'easy' || body?.focusMode === 'hard') {
            focusMode = body.focusMode;
        }
        // B4.3: Get timezone offset
        if (typeof body?.userTimezoneOffsetMinutes === 'number') {
            userTimezoneOffsetMinutes = body.userTimezoneOffsetMinutes;
        } else {
            console.warn(`[award-xp] userTimezoneOffsetMinutes not provided or invalid for user ${userId}, defaulting to UTC (0).`);
            // Keep default of 0
        }
    } catch (e) {
         console.error("Error parsing request body:", e);
         return new Response(JSON.stringify({ error: 'Invalid request body. Expecting JSON with sessionDurationMinutes (number), optional focusMode ("easy"|"hard"), and optional userTimezoneOffsetMinutes (number).' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    console.log(`[award-xp] Received duration: ${sessionDurationMinutes} min, mode: ${focusMode}, offset: ${userTimezoneOffsetMinutes} min for user ${userId}`);

    // 4. Fetch user's current profile (including streak info)
    // Define expected shape including streak fields with REVERTED names
    interface ProfileDataForUpdate extends ProfileData {
        streak: number;
        longest_streak: number;
        last_session_timestamp: string | null;
    }
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('xp, level, streak, longest_streak, last_session_timestamp') // Use REVERTED field names
      .eq('id', userId)
      .single<ProfileDataForUpdate>(); // Use updated interface

    if (profileError) {
      console.error(`Error fetching profile for user ${userId}:`, profileError);
      // Handle case where profile might not exist yet (though trigger should prevent this)
      if (profileError.code === 'PGRST116') { 
         throw new Error(`Profile not found for user ${userId}. Trigger might have failed.`);
      }
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }
    // Profile should exist if query succeeds due to .single()
    console.log(`[award-xp] Current profile for user ${userId}:`, profile);

    // 5. Calculate BASE XP earned (1 XP per 2.5 mins, floor)
    const baseXpEarned = Math.floor(sessionDurationMinutes / 2.5);
    
    // 5b. Apply Hard Mode Bonus
    let finalXpAwarded = baseXpEarned;
    if (focusMode === 'hard') {
        finalXpAwarded = baseXpEarned * 2;
        console.log(`[award-xp] Hard mode detected, doubling XP from ${baseXpEarned} to ${finalXpAwarded}`);
    }
    console.log(`[award-xp] Final XP awarded for user ${userId}: ${finalXpAwarded}`);

    // 6. Calculate new total XP using final awarded XP and REVERTED field name
    const newTotalXp = profile.xp + finalXpAwarded;
    console.log(`[award-xp] New total XP for user ${userId}: ${newTotalXp}`);

    // 7. Determine new level using REVERTED field name
    const newLevel = calculateLevel(newTotalXp);
    const levelChanged = newLevel !== profile.level;
    console.log(`[award-xp] New level for user ${userId}: ${newLevel} (Changed: ${levelChanged})`);

    // --- B4.3: Streak Calculation Logic (Revised for Local Time Zone) --- 
    let newStreak = profile.streak;
    let newLongestStreak = profile.longest_streak;
    let newLastSessionTimestamp: string | null = profile.last_session_timestamp; 
    let streakUpdated = false;

    // Only update streak info if session was qualifying (>= 25 min) and XP was awarded
    if (sessionDurationMinutes >= 25 && finalXpAwarded > 0) { 
        const now = Date.now(); // Current time as UTC timestamp
        const nowISO = new Date(now).toISOString(); // Current time as ISO string for DB update

        // Get today's and yesterday's date keys in the user's local time
        const todayLocalKey = getLocalDateKey(now, userTimezoneOffsetMinutes);
        
        // Calculate yesterday's timestamp (simple subtraction, safe across DST)
        const yesterdayTimestamp = now - (24 * 60 * 60 * 1000);
        const yesterdayLocalKey = getLocalDateKey(yesterdayTimestamp, userTimezoneOffsetMinutes);

        let lastSessionLocalKey: string | null = null;
        if (profile.last_session_timestamp) {
            lastSessionLocalKey = getLocalDateKey(profile.last_session_timestamp, userTimezoneOffsetMinutes);
        }

        console.log(`[award-xp] Streak Dates - Today Local: ${todayLocalKey}, Yesterday Local: ${yesterdayLocalKey}, Last Session Local: ${lastSessionLocalKey}`);

        // Compare LOCAL date keys
        if (!lastSessionLocalKey || lastSessionLocalKey < yesterdayLocalKey) {
            // Case 1: No previous qualifying session OR last session was before yesterday (local time) -> Reset streak to 1
            console.log(`[award-xp] Streak Case 1: Resetting streak to 1. (Last: ${lastSessionLocalKey}, Yesterday: ${yesterdayLocalKey})`);
            newStreak = 1;
            streakUpdated = true;
        } else if (lastSessionLocalKey === yesterdayLocalKey) {
            // Case 2: Last session was exactly yesterday (local time) -> Increment streak
            console.log(`[award-xp] Streak Case 2: Incrementing streak from ${profile.streak} to ${profile.streak + 1}. (Last: ${lastSessionLocalKey}, Yesterday: ${yesterdayLocalKey})`);
            newStreak = profile.streak + 1;
            streakUpdated = true;
        } else if (lastSessionLocalKey === todayLocalKey) {
            // Case 3: Last session was earlier today (local time) -> Do nothing to streak number
            console.log(`[award-xp] Streak Case 3: Multiple sessions today. Streak remains ${profile.streak}. (Last: ${lastSessionLocalKey}, Today: ${todayLocalKey})`);
            // `streakUpdated` remains false unless longest streak changes below
        } else {
             // Case 4: Should not happen with dates, but fallback -> Reset to 1
             console.warn(`[award-xp] Streak Case 4: Unexpected date comparison. Resetting streak to 1. (Last: ${lastSessionLocalKey}, Today: ${todayLocalKey})`);
             newStreak = 1;
             streakUpdated = true;
        }

        // Always check/update longest streak if the current streak might have changed
        if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
            streakUpdated = true;
            console.log(`[award-xp] New longest streak achieved: ${newLongestStreak}`);
        }

        // Timestamp is only updated for qualifying sessions
        newLastSessionTimestamp = nowISO; // Correct: Use the ISO string created from the Date object
        // Mark streak as updated because the timestamp changed
        streakUpdated = true; 
        console.log(`[award-xp] Updating last_session_timestamp for user ${userId} to ${newLastSessionTimestamp}`);

    } else {
         console.log(`[award-xp] Session duration (${sessionDurationMinutes} min) or final XP awarded (${finalXpAwarded}) insufficient for streak calculation/increment.`);
    }
    // --- End Streak Calculation --- 

    // 8. Prepare data for update using REVERTED field names
    // Define the type explicitly for clarity
    type ProfileUpdatePayload = {
      xp: number;
      level: number;
      streak?: number;       // Reverted & Optional
      longest_streak?: number;       // Optional: Only include if changed
      last_session_timestamp?: string | null; // Optional: Use null for clearing, string for setting
    };

    const updateData: ProfileUpdatePayload = {
      xp: newTotalXp,      // Reverted field name
      level: newLevel,  // Reverted field name
    };

    // Conditionally add streak fields ONLY if they were potentially updated
    if (streakUpdated) {
        updateData.streak = newStreak;
        updateData.longest_streak = newLongestStreak;
        // Ensure timestamp is only updated if streak logic ran and deemed it necessary
        if (newLastSessionTimestamp !== profile.last_session_timestamp) {
             updateData.last_session_timestamp = newLastSessionTimestamp; // Assign directly
        }
    }

    console.log(`[award-xp] Preparing to update profile for user ${userId} with data:`, updateData);

    // 9. Update user profile in the database
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      // Select using REVERTED field names
      .select('xp, level, streak, longest_streak, last_session_timestamp') 
      .single<ProfileDataForUpdate>(); // Use updated interface

    if (updateError) {
      console.error(`Error updating profile for user ${userId}:`, updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }
    console.log(`[award-xp] Profile updated for user ${userId}:`, updatedProfile);

    // 10. Return success response with updated data
    return new Response(JSON.stringify({ 
        success: true, 
        xpEarned: finalXpAwarded, // Return the final awarded XP
        levelChanged: levelChanged,
        streakInfo: streakUpdated ? { 
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastSessionTimestamp: newLastSessionTimestamp 
        } : undefined, // Only include streak info if it was updated
        updatedProfile 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Catch any other unhandled errors
    console.error('[award-xp] Unhandled error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/award-xp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
