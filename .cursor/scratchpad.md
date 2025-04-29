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