import { LED_COLOR } from '../hooks/useLegoBoost';
import type { LedColor } from '../hooks/useLegoBoost';

export interface ColorDefinition {
  key: string;
  value: LedColor;
  cssColor: string;
}

export const LED_COLORS: ColorDefinition[] = [
  { key: 'colors.off', value: LED_COLOR.OFF, cssColor: '#1e293b' },
  { key: 'colors.pink', value: LED_COLOR.PINK, cssColor: '#ec4899' },
  { key: 'colors.purple', value: LED_COLOR.PURPLE, cssColor: '#a855f7' },
  { key: 'colors.blue', value: LED_COLOR.BLUE, cssColor: '#3b82f6' },
  { key: 'colors.lightBlue', value: LED_COLOR.LIGHT_BLUE, cssColor: '#38bdf8' },
  { key: 'colors.cyan', value: LED_COLOR.CYAN, cssColor: '#06b6d4' },
  { key: 'colors.green', value: LED_COLOR.GREEN, cssColor: '#22c55e' },
  { key: 'colors.yellow', value: LED_COLOR.YELLOW, cssColor: '#eab308' },
  { key: 'colors.orange', value: LED_COLOR.ORANGE, cssColor: '#f97316' },
  { key: 'colors.red', value: LED_COLOR.RED, cssColor: '#ef4444' },
  { key: 'colors.white', value: LED_COLOR.WHITE, cssColor: '#f8fafc' },
];
