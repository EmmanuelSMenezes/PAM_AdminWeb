import { Typography } from '@mui/material';
import CompactLayout from 'src/layouts/compact';
import { PasswordIcon } from 'src/assets/icons';
import NewPassword from 'src/sections/resetPassword/NewPassword';

NewPasswordPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

export default function NewPasswordPage() {
  return (
    <>
      <PasswordIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Altere sua senha
      </Typography>

      <NewPassword />
    </>
  );
}
