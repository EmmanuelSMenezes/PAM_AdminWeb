import NextLink from 'next/link';
import { Typography, Link } from '@mui/material';
import { PasswordIcon } from 'src/assets/icons';
import Iconify from 'src/components/iconify/Iconify';
import { PATH_AUTH } from '../../routes/paths';
import AuthResetPasswordForm from './AuthResetPasswordForm';

export default function ResetPassword() {
  return (
    <>
      <PasswordIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Esqueceu sua senha?
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Digite o endereço de e-mail associado à sua conta e enviaremos um link para redefinir sua
        senha.
      </Typography>

      <AuthResetPasswordForm />

      <Link
        component={NextLink}
        href={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Voltar para fazer login
      </Link>
    </>
  );
}
