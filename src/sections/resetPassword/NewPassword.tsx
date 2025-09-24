import {Stack, Typography} from '@mui/material';
import NewPasswordForm from './AuthNewPasswordForm';

export default function NewPassword() {
  return (
    <Stack spacing={2}>

      <Typography sx={{ color: 'text.secondary', mb: 2 }}>
        Insira uma nova senha com 8 dígitos, incluindo letra maiúscula e caractere especial.
      </Typography>

      <NewPasswordForm />
      
    </Stack>
  );
}
