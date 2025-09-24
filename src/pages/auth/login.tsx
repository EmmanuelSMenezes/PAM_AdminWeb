import Head from 'next/head';
import GuestGuard from '../../auth/GuestGuard';
import Login from '../../sections/auth/Login';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Administrador | Login</title>
      </Head>

      <GuestGuard>
        <Login />
      </GuestGuard>
    </>
  );
}
