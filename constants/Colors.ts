/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#EAEAEA',
    background: '#000000',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
    textOff: '#A0A0A0',
    textMuted: '#6E6E73',
    inputBackground: '#1C1C1E',
    inputText: '#EAEAEA',
    inputBorder: '#3A3A3C',
    tintPressed: '#C7C7CC',
    buttonDisabled: '#2C2C2E',
    textSuccess: '#34C759', // iOS system green
    placeholderText: '#8E8E93', // Standard iOS dark mode placeholder grey
  },
};
