# Vzn – MVP Product Requirements Document (PRD)

## 📚 Overview

**Vzn** is a minimalist focus tool aimed at students, entrepreneurs, and professionals who want to build better concentration habits.
The application focuses on creating an emotional feedback loop: start a focus session → earn XP and progress → feel motivated to return.

*Self-Correction: This PRD reflects the current state of the application after initial MVP development and subsequent feature enhancements.*

---

## 🎯 Goals

- Deliver a **tight, motivating focus session loop** with functional progression mechanics.
- **Minimal distractions** — ultra-simple UI/UX.
- Validate core hypothesis:
  > "*Users will engage daily with a simple focus timer tied to visible and functional progression mechanics (XP, levels, streaks).*"

---

## 👥 Target Users

- Students
- Entrepreneurs
- Professionals interested in productivity

---

## 🛠 Core User Stories

| As a... | I want to... | So that... |
| :--- | :--- | :--- |
| New user | Sign up and log in easily via OTP or a demo account password | I can start using Vzn immediately |
| Returning user | Land directly on the main timer screen | I can focus without distractions |
| Focused user | Start a focus session with one tap | I can begin working quickly |
| User in Easy Mode | Pause and resume my session | I can handle brief interruptions |
| User in Hard Mode | Commit to an uninterrupted session and earn 2XP | I can maximize my focus and earn bonus XP |
| Motivated user | See my XP, streak, and level progress immediately after a session via modals | I feel rewarded and encouraged |
| Customizer | Choose my session duration | I can match sessions to my workflow |
| Silent worker | Turn off sounds/vibrations via settings | I can focus without disruption |
| User | Log out of my account | I can manage my session |
| User | View compliance documents (Privacy Policy, Terms of Service) | I am informed about my data and usage terms |

---

## 🖥 Core Functional Requirements

### 1. Main Timer Screen
- Clean, minimalist layout.
- Display:
  - **Focus Timer** (preset 25m, 50m, 90m, or custom picker)
  - **Mode Selection** (Easy Mode / Hard Mode)
  - **Start Session** button (changes to Pause/Resume in Easy Mode when active)
  - **Cancel Session** button (appears when session is active)
  - **Key Stats Visible (When Timer Inactive)**:
    - Current Streak (days) - *Functional*
    - XP Bar (visual representation of progress to next level) - *Functional*
    - Level - *Functional*
  - *Note: To minimize distraction, Key Stats, Duration Selection, and Mode Selection are hidden when the timer is active.*

---

### 2. Session Timer Behavior
- Timer counts down from selected duration.
- **Two Modes:**
  - **Easy Mode (Default):**
    - Session **can be paused** and resumed.
    - If app is backgrounded, the timer pauses automatically and resumes upon return.
    - Earns 1XP per 2.5 minutes of completed focus time.
  - **Hard Mode:**
    - Session **cannot be paused**. (Pause button is hidden)
    - If app is backgrounded, the timer pauses automatically and resumes upon return.
    - Successful completion offers **2XP bonus** (2XP per 2.5 minutes of completed focus time).
- **If manually canceled** (using the Cancel button):
  - Session resets, no XP awarded.
  - *Future Goal:* XP should be awarded **proportionally** based on completed minutes.
- **If app is exited (not just backgrounded) or force-closed:**
  - Session is lost, no XP awarded.
  - *Future Goal:* XP should ideally be awarded **proportionally** based on completed minutes up to the exit point.
- **If completed**:
  - Full XP based on session duration and mode (Easy/Hard) is awarded.
  - Triggers post-session modals (Session Summary, potentially Streak Increase, Level Up).

---

### 3. XP System
- **1 XP per 2.5 minutes** of *successfully completed* focus time in **Easy Mode**.
- **2 XP per 2.5 minutes** of *successfully completed* focus time in **Hard Mode**.
  - Easy Mode Examples:
    - 25m session = 10 XP
    - 50m session = 20 XP
    - 90m session = 36 XP
  - Hard Mode Examples:
    - 25m session = 20 XP
    - 50m session = 40 XP
    - 90m session = 72 XP
  - Custom sessions = (Minutes ÷ 2.5) XP for Easy, or (Minutes ÷ 2.5) * 2 XP for Hard.
- XP is awarded upon successful session completion and updates are reflected in the user's profile and UI.

---

### 4. Leveling System
- **Escalating XP thresholds** for leveling up (defined in `lib/levels.ts`).
  - Example model:
    - Level 1 → 50 XP
    - Level 2 → 120 XP total (70 more XP from Lvl 1)
    - Level 3 → 210 XP total (90 more XP from Lvl 2)
- Level up **triggers a celebratory `LevelUpModal`**.
- User's current level and progress to next level are displayed on the Main Timer Screen.

---

### 5. Streak System
- Completing at least **one 25-minute (or longer)** session per local calendar day maintains/increments the streak.
- Shorter sessions **do not** count toward streaks.
- Missing a day (i.e., not completing a qualifying session by midnight local time) **resets streak to 0**.
- Streak increment **triggers a `StreakIncreaseModal`** (if no level up occurred, otherwise `LevelUpModal` takes precedence).
- Current streak is displayed on the Main Timer Screen.

---

### 6. Session Summary Screen
*Implemented as a series of modals post-session completion:*
- **`SessionSummaryModal`**: Shown after every completed session.
  - Displays: XP earned for the session, total XP.
