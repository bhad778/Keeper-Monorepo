import { navBarHeight } from 'constants/globalConstants';
import { Theme, ThemeName } from './types';

export const DEFAULT_COLORS = {
  primary: '#1e1e1e',
  secondary: '#cacaca',
  spinnerColor: 'white',
  darkGrey: '#282828',
  pink: '#F4C0FF',
  keeperGrey: '#f0f0f0',
  alert: '#ff1800',
  text: 'white',
  white: 'white',
  black: 'black',
  modalBackdrop: 'rgba(0,0,0,0.5)',
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 24,
  },
};

export const SPACING = {
  screenHeightWithNavbar: `calc(100vh - ${navBarHeight}px`,
  horizontalPadding: 150,
};

export enum GENERAL {
  borderWidth = 1.5,
}

export const DEFAULT_THEME: Theme = {
  name: ThemeName.Default,
  color: DEFAULT_COLORS,
  spacing: SPACING,
  general: GENERAL,
};
