import { Icon } from '@iconify/react';
import { Button, Container, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IChatResponse } from 'src/@types/communication';
import { IPartnerById } from 'src/@types/partner';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useChatContext } from 'src/hooks/useChatContext';
import { createChat, getConversations } from 'src/redux/slices/chat';
import { getPartnerById } from 'src/service/partner';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Iconify from '../../../../components/iconify';
import { useSettingsContext } from '../../../../components/settings';
import DashboardLayout from '../../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import PartnerEditForm from '../../../../sections/@dashboard/user/PartnerEditForm';

UserEditPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function UserEditPage() {
  const { setPreSelectedChat } = useChatContext();
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const [dataPartner, setDataPartner] = useState<IPartnerById>();
  const { push } = useRouter();

  const {
    query: { user_id },
  } = useRouter();

  const handleOpenChatWithPartner = async() => {
    try {
      const chatList = await getConversations(user?.user_id);
      if (dataPartner){
        const chat = chatList.filter((element: IChatResponse)=> element.closed === null && element.members.includes(dataPartner?.user_id))[0];
        if (chat) {
          setPreSelectedChat(chat);
          push(PATH_DASHBOARD.chat.root);
        } else {
          const newChat = await createChat({order_id: null, members: [dataPartner?.user_id, user?.user_id]});
          if (newChat) {
            setPreSelectedChat(newChat);
            push(PATH_DASHBOARD.chat.root);
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user_id && typeof user_id === 'string') {
      const partnerById = async () => {
        try {
          const partnerData = await getPartnerById(user_id);
          setDataPartner(partnerData);
        } catch {
          console.error('erro teste');
        }
      };
      partnerById();
    }
  }, [user_id]);

  const currentPartner = dataPartner;

  return (
    <>
      <Head>
        <title>Administrador | Editar Parceiro</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Editar Parceiro"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Parceiros',
              href: PATH_DASHBOARD.partner.list,
            },
            { name: currentPartner?.legal_name },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Tooltip title="Voltar">
                <Button component={NextLink} href={PATH_DASHBOARD.partner.list} variant="contained" size="small">
                  <Iconify icon="pajamas:go-back" />
                </Button>
              </Tooltip>
              <Tooltip title="Falar com o Parceiro">
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={handleOpenChatWithPartner}
                  // loading={isSubmitting}
                >
                <Icon icon="ph:chat-centered-dots-light" width="30" height="30" />
                </Button>
              </Tooltip>
            </Container>
          }
        />

        <PartnerEditForm isEdit currentPartner={currentPartner} />
      </Container>
    </>
  );
}
