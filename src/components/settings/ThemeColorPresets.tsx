import merge from 'lodash/merge';
import { useMemo } from 'react';
// @mui
import { alpha, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
//
import { useSettingsContext } from './SettingsContext';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeColorPresets({ children }: Props) {
  const outerTheme = useTheme();
  const { presetsColor } = useSettingsContext();

  function transformKeysToLowercase<T extends Record<string, any>>(obj: T): Record<string, any> {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('Por favor, forneça um objeto válido.');
    }

    const transformedObj: Record<string, any> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const lowercaseKey = key.toLowerCase();
        transformedObj[lowercaseKey] = obj[key];
      }
    }

    return transformedObj;
  }

  const themeOptions = useMemo(
    () => ({
      palette: {
        primary: transformKeysToLowercase(presetsColor),
      },
      customShadows: {
        primary: `0 8px 16px 0 ${alpha(transformKeysToLowercase(presetsColor).main, 0.24)}`,
      },
    }),
    [presetsColor]
  );

  const theme = createTheme(merge(outerTheme, presetsColor && themeOptions));

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
