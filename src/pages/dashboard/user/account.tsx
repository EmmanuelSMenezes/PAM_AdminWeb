import { Box, Container, Tab, Tabs } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  AccountChangePassword, AccountFee, AccountGeneral, AccountPesonalization
} from '../../../sections/@dashboard/user/account';

UserAccountPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('general');

  const TABS = [
    {
      value: 'general',
      label: 'Usuário',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },
    // {
    //   value: 'billing',
    //   label: 'Billing',
    //   icon: <Iconify icon="ic:round-receipt" />,
    //   component: (
    //     <AccountBilling
    //       cards={_userPayment}
    //       addressBook={_userAddressBook}
    //       invoices={_userInvoices}
    //     />
    //   ),
    // },
    // {
    //   value: 'social_links',
    //   label: 'Social links',
    //   icon: <Iconify icon="eva:share-fill" />,
    //   component: <AccountSocialLinks socialLinks={_userAbout.socialLinks} />,
    // },
    {
      value: 'change_password',
      label: 'Alterar Senha',
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },
    {
      value: 'fee',
      label: 'Taxas',
      icon: <Iconify icon="ic:baseline-percentage" />,
      component: <AccountFee />,
    },
    {
      value: 'Personalization',
      label: 'Personalização',
      icon: <Iconify icon="ic:baseline-edit-note" />,
      component: <AccountPesonalization />,
    },
  ];

  const newTab = user?.sponsor_id !== null ? TABS.slice(0, 3) : TABS;

  return (
    <>
      <Head>
        <title>Administrador | Minha Conta</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Minha Conta"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Minha Conta' }]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {newTab.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {newTab.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
