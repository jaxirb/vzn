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

    // 3. Read sessionDurationMinutes and focusMode from request body
    let sessionDurationMinutes: number;
    let focusMode: 'easy' | 'hard' = 'easy'; // Default to easy
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
    } catch (e) {
         console.error("Error parsing request body:", e);
         return new Response(JSON.stringify({ error: 'Invalid request body. Expecting JSON with sessionDurationMinutes (number) and optional focusMode ("easy"|"hard").' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    console.log(`[award-xp] Received duration: ${sessionDurationMinutes} min, mode: ${focusMode} for user ${userId}`);

    // 4. Fetch user's current profile (including streak info)
    // Define expected shape including streak fields
    interface ProfileDataForUpdate extends ProfileData {
        streak: number;
        longest_streak: number;
        last_session_timestamp: string | null;
    }
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('xp, level, streak, longest_streak, last_session_timestamp') // Add streak fields
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

    // 6. Calculate new total XP using final awarded XP
    const newTotalXp = profile.xp + finalXpAwarded;
    console.log(`[award-xp] New total XP for user ${userId}: ${newTotalXp}`);

    // 7. Determine new level
    const newLevel = calculateLevel(newTotalXp);
    const levelChanged = newLevel !== profile.level;
    console.log(`[award-xp] New level for user ${userId}: ${newLevel} (Changed: ${levelChanged})`);

    // --- Streak Calculation Logic --- 
    let newStreak = profile.streak;
    let newLongestStreak = profile.longest_streak;
    let newLastSessionTimestamp: string | null = profile.last_session_timestamp;
    let streakUpdated = false;

    if (sessionDurationMinutes >= 25 && finalXpAwarded > 0) { 
        const now = new Date();
        // Use UTC dates for comparison
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const yesterdayUTC = new Date(todayUTC);
        yesterdayUTC.setUTCDate(todayUTC.getUTCDate() - 1); // Start of yesterday UTC

        let lastSessionDateUTC: Date | null = null;
        if (profile.last_session_timestamp) {
            const lastTimestamp = new Date(profile.last_session_timestamp);
            // Extract UTC date parts from the stored timestamp
            lastSessionDateUTC = new Date(Date.UTC(lastTimestamp.getUTCFullYear(), lastTimestamp.getUTCMonth(), lastTimestamp.getUTCDate())); 
        }

        // Compare dates based on the start of the day in UTC
        if (!lastSessionDateUTC || lastSessionDateUTC.getTime() < yesterdayUTC.getTime()) {
            // Case 1: No previous session OR last session was before yesterday (UTC) -> Reset streak to 1
            console.log(`[award-xp] Streak Debug: Hitting CASE 1 (Reset). Last UTC: ${lastSessionDateUTC?.toISOString() ?? 'None'}, Yesterday UTC: ${yesterdayUTC.toISOString()}`);
            newStreak = 1;
            streakUpdated = true;
        } else if (lastSessionDateUTC.getTime() === yesterdayUTC.getTime()) {
            // Case 2: Last session was exactly yesterday (UTC) -> Increment streak
            console.log(`[award-xp] Streak Debug: Hitting CASE 2 (Increment). Current profile streak: ${profile.streak}. Last UTC: ${lastSessionDateUTC.toISOString()}, Yesterday UTC: ${yesterdayUTC.toISOString()}`);
            newStreak = profile.streak + 1;
            streakUpdated = true;
        } else if (lastSessionDateUTC.getTime() === todayUTC.getTime()) {
            // Case 3: Last session was earlier today (UTC) -> Do nothing to streak number
            console.log(`[award-xp] Streak Debug: Hitting CASE 3 (Same Day). Streak remains ${profile.streak}. Last UTC: ${lastSessionDateUTC.toISOString()}, Today UTC: ${todayUTC.toISOString()}`);
        } else {
             // Case 4: Unexpected date (e.g., future)
             console.log(`[award-xp] Streak Debug: Hitting CASE 4 (Unexpected Date). Resetting. Last UTC: ${lastSessionDateUTC?.toISOString()}, Today UTC: ${todayUTC.toISOString()}`);
             newStreak = 1;
             streakUpdated = true;
        }

        if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
            streakUpdated = true;
            console.log(`[award-xp] New longest streak achieved: ${newLongestStreak}`);
        }

        // Timestamp is only updated for qualifying sessions
        newLastSessionTimestamp = now.toISOString(); 
        streakUpdated = true; // Ensure timestamp update happens if this block runs
        console.log(`[award-xp] Updating last_session_timestamp for user ${userId} to ${newLastSessionTimestamp}`);

    } else {
         console.log(`[award-xp] Session duration (${sessionDurationMinutes} min) or final XP awarded (${finalXpAwarded}) insufficient for streak calculation/increment.`);
    }
    // --- End Streak Calculation --- 

    // 8. Prepare data for update
    const updateData: {
      xp: number;
      level: number;
      streak?: number;
      longest_streak?: number;
      last_session_timestamp?: string | null; 
    } = {
      xp: newTotalXp,
      level: newLevel,
    };

    // Include streak fields only if streak logic ran and indicated a change
    if (streakUpdated) { 
        updateData.streak = newStreak;
        updateData.longest_streak = newLongestStreak;
        updateData.last_session_timestamp = newLastSessionTimestamp; 
    }

    // 9. Update user profile in the database
    console.log(`[award-xp] Updating profile for user ${userId} with:`, updateData);
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('xp, level, streak, longest_streak, last_session_timestamp') // Select all updated fields
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