- **`StreakIncreaseModal`**: Shown if a streak was extended or started (and no level up).
  - Displays: New streak count.
- **`LevelUpModal`**: Shown if the user leveled up.
  - Displays: New level, celebratory message.
- Modals provide a "Done" or similar button to return to the Main Timer screen.

---

### 7. Authentication
*Implemented*
- **Standard User Login/Signup:**
  - Email + OTP (One-Time Password) sent to email.
- **Demo Account Login (for App Store Review):**
  - Specific email (`vzntest02@gmail.com`) can log in using a pre-defined password (`VznDemoPass123!`), bypassing OTP.
- User data (profile, sessions, XP, streaks, levels) is tied to the authenticated user account and stored securely in Supabase.

---

### 8. Settings Page
*Implemented as `SettingsModal.tsx` accessible from the Main Timer Screen.*
- Minimal set of options:
  - **Toggle sounds** (on/off) - *Persistence implemented*
  - **Toggle vibrations** (on/off) - *Persistence implemented*
  - **Toggle daily reminder notifications** (on/off) - *Toggle UI exists, persistence implemented, actual notification scheduling is future scope.*
  - **Log Out** button - *Functional*
  - **View Privacy Policy** link - *Functional, links to `(app)/compliance.tsx`*
  - **View Terms of Service** link - *Functional, links to `(app)/compliance.tsx`*

---

## 🖌️ UX Notes

- **Default session duration** = 25 minutes unless user selects otherwise. *(Implemented)*
- **Session Picker**: *(Implemented)*
  - Quick options (25m, 50m, 90m)
  - Custom time picker (free-form selection)
- **Colors and visual language**: *(Implemented - Dark Theme with accent colors)*
  - Calm, neutral tones.
  - Celebratory highlights (e.g., in modals) when leveling up or increasing streak.
- **Fast feedback loops**: *(Implemented)*
  - XP, streak, level updated **immediately** after a session and reflected in UI and subsequent modals.
- **Minimal button count**: *(Implemented)*
  - Focus on just one major call-to-action: "Start Session."

---

## 🔧 Technical Considerations

- **Data Persistence:** *(Implemented via Supabase Backend)*
  - User profiles, focus sessions, XP, streaks, levels, and settings preferences are saved to backend.
  - *PRD Goal (Not Yet Implemented):* Handle edge cases (e.g., user force closes app mid-session, award proportional XP).
- **Timer reliability:**
  - *Current Implementation:* Timer pauses if app goes to background (in both Easy and Hard Modes). Screen kept awake via `expo-keep-awake` while active.
  - *PRD Goal (Not Yet Implemented):* Award proportional XP even if session is interrupted by backgrounding/exit.
- **Performance:**
  - App must feel lightweight, fast, and reliable on common mobile devices. *(Ongoing Goal)*
- **Security:** *(Implemented via Supabase Auth)*
  - Supabase handles OTP, password hashing (for demo account), and secure session management.

---

## 🛑 Out of Scope for MVP / Future Enhancements

(Reserved for future versions.)

- Proportional XP award on manual cancel or app exit/force-close mid-session.
- Functional daily reminder notifications (scheduling and delivery).
- Leaderboards, friends, or social features.
- In-depth analytics beyond basic session logging.
- Gamification extras (badges, challenges beyond current XP/Level/Streak).
- Advanced settings/customization (e.g., theme options, more sound choices).
- Full offline support (currently, actions requiring backend will fail without connection).

---

# ✅ Deliverables Summary

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Main Timer Screen (Layout, Presets, Custom Picker, Mode Select) | Implemented | |
| Focus Timer (start, pause/resume [Easy], cancel, complete) | Implemented | Pause button hidden in Hard Mode. |
| Visual XP Bar | Implemented | Functional, reflects backend data. |
| Visual Level Display | Implemented | Functional, reflects backend data. |
| Visual Streak Display | Implemented | Functional, reflects backend data. |
| Screen Keep-Awake | Implemented | `expo-keep-awake` during active session. |
| Background Handling (Pause) | Implemented | Timer pauses on background, resumes on foreground. |
| Session Summary Modals (`SessionSummaryModal`, `StreakIncreaseModal`, `LevelUpModal`) | Implemented |  |
| Login/Signup (OTP, Demo Password) | Implemented | |
| Settings Modal (Toggles, Logout, Compliance Links) | Implemented | Sound/Vibration toggles functional & persistent. Notification toggle UI/persistence in place, scheduling future. |
| Functional XP System (Easy & Hard Mode) | Implemented | 1XP/2.5min Easy, 2XP/2.5min Hard. |
| Functional Leveling System | Implemented | Based on XP thresholds in `lib/levels.ts`. |
| Functional Streak Tracking | Implemented | Min 25min session/day. |
| Proportional XP on Cancel/Exit | Future |  |
| Backend Data Persistence (Supabase) | Implemented | For profile, sessions, progression, settings. |
| Dark Theme | Implemented | |

---

# 🧠 Final Notes

- The **emotional loop** is the Vzn's soul and is now functional:
  *Start a session → Earn XP (with Hard Mode bonus) → Progress to next level (celebratory modal) → Keep streak alive (celebratory modal).*
- **Simplicity wins.** Every element should push users gently toward building a daily focus habit without distraction or overwhelm. The current implementation largely adheres to this.

---

# ✍️ Prepared for Vzn by ChatGPT
*(Revised based on implementation progress and feature completion)*

