import NextLink from 'next/link';
import { Stack, Typography, Link } from '@mui/material';
import LoginLayout from '../../layouts/login';
import { PATH_AUTH } from '../../routes/paths';
import AuthRegisterForm from './AuthRegisterForm';

export default function Register() {
  return (
    <LoginLayout title="">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Cadastro de Parceiro</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Já tem uma conta? </Typography>

          <Link component={NextLink} href={PATH_AUTH.login} variant="subtitle2">
            Entrar
          </Link>
        </Stack>
      </Stack>

      <AuthRegisterForm />
    </LoginLayout>
  );
}
