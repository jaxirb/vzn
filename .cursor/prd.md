# Vzn – MVP Product Requirements Document (PRD)

## 📚 Overview

**Vzn** is a minimalist focus tool aimed at students, entrepreneurs, and professionals who want to build better concentration habits.  
The MVP focuses purely on creating an emotional feedback loop: start a focus session → earn XP and progress → feel motivated to return.

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
| Motivated user | See my XP, streak, and level progress immediately after a session | I feel rewarded and encouraged |
| Customizer | Choose my session duration | I can match sessions to my workflow |
| Silent worker | Turn off sounds/vibrations | I can focus without disruption |

---

## 🖥 Core Functional Requirements

### 1. Main Timer Screen
- Clean, minimalist layout.
- Display:
  - **Focus Timer** (preset 25m, 50m, 90m, or custom picker)
  - **Start Session** button
  - **Key Stats Always Visible**:
    - Current Streak (days)
    - XP (total earned)
    - Level

---

### 2. Session Timer Behavior
- Timer counts down from selected duration.
- **No Pause** option.
- **If canceled** or user exits the app:
  - XP is awarded **proportionally** based on completed minutes.
- **If completed**:
  - Full XP based on session duration.

---

### 3. XP System
- **1 XP per 2.5 minutes** of focused time.
  - 25m session = 10 XP
  - 50m session = 20 XP
  - 90m session = 36 XP
  - Custom sessions = (Minutes ÷ 2.5) XP

---

### 4. Leveling System
- **Escalating XP thresholds**:
  - Early levels require small XP amounts.
  - XP requirement increases progressively by ~10–20% per level.
  - Example model:
    - Level 1 → 50 XP
    - Level 2 → 120 XP total
    - Level 3 → 210 XP total
- Level up **triggers celebratory animation/message**.

---

### 5. Streak System
- Completing at least **one 25-minute (or longer)** session per day maintains the streak.
- Shorter sessions **do not** count toward streaks.
- Missing a day = **streak resets to 0**.

---

### 6. Session Summary Screen
After session ends (completed or canceled):
- Show:
  - XP earned
  - Current streak
  - Level (with "Level Up!" animation if applicable)
- "Return Home" button to go back to Main Timer screen.

---

### 7. Authentication
- Simple login/signup:
  - Email + password (or optional auth provider if needed).
- Data stored securely:
  - Sessions, XP, Streaks, Levels tied to user account.

---

### 8. Settings Page
- Extremely minimal:
  - **Toggle sounds** (on/off)
  - **Toggle vibrations** (on/off)
  - **Log Out** button
  - **View Privacy Policy and Terms of Service** links

---

## 🖌️ UX Notes

- **Default session duration** = 25 minutes unless user selects otherwise.
- **Session Picker**:
  - Quick options (25m, 50m, 90m)
  - Custom time picker (free-form selection)
- **Colors and visual language**:
  - Calm, neutral tones (e.g., white, soft gray, accent colors like blue or green).
  - Celebratory highlights (gold/sparkle) when leveling up.
- **Fast feedback loops**:
  - XP, streak, level updated **immediately** after a session.
- **Minimal button count**:
  - Focus on just one major call-to-action: "Start Session."

---

## 🔧 Technical Considerations

- **Data Persistence:**
  - Sessions, XP, Streaks, Levels saved to backend.
  - Handle edge cases (e.g., user force closes app mid-session).
- **Timer reliability:**
  - Timer should continue if app goes to background (best effort).
- **Performance:**
  - App must feel lightweight, fast, and reliable on common mobile devices.
- **Security:**
  - Basic account protection (e.g., password hashing if using email/password login).

---

## 🛑 Out of Scope for MVP

(Not included yet — reserved for future versions.)

- Notifications or reminders.
- Leaderboards, friends, or social features.
- In-depth analytics.
- Gamification extras (badges, challenges).
- Advanced settings/customization.

---

# ✅ Deliverables Summary

| Feature | Status |
| :--- | :--- |
| Main Timer Screen | Required |
| Focus Timer (start, cancel, complete) | Required |
| XP Scaling System | Required |
| Escalating Level System | Required |
| Daily Streak Tracking | Required |
| Session Summary Screen | Required |
| Login/Signup | Required |
| Basic Settings (sound/vibration toggles) | Required |

---

# 🧠 Final Notes

- The **emotional loop** is the MVP’s soul:  
  *Start a session → Earn XP → Progress to next level → Keep streak alive.*
- **Simplicity wins.** Every element should push users gently toward building a daily focus habit without distraction or overwhelm.

---

# ✍️ Prepared for Vzn by ChatGPT

