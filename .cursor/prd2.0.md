# Vzn v2.0 – Product Requirements Document (PRD)

## 📘 Overview

Vzn is a minimalist focus tool that helps students, entrepreneurs, and productivity-minded individuals build better concentration habits. The app creates an emotional feedback loop: start a session → earn XP and level up → feel good → want to come back.

This PRD outlines the goals, user stories, and specific features for version 2.0. The primary objective is to increase retention and engagement through polish, gamification, and smoother UX flows. 

---

## 🎯 Goals

- Improve the sign-up and login process with Single Sign-On (SSO) options
- Build out core navigation using a bottom-tab layout (Focus, Progress, Account)
- Fix XP tracking bugs and streamline session logic
- Show more clear, immediate feedback when users finish a session
- Lay the foundation for scaling retention features like streaks and accountability

---

## 👥 Target Users

- Students (university or high school)
- Aspiring entrepreneurs
- Young professionals seeking structure and digital productivity tools
- People trying to build better focus or break phone addiction habits

---

## 🙋 User Stories

| As a...             | I want to...                                                                 | So that...                                                  |
|---------------------|------------------------------------------------------------------------------|-------------------------------------------------------------|
| New user            | Sign up quickly using Google or Apple                                       | I don't have to type in an email or create a password       |
| Returning user      | Be taken straight to my home screen after logging in                        | I can immediately start focusing or see my progress         |
| User finishing a session | Get satisfying feedback after a session (XP, visual reward, summary)    | I feel a sense of progress and motivation to continue       |
| Power user          | Easily navigate between focus, stats, and my account settings               | I can use the app without confusion or friction             |

---

## 🧱 Features & Requirements

### 🔐 Authentication

- [ ] Add SSO options: Google and Apple login
- [ ] Optional for later: email + password auth
- [ ] Add loading indicator/spinner while authenticating

### 🧭 Navigation & Layout

- [ ] Implement a bottom-tab navigation with 3 main sections:
  - Focus (core timer and session launch)
  - Progress (XP, streaks, analytics, historical notes)
  - Account (profile, plan type, settings, logout)
- [ ] Users who are logged in should be taken straight to the home screen
- [ ] Add skeleton loaders or simple animation for smooth screen transitions

### ⏱ Focus Session Flow

- [ ] When a session ends, show a clean end screen with:
  - Total time completed
  - XP earned
  - Text box to "Add a quick note" (optional reflection)
  - Buttons: "Return Home" or "Start another session"
- [ ] Add a subtle but satisfying animation or feedback on XP gain (e.g. progress bar filling, sparkles/confetti, audio cue)

### 🐛 Bug Fixes

- [ ] Fix bug where XP is not always calculated correctly after a session
- [ ] Resolve resurrection token logic and ensure it's working as designed
- [ ] Fix localStorage refresh issue that logs users out unexpectedly
- [ ] Fix final onboarding screen getting stuck
- [ ] Fix authentication screen still showing briefly when app loads and user is already logged in
- [ ] Add more robust text optimization for larger text sizes on different devices

---

## 📈 Success Metrics

- Increase Day 1 retention by 20%
- Reduce drop-off rate during onboarding/sign-up by 30%
- Reach average of 2+ sessions per day per active user

---

## 🗓 Timeline

| Phase               | Target Date     |
|---------------------|-----------------|
| Finalize Designs    | May 15, 2025     |
| Development Start   | May 17, 2025     |
| Internal Alpha Test | May 27, 2025     |
| Public Launch (v2.0)| June 1, 2025     |

---

## 💡 Ideas for Future

- Add a gamified onboarding experience with XP rewards
- Use Lottie animations for end-of-session visual feedback
- Introduce daily and weekly streaks
- Experiment with motivational quotes or sound cues at session end
- Explore multiplayer or accountability modes down the line

---

