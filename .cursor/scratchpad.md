hi this is the scratch pad

3.  **Task 3: Implement Central Focus Timer Display**
    - **Goal:** Create the central timer display area in `app/(tabs)/index.tsx`, including the timer text, mode text, a placeholder circular border, and the "Start Focus" button, styled for a dark theme.
    - **References:** User screenshot, `ThemedText`, `TouchableOpacity`.
    - **Sub-Tasks:**
        - **3.1 Structure:** In the `centerContent` View of `app/(tabs)/index.tsx`, replace the placeholder text.
        - **3.2 Circular Placeholder:** Add a `View` styled as a large circle (using `width`, `height`, `borderRadius`, `borderWidth`, `borderColor`). Center it within `centerContent`.
        - **3.3 Timer Text:** Inside the circle `View`, add `ThemedText` for the time placeholder (e.g., "25:00"). Style it large (e.g., font size ~72-80), bold, white, and centered.
        - **3.4 Mode Text:** Below the timer text (still within the circle `View`), add `ThemedText` for the mode placeholder (e.g., "Easy Mode"). Style it smaller (e.g., font size ~16-18), maybe green or white, and centered.
        - **3.5 Start Button:** Below the circle `View` (but still within `centerContent`), add a `TouchableOpacity` styled as a button (e.g., pill shape, maybe grey background). Inside it, place `ThemedText` "▶ Start Focus". Style the button and text appropriately.
        - **3.6 Layout & Styling:** Ensure the circle and button are centered vertically within `centerContent`. Adjust styles (font sizes, colors, spacing, border width) to match the screenshot's aesthetic. Remove the temporary border from the `centerContent` style.
    - **Success Criteria:** The central area of the screen displays a large circular border. Inside the border, large "25:00" text is visible above smaller "Easy Mode" text. Below the circle, a styled "▶ Start Focus" button is visible. All elements are centered vertically and styled for the dark theme, resembling the first screenshot.

4.  **Task 4: Implement Focus Session Controls**
    - **Goal:** Implement the session duration and mode selection controls in the `bottomControls` section of `app/(tabs)/index.tsx`, styled for the dark theme.
    - **References:** User screenshot, `TouchableOpacity`, `ThemedText`.
    - **Sub-Tasks:**
        - **4.1 Structure:** In the `bottomControls` View of `app/(tabs)/index.tsx`, replace the placeholder text. Add container Views for duration and mode buttons.
        - **4.2 Duration Buttons:** Implement `TouchableOpacity` buttons for "25m", "50m", "90m", "+". Style them (e.g., rounded rectangles, dark grey background, white text). Arrange horizontally.
        - **4.3 Mode Buttons:** Implement `TouchableOpacity` buttons for "Easy Mode", "Hard Mode". Style them similarly to duration buttons, perhaps with an indicator for the selected one (start with "Easy Mode" visually selected). Arrange horizontally.
        - **4.4 Layout & Styling:** Arrange the duration and mode button containers within `bottomControls` (likely vertically stacked). Adjust spacing and remove the temporary border from `bottomControls`.
    - **Success Criteria:** The bottom section displays horizontally arranged buttons for durations (25m, 50m, 90m, +) and below them, horizontally arranged buttons for modes (Easy Mode, Hard Mode). Buttons are styled for the dark theme, resembling the screenshot layout. One mode button (e.g., Easy) appears visually distinct as the default selection.

5.  **Task 5: Basic Styling Pass**

6.  **Task 6: State Management Setup**
    *   **Goal:** Add state variables for picker visibility and selected duration in `app/(tabs)/index.tsx`.
    *   **Sub-Tasks:**
        *   6.1: Import `useState` from React.
        *   6.2: Add state `[selectedDuration, setSelectedDuration]` initialized to 0 (default).
        *   6.3: Add state `[isPickerVisible, setIsPickerVisible]` initialized to `false`.
    *   **Success Criteria:** State variables `selectedDuration` and `isPickerVisible` are defined and initialized correctly in the `HomeScreen` component.

