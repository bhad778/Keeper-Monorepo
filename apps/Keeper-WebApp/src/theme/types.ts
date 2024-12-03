import { DEFAULT_COLORS, SPACING, GENERAL } from 'theme/default.theme';

export enum ThemeName {
  Default = 'default',
}
export interface Theme {
  name: ThemeName;
  color: typeof DEFAULT_COLORS;
  spacing: typeof SPACING;
  general: typeof GENERAL;
}
