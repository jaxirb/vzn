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

## ✅ Project Status Board

- [x] Task 1: Set up Main Screen Structure in `index.tsx`
- [x] Task 2: Implement Top Bar Components
  - [x] 2.1: Verify `@expo/vector-icons` installed
  // ... other completed subtasks ...
- [x] Task 3: Implement Central Focus Timer Display
  - [x] 3.1: Set up structure in `centerContent`
  - [x] 3.2: Implement Circular Placeholder
  - [x] 3.3: Implement Timer Text ("25:00")
  - [x] 3.4: Implement Mode Text ("Easy Mode")
  - [x] 3.5: Implement Start Button ("▶ Start Focus")
  - [x] 3.6: Layout & Final Styling
- [x] Task 4: Implement Focus Session Controls
  - [x] 4.1: Set up structure in `bottomControls`
  - [x] 4.2: Implement Duration Buttons (25m, 50m, 90m, +)
  - [x] 4.3: Implement Mode Buttons (Easy, Hard)
  - [x] 4.4: Layout & Final Styling
- [ ] Task 5: Basic Styling Pass
// ... remaining subtasks ...