7.  **Task 7: Update Timer Display (Dynamic Formatting)**
    - **Goal:** Implement dynamic formatting for the timer display.
    - **Sub-Tasks:**
        - **7.1:** Create a helper function `formatDuration(totalMinutes)` to convert minutes to a formatted string.
        - **7.2:** Update the Text component rendering the timer to use this helper function.
    - **Success Criteria:** The timer display dynamically formats the time based on the total minutes.

8.  **Task 8: Implement Preset Button Logic (State Update & Visuals)**
    - **Goal:** Implement the logic for updating the state and visuals when a preset button is pressed.

9.  **Task 9: Integrate Modal and Picker**
    - **Goal:** Implement the logic for updating the state and visuals when a preset button is pressed.
    - **Sub-Tasks:**
        - **9.1:** Import Modal and Pressable
        - **9.2:** Import CustomDurationPicker
        - **9.3:** Add Modal component
        - **9.4:** Add Pressable backdrop
        - **9.5:** Add View modalContentContainer
        - **9.6:** Render CustomDurationPicker with props
        - **9.7:** Define handleDurationSelect function
        - **9.8:** Define modalBackdrop and modalContentContainer styles
    - **Success Criteria:** The modal and picker are implemented correctly and can be used to select a duration.

10. **Task 10: Implement "+" Button Logic**
    - **Goal:** Implement the logic for updating the state and visuals when a preset button is pressed.
    - **Sub-Tasks:**
        - **10.1:** Add an onPress handler to the "+" button's TouchableOpacity.
        - **10.2:** Ensure the "+" button does not get the selected style visually.

11. **Task 11: State Management for Focus Mode**
    - **Goal:** Add state variable for focus mode in `app/(tabs)/index.tsx`.
    - **Sub-Tasks:**
        - **11.1:** Add state `[focusMode, setFocusMode]` initialized to 'easy'.
    - **Success Criteria:** State variable `focusMode` is defined and initialized correctly in the `HomeScreen` component.

12. **Task 12: Implement Mode Button Logic & Visuals**
    - **Goal:** Implement the logic for updating the state and visuals when a mode button is pressed.
    - **Sub-Tasks:**
        - **12.1:** Add onPress handlers
        - **12.2:** Conditional button style
        - **12.3:** Conditional text style (incl. Hard mode red)
        - **12.4:** Conditional icon color (incl. Hard mode red)
    - **Success Criteria:** The mode buttons are implemented correctly and can be used to select a mode.

13. **Task 13: Implement Conditional 2XP Indicator (Superseded by Tooltip)**
    - **Goal:** Implement the logic for displaying a 2XP indicator based on the focus mode.
    - **Sub-Tasks:**
        - **13.1:** Locate timer Text component.
        - **13.2:** Add View below timer Text.
        - **13.3:** Conditionally render "2XP".
        - **13.4:** Add style hardModeIndicator.
        - **13.5:** Note: Feature replaced by Hard Mode tooltip in subsequent steps.
    - **Success Criteria:** The 2XP indicator is displayed based on the focus mode.

14. **Task 14: Timer State Management**
    - **Goal:** Add state variables required for managing the timer's lifecycle in `app/(tabs)/index.tsx`.
    - **Sub-Tasks:**
        - 14.1: Import `useState` and `useEffect` from React.
        - 14.2: Add state `[isActive, setIsActive]` initialized to `false`.
        - 14.3: Add state `[isPaused, setIsPaused]` initialized to `false`.
        - 14.4: Add state `[remainingTime, setRemainingTime]` (in seconds) initialized based on the default or selected duration (e.g., `selectedDuration * 60` or a default value like `25 * 60`).
    - **Success Criteria:** State variables `isActive`, `isPaused`, and `remainingTime` are defined and initialized correctly in the `HomeScreen` component.

15. **Task 15: Timer Logic (Interval)**
    - **Goal:** Implement the core countdown mechanism using `setInterval`.
    - **References:** `useEffect`, `setInterval`, `clearInterval`.
    - **Sub-Tasks:**
        - 15.1: Create a `useEffect` hook that runs when `isActive` or `isPaused` changes.
        - 15.2: Inside the effect, if `isActive` is true and `isPaused` is false, set up an interval (`setInterval`) that decrements `remainingTime` by 1 every second (1000ms).
        - 15.3: Store the interval ID returned by `setInterval`.
        - 15.4: Implement the cleanup function for the `useEffect` hook to clear the interval (`clearInterval`) using the stored ID. This prevents memory leaks when the component unmounts or the dependencies change.
        - 15.5: Ensure the interval stops if `remainingTime` reaches 0 (handled in Task 18).
    - **Success Criteria:** A `useEffect` hook correctly manages a `setInterval` that decrements `remainingTime` only when the timer should be actively running. The interval is properly cleaned up.

