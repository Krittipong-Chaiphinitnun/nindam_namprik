/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#C92C2C'; // Chili Red
const tintColorDark = '#FF5C5C'; // Bright Chili Red

export const Colors = {
  light: {
    text: '#2E221E', // Dark Espresso/Cinnamon
    background: '#FFFDFB', // Soft Cream
    tint: tintColorLight,
    icon: '#7E6D67',
    tabIconDefault: '#8F7E78',
    tabIconSelected: tintColorLight,
    card: '#FBF5ED', // Warm light card background
    border: '#EFE3D5',
    accent: '#E67A15', // Spicy Orange
  },
  dark: {
    text: '#F5ECE8', // Warm Soft White
    background: '#150F0D', // Deep Pepper Charcoal
    tint: tintColorDark,
    icon: '#A3918B',
    tabIconDefault: '#7D6A64',
    tabIconSelected: tintColorDark,
    card: '#1F1714', // Rich dark brown card background
    border: '#322521',
    accent: '#FF8A1E', // Flame Orange
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
