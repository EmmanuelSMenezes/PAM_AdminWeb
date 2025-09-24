import Head from 'next/head';
import ResetPassword from 'src/sections/auth/ResetPassword';
import GuestGuard from 'src/auth/GuestGuard';
import CompactLayout from '../../layouts/compact';

ResetPasswordPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Administrador | Esqueceu Senha</title>
      </Head>

      <GuestGuard>
        <ResetPassword />
      </GuestGuard>
    </>
  );
}
