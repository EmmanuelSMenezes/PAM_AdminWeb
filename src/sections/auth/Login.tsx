import { Stack, Typography } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import LoginLayout from '../../layouts/login';
import AuthLoginForm from './AuthLoginForm';
import AuthNewPasswordForm from './AuthNewPasswordForm';

export default function Login() {
  const { temporaryPassword } = useAuthContext();

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Portal do Administrador</Typography>
      </Stack>

      {temporaryPassword ? <AuthNewPasswordForm /> : <AuthLoginForm />}

    </LoginLayout>
  );
}
