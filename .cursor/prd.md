# Vzn – MVP Product Requirements Document (PRD)

## 📚 Overview

**Vzn** is a minimalist focus tool aimed at students, entrepreneurs, and professionals who want to build better concentration habits.  
The MVP focuses purely on creating an emotional feedback loop: start a focus session → earn XP and progress → feel motivated to return.

*Self-Correction (Post-MVP Build): Initial PRD was aspirational. This version reflects the current implementation and near-term goals.*

---

## 🎯 Goals

- Deliver a **tight, motivating focus session loop**.
- **Minimal distractions** — ultra-simple UI/UX.
- Test core hypothesis:  
  > "*Will users engage daily with a simple focus timer tied to visible progression mechanics?*"

---

## 👥 Target Users

- Students
- Entrepreneurs
- Professionals interested in productivity

---

## 🛠 Core User Stories

| As a... | I want to... | So that... |
| :--- | :--- | :--- |
| New user | Sign up and log in easily | I can start using Vzn immediately |
| Returning user | Land directly on the main timer screen | I can focus without distractions |
| Focused user | Start a focus session with one tap | I can begin working quickly |
| User in Easy Mode | Pause and resume my session | I can handle brief interruptions |
| User in Hard Mode | Commit to an uninterrupted session | I can maximize my focus and earn bonus XP |
| Motivated user | See my XP, streak, and level progress immediately after a session | I feel rewarded and encouraged |
| Customizer | Choose my session duration | I can match sessions to my workflow |
| Silent worker | Turn off sounds/vibrations | I can focus without disruption |

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
    - Current Streak (days)
    - XP Bar (visual representation of progress to next level)
    - Level
  - *Note: To minimize distraction, Key Stats, Duration Selection, and Mode Selection are hidden when the timer is active.*

---

### 2. Session Timer Behavior
- Timer counts down from selected duration.
- **Two Modes:**
  - **Easy Mode (Default):**
    - Session **can be paused** and resumed.
    - If app is backgrounded, the timer pauses automatically and resumes upon return.
  - **Hard Mode:**
    - Session **cannot be paused**.
    - If app is backgrounded, the session is **cancelled immediately** (no XP earned for that session).
    - *Future Goal:* Successful completion may offer bonus XP (e.g., 2XP).
- **If manually canceled** (using the Cancel button):
  - *PRD Goal (Not Yet Implemented):* XP should be awarded **proportionally** based on completed minutes.
  - *Current Implementation:* Session resets, no XP awarded yet.
- **If app is exited (not just backgrounded) or force-closed:**
  - *PRD Goal (Not Yet Implemented):* XP should ideally be awarded **proportionally** based on completed minutes up to the exit point.
  - *Current Implementation:* Session is lost, no XP awarded yet.
- **If completed**: 
  - *PRD Goal (Not Yet Implemented):* Full XP based on session duration (plus potential Hard Mode bonus).
  - *Current Implementation:* Timer stops, no XP awarded yet.

---

### 3. XP System
- *PRD Goal (Not Yet Implemented):* **1 XP per 2.5 minutes** of *successfully completed* focus time (either via session completion or proportional award on cancel/exit).
  - 25m session = 10 XP
  - 50m session = 20 XP
  - 90m session = 36 XP
  - Custom sessions = (Minutes ÷ 2.5) XP
- *Current Implementation:* XP system exists visually but is not yet functional (no XP awarded).

---

### 4. Leveling System
- *PRD Goal (Not Yet Implemented):* **Escalating XP thresholds**:
  - Early levels require small XP amounts.
  - XP requirement increases progressively by ~10–20% per level.
  - Example model:
    - Level 1 → 50 XP
    - Level 2 → 120 XP total
    - Level 3 → 210 XP total
- *PRD Goal (Not Yet Implemented):* Level up **triggers celebratory animation/message**.
- *Current Implementation:* Leveling system exists visually but is not yet functional.

---

### 5. Streak System
- *PRD Goal (Not Yet Implemented):* Completing at least **one 25-minute (or longer)** session per day maintains the streak.
- *PRD Goal (Not Yet Implemented):* Shorter sessions **do not** count toward streaks.
- *PRD Goal (Not Yet Implemented):* Missing a day = **streak resets to 0**.
- *Current Implementation:* Streak system exists visually but is not yet functional.

