import { Box, BoxProps, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NextLink from 'next/link';
import { forwardRef } from 'react';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const logo = (
      <Box
        component="img"
        src={theme.palette.primary.logo || '/logo/logo.png'}
        sx={{ width: '150px', backgroundColor: '#FFF', height: '100', cursor: 'pointer', ...sx }}
        {...other}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={NextLink} href="/dashboard" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