16. **Task 16: Start/Pause/Resume Button Logic**
    - **Goal:** Modify the "Start Focus" button to handle starting, pausing, and resuming the timer, respecting the focus mode.
    - **References:** `TouchableOpacity`, `useState` setters (`setIsActive`, `setIsPaused`), `focusMode` state.
    - **Sub-Tasks:**
        - 16.1: Create a handler function `handleStartPauseResume`.
        - 16.2: **Start:** If `!isActive`, set `isActive` to `true`, `isPaused` to `false`, and initialize `remainingTime` based on `selectedDuration * 60`. If `selectedDuration` is 0, perhaps default to 25 minutes or show an alert.
        - 16.3: **Pause:** If `isActive && !isPaused && focusMode === 'easy'`, set `isPaused` to `true`.
        - 16.4: **Resume:** If `isActive && isPaused && focusMode === 'easy'`, set `isPaused` to `false`.
        - 16.5 (Revised): Attach `handleStartPauseResume` to the `onPress` of the main action button. Conditionally render the button itself based on `focusMode === 'easy'` when timer is active.
        - 16.6: Update the button's icon dynamically based on state: `play` (initial/reset/paused), `pause` (running & easy mode).
    - **Success Criteria:** The main button correctly starts, pauses (only in easy mode), and resumes (only in easy mode) the timer. The button is hidden in hard mode when the timer is active. The icon updates correctly.

17. **Task 17: Reset Button Logic**
    - **Goal:** Add a way to cancel or reset the timer while it's active or paused (visible in both modes).
    - **Sub-Tasks:**
        - 17.1: Add a new `TouchableOpacity` button (e.g., "Cancel" or an icon).
        - 17.2 (Revised): Conditionally render this button only when `isActive` is `true` (regardless of `focusMode`).
        - 17.3: Create a handler function `handleReset`.
        - 17.4: Inside `handleReset`, set `isActive` to `false`, `isPaused` to `false`, and reset `remainingTime` to the initial `selectedDuration * 60` (or default).
        - 17.5: Attach `handleReset` to the `onPress` of the reset button.
    - **Success Criteria:** A reset button appears when the timer is running or paused (in easy or hard mode). Pressing it stops the timer and resets its state variables.

18. **Task 18: Timer Completion Logic**
    - **Goal:** Stop the timer automatically when `remainingTime` reaches zero and handle completion.
    - **Sub-Tasks:**
        - 18.1: Modify the `setInterval` callback (from Task 15): Before decrementing, check if `remainingTime <= 1`.
        - 18.2: If `remainingTime` is about to reach 0, set `isActive` to `false`, clear the interval explicitly (optional, as the effect cleanup should handle it), reset `remainingTime` (perhaps to initial duration for the next run), and potentially trigger haptic feedback or sound.
        - 18.3: (Future) Trigger navigation to the Session Summary screen. For now, maybe just log a message or show an alert.
    - **Success Criteria:** The timer stops (`isActive` becomes false) when `remainingTime` reaches 0.

19. **Task 19: Update Timer Display (MM:SS)**
    - **Goal:** Format the `remainingTime` (in seconds) into a `MM:SS` string for display.
    - **Sub-Tasks:**
        - 19.1: Modify the existing `formatDuration` function or create a new `formatTime(seconds)` helper function.
        - 19.2: The function should calculate minutes (`Math.floor(seconds / 60)`) and remaining seconds (`seconds % 60`).
        - 19.3: Format both minutes and seconds to have leading zeros if less than 10 (e.g., `05:09`).
        - 19.4: Update the `ThemedText` component displaying the timer to use `formatTime(remainingTime)`.
    - **Success Criteria:** The central timer display shows the `remainingTime` state formatted correctly as MM:SS, updating every second when active.