---

### 6. Session Summary Screen
*(Not Yet Implemented)*
After session ends (completed or canceled):
- Show:
  - XP earned
  - Current streak
  - Level (with "Level Up!" animation if applicable)
- "Return Home" button to go back to Main Timer screen.

---

### 7. Authentication
*(Not Yet Implemented)*
- Simple login/signup:
  - Email + password (or optional auth provider if needed).
- Data stored securely:
  - Sessions, XP, Streaks, Levels tied to user account.

---

### 8. Settings Page
*(Not Yet Implemented)*
- Extremely minimal:
  - **Toggle sounds** (on/off)
  - **Toggle vibrations** (on/off)
  - **Log Out** button
  - **View Privacy Policy and Terms of Service** links

---

## 🖌️ UX Notes

- **Default session duration** = 25 minutes unless user selects otherwise. *(Implemented)*
- **Session Picker**: *(Implemented)*
  - Quick options (25m, 50m, 90m)
  - Custom time picker (free-form selection)
- **Colors and visual language**: *(Partially Implemented - Dark Theme)*
  - Calm, neutral tones (e.g., white, soft gray, accent colors like blue or green).
  - Celebratory highlights (gold/sparkle) when leveling up.
- **Fast feedback loops**: *(Partially Implemented - Timer is responsive)*
  - XP, streak, level updated **immediately** after a session. *(Requires Backend)*
- **Minimal button count**: *(Implemented)*
  - Focus on just one major call-to-action: "Start Session."

---

## 🔧 Technical Considerations

- **Data Persistence:** *(Requires Backend)*
  - Sessions, XP, Streaks, Levels saved to backend.
  - *PRD Goal (Not Yet Implemented):* Handle edge cases (e.g., user force closes app mid-session, award proportional XP).
- **Timer reliability:**
  - *Current Implementation:* Timer pauses (Easy Mode) or resets (Hard Mode) if app goes to background. Screen kept awake via `expo-keep-awake` while active.
  - *PRD Goal (Not Yet Implemented):* Award proportional XP even if session is interrupted by backgrounding/exit.
- **Performance:**
  - App must feel lightweight, fast, and reliable on common mobile devices. *(Ongoing Goal)*
- **Security:** *(Requires Backend)*
  - Basic account protection (e.g., password hashing if using email/password login).

---

## 🛑 Out of Scope for MVP

(Not included yet — reserved for future versions.)

- Notifications or reminders.
- Leaderboards, friends, or social features.
- In-depth analytics.
- Gamification extras (badges, challenges).
- Advanced settings/customization.
- Sound/Vibration Toggles (Moved from initial MVP scope due to complexity)
- Session Summary Screen (Requires backend for XP/Level/Streak)
- Authentication (Requires backend)

---

# ✅ Deliverables Summary

| Feature | Status |
| :--- | :--- |
| Main Timer Screen (Layout, Presets, Custom Picker, Mode Select) | Implemented |
| Focus Timer (start, pause/resume [Easy], cancel, complete) | Implemented |
| Visual XP Bar | Implemented |
| Visual Level Display | Implemented |
| Visual Streak Display | Implemented |
| Screen Keep-Awake | Implemented |
| Mode-Specific Background Handling (Pause/Reset) | Implemented |
| Session Summary Screen | Future | 
| Login/Signup | Future |
| Basic Settings (sound/vibration toggles) | Future |
| Functional XP System | Future |
| Functional Leveling System | Future |
| Functional Streak Tracking | Future |
| Proportional XP on Cancel/Exit | Future |

---

# 🧠 Final Notes

- The **emotional loop** is the MVP's soul:  
  *Start a session → Earn XP → Progress to next level → Keep streak alive.* *(Core loop UI implemented, backend logic pending)*
- **Simplicity wins.** Every element should push users gently toward building a daily focus habit without distraction or overwhelm.

---

# ✍️ Prepared for Vzn by ChatGPT
*(Revised based on implementation progress)*

