import { useTheme } from '@mui/material/styles';

export function hexToRgb(hex: string) {
  hex = hex
    ?.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m: any, r: any, g: any, b: any) => `#${r}${r}${g}${g}${b}${b}`
    )
    .substring(1);

  return hex?.match(/.{2}/g)?.map((x: string) => parseInt(x, 16)) ?? [];
}

export function useHexToRgbFromTheme() {
  const theme = useTheme();
  const primaryMainColor = theme.palette.primary.main;

  return hexToRgb(primaryMainColor);
}