20. **Task 20: Basic App Background Handling**
    - **Goal:** Implement basic logic to pause the timer if the app goes into the background.
    - **References:** `AppState` from `react-native`, `useEffect`.
    - **Sub-Tasks:**
        - 20.1: Import `AppState` from `react-native`.
        - 20.2: Add a `useEffect` hook to subscribe to `AppState` changes ('change' event).
        - 20.3: In the event handler, check the `nextAppState`. If it's 'background' or 'inactive', and the timer is active (`isActive && !isPaused`), store the current timestamp and set `isPaused` to true.
        - 20.4: If the `nextAppState` is 'active' and the timer was paused due to backgrounding, calculate the time difference since backgrounding (optional, can simply resume). Set `isPaused` back to `false` if it was paused *only* due to backgrounding.
        - 20.5: Ensure the subscription is removed in the effect's cleanup function.
    - **Success Criteria:** The timer pauses automatically if the app enters the background while the timer is running and resumes (or stays paused if manually paused before) when the app returns to the foreground. *(Initial implementation might just pause without sophisticated time tracking).*

21. **Task 21: Implement Focus Mode UI (Maintain Layout) (Final Revision - Placeholders)**
    - **Goal:** Hide non-essential UI elements visually and interactively when the timer is active (`isActive` is true), while strictly maintaining layout stability.
    - **Sub-Tasks:**
        - 21.1: Define a style `styles.hiddenElement { opacity: 0, pointerEvents: 'none' }`.
        - 21.2: Revert previous conditional rendering. Apply `isActive && styles.hiddenElement` to the `style` prop array of `streakContainer`, `xpSectionContainer`, `durationContainer`, `modeContainer`, `tooltipContainer`.
        - 21.3: Verify spacer View in `topBar` is present.
        - 21.4: Verify Settings cog, timer circle/button, timer text, and cancel button remain visible/correctly handled and **do not shift position at all**.
    - **Success Criteria:** When `isActive` is true, the specified containers become invisible and non-interactive but still occupy the same layout space, preventing other elements from shifting. When `isActive` is false, all elements are visible and interactive.

22. **Task 22: Adjust Active Timer Layout (Reverted)**
    - **Goal:** Ensure the Timer Circle, Timer Text, and Cancel button are positioned correctly within the `centerContent` area when the timer is active.
    - **Sub-Tasks:**
        - 22.1: Revert conditional style (`centerContentActive`). (Done)
        - 22.2: Re-evaluate layout after revised Task 21 (Fourth Rev) is implemented.
    - **Success Criteria:** When the timer is active, the Timer Circle, Timer Text, and Cancel button are vertically spaced/aligned pleasingly, ideally without shifting from their inactive positions.

23. **Task 23: Implement Mode-Specific Background Handling**
    - **Goal:** Ensure the timer pauses (Easy Mode) or resets (Hard Mode) correctly when the app enters the background or becomes inactive, matching the tooltip warnings.
    - **References:** Task 20 (Basic Background Handling), `AppState`, `focusMode`, `isActive`, `handleReset`.
    - **Sub-Tasks:**
        - 23.1: **Locate AppState Listener:** Find the `useEffect` hook subscribing to `AppState` changes.
        - 23.2: **Modify Handler Logic:** Inside the `AppState` change handler:
            - Check if `isActive` is true when the app state changes to 'background' or 'inactive'.
            - If `isActive` is true:
                - Check `focusMode`.
                - **If `focusMode === 'easy'`:** Implement the current logic (set `isPaused` to true, set `appStatePausedRef` to true).
                - **If `focusMode === 'hard'`:** Call the `handleReset()` function directly. Optionally log that the session was cancelled due to backgrounding.
            - Check the logic for returning to 'active': Ensure it only resumes (`setIsPaused(false)`) if `appStatePausedRef` was true (meaning easy mode paused it). Reset `appStatePausedRef` after handling.
        - 23.3: **Verify `handleReset`:** Double-check that `handleReset` fully cleans up the timer state (stops interval, resets `isActive`, `isPaused`, `remainingTime`). (Current implementation seems okay).
    - **Success Criteria:**
        - In Easy Mode, starting the timer, backgrounding the app, and returning resumes the timer from where it left off.
        - In Easy Mode, manually pausing, backgrounding, and returning keeps the timer paused.
        - In Hard Mode, starting the timer and backgrounding the app cancels the session (timer stops, remaining time resets, UI reverts to inactive state).

24. **Task 24: Implement Screen Keep-Awake**
    - **Goal:** Prevent the device screen from automatically locking/sleeping while the focus timer (`isActive`) is running.
    - **References:** `expo-keep-awake` documentation, `useEffect`, `isActive` state.
    - **Sub-Tasks:**
        - **24.1: Install Dependency:** Add the `expo-keep-awake` package to the project.
        - **24.2: Import:** Import `activateKeepAwakeAsync` and `deactivateKeepAwake` from `expo-keep-awake` in `app/(tabs)/index.tsx`.
        - **24.3: Implement Effect:** Create a `useEffect` hook that depends on the `isActive` state.
        - **24.4: Activation Logic:** Inside the effect, if `isActive` is `true`, call `activateKeepAwakeAsync()`. Handle potential errors.
        - **24.5: Deactivation Logic:** Inside the effect, if `isActive` is `false`, call `deactivateKeepAwake()`.
        - **24.6: Cleanup Logic:** Ensure the `useEffect`'s cleanup function *also* calls `deactivateKeepAwake()`.
    - **Success Criteria:**
        - Start the focus timer. Screen remains on past the normal auto-lock time.
        - Stop/reset the focus timer. Screen locks automatically after the normal auto-lock time.
        - Keep-awake is deactivated if the component unmounts while the timer is active.

## ✅ Project Status Board

*(Updating based on current state)*

- [x] Task 1: Set up Main Screen Structure in `index.tsx`
- [x] Task 2: Implement Top Bar Components
- [x] Task 3: Implement Central Focus Timer Display
- [x] Task 4: Implement Focus Session Controls (Presets)
- [x] Task 5: Basic Styling Pass *(implicitly done through iterations)*
- [x] Task 6: State Management Setup (Duration & Picker Visibility)
  - [x] 6.1: Import useState from React.
  - [x] 6.2: Add state [selectedDuration, setSelectedDuration] initialized to 0 (default).
  - [x] 6.3: Add state [isPickerVisible, setIsPickerVisible] initialized to false.
- [x] Task 7: Update Timer Display (Dynamic Formatting)
  - [x] 7.1: Create a helper function formatDuration(totalMinutes)
  - [x] 7.2: Update the Text component rendering the timer
- [x] Task 8: Implement Preset Button Logic (State Update & Visuals)
- [x] Task 9: Integrate Modal and Picker
  - [x] 9.1: Import Modal and Pressable
  - [x] 9.2: Import CustomDurationPicker
  - [x] 9.3: Add Modal component
  - [x] 9.4: Add Pressable backdrop
  - [x] 9.5: Add View modalContentContainer
  - [x] 9.6: Render CustomDurationPicker with props
  - [x] 9.7: Define handleDurationSelect function
  - [x] 9.8: Define modalBackdrop and modalContentContainer styles
- [x] Task 10: Implement "+" Button Logic
  - [x] 10.1: Add an onPress handler to the "+" button's TouchableOpacity.
  - [x] 10.2: Ensure the "+" button does not get the selected style visually.
- [x] Task 11: State Management for Focus Mode
  - [x] 11.1: Add state [focusMode, setFocusMode] initialized to 'easy'.
- [x] Task 12: Implement Mode Button Logic & Visuals
  - [x] 12.1: Add onPress handlers
  - [x] 12.2: Conditional button style
  - [x] 12.3: Conditional text style (incl. Hard mode red)
  - [x] 12.4: Conditional icon color (incl. Hard mode red)
- [x] Task 13: Implement Conditional 2XP Indicator (Superseded by Tooltip)
  - [x] 13.1: Locate timer Text component.
  - [x] 13.2: Add View below timer Text.
  - [x] 13.3: Conditionally render "2XP".
  - [x] 13.4: Add style hardModeIndicator.
  - [x] Note: Feature replaced by Hard Mode tooltip in subsequent steps.
- [x] Task 14: Timer State Management
  - [x] 14.1: Import useState and useEffect (*already imported*)
  - [x] 14.2: Add state [isActive, setIsActive]
  - [x] 14.3: Add state [isPaused, setIsPaused]
  - [x] 14.4: Add state [remainingTime, setRemainingTime]
- [x] Task 15: Timer Logic (Interval)
  - [x] 15.1: Create useEffect hook
  - [x] 15.2: Implement setInterval logic
  - [x] 15.3: Store interval ID
  - [x] 15.4: Implement interval cleanup
  - [x] 15.5: Ensure interval stops at 0
- [x] Task 16: Start/Pause/Resume Button Logic (Revised for Mode)
  - [x] 16.1: Create handleStartPauseResume
  - [x] 16.2: Implement Start logic
  - [x] 16.3: Implement Pause logic (Easy Mode only)
  - [x] 16.4: Implement Resume logic (Easy Mode only)
  - [x] 16.5 (Revised): Conditionally render button based on isActive & focusMode
  - [x] 16.6: Update button icon dynamically
- [x] Task 17: Reset Button Logic (Revised for Mode)
  - [x] 17.1: Add Reset button UI
  - [x] 17.2 (Revised): Conditionally render based on isActive only (*Verified, no code change needed*)
  - [x] 17.3: Create handleReset
  - [x] 17.4: Implement Reset logic
  - [x] 17.5: Attach handler to button
- [x] Task 18: Timer Completion Logic
  - [x] 18.1: Check for remainingTime <= 1 in interval
- [x] Task 19: Update Timer Display (MM:SS)
  - [x] 19.1: Create/Modify formatTime(seconds) helper
  - [x] 19.2: Implement MM:SS calculation
  - [x] 19.3: Add leading zero formatting
  - [x] 19.4: Update ThemedText to use formatTime
- [x] Task 20: Basic App Background Handling
  - [x] 20.1: Import AppState
  - [x] 20.2: Add useEffect for AppState subscription
  - [x] 20.3: Handle 'background'/'inactive' state (pause timer)
  - [x] 20.4: Handle 'active' state (resume/check state)
  - [x] 20.5: Implement subscription cleanup
- [x] Task 21: Implement Focus Mode UI (Maintain Layout) (Final Revision - Placeholders)
  - [x] 21.1: Define hiddenElement style
  - [x] 21.2: Apply conditional style to containers
  - [x] 21.3: Verify topBar spacer
  - [x] 21.4: Verify layout stability
- [x] Task 22: Adjust Active Timer Layout (Reverted)
  - [x] 22.1: Revert conditional style
- [x] Task 23: Implement Mode-Specific Background Handling
  - [x] 23.1: Locate AppState Listener
  - [x] 23.2: Modify Handler Logic (Easy/Hard Mode differentiation)
  - [x] 23.3: Verify `handleReset`
- [x] Task 24: Implement Screen Keep-Awake
  - [x] 24.1: Install Dependency
  - [x] 24.2: Import functions
  - [x] 24.3: Implement Effect
  - [x] 24.4: Activation Logic
  - [x] 24.5: Deactivation Logic
  - [x] 24.6: Cleanup Logic

## 🧑‍💻 Executor's Feedback or Assistance Requests

- Task 15: Added timer interval logic. Noticed `remainingTime` state does not automatically update if `selectedDuration` changes while the timer is *inactive*. Need a separate effect or logic modification to handle this synchronization for a better UX. Will add this refinement now. *(Self-resolved with subsequent effect)*
- Need to implement the actual background handling logic described in the tooltips (Task 23). *(Done)*
- Need to implement screen keep-awake functionality (Task 24). *(Done)*

## 💡 Lessons

- Remember to synchronize state derived from other state (like `remainingTime` from `selectedDuration`) when the source state changes, especially if the derived state isn't actively being updated by another process (like the timer interval).
- Use placeholder elements with `opacity: 0` and `pointerEvents: 'none'` (matching the size/style of the real element) to prevent layout shifts during conditional rendering.
- App background/foreground behavior might need different handling depending on the application's state (e.g., easy vs. hard mode).
- Use `expo-keep-awake` (`activateKeepAwakeAsync`, `deactivateKeepAwake`) within a `useEffect` hook tied to relevant state (like a timer being active) to prevent the screen from auto-locking during critical periods.