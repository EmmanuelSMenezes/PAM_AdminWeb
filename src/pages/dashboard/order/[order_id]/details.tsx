import { Icon } from '@iconify/react';
import { Button, Container, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IChatResponse } from 'src/@types/communication';
import { IOrderDetails } from 'src/@types/order';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify';
import { useChatContext } from 'src/hooks/useChatContext';
import { createChat, getConversations } from 'src/redux/slices/chat';
import { orderDetailsGet } from 'src/service/order';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
import DashboardLayout from '../../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import OrderDetails from '../../../../sections/@dashboard/order/OrderDetails';

OrderDetailsPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrderDetailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { setPreSelectedChat } = useChatContext();
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const { push } = useRouter()
  const [dataOrder, setDataOrder] = useState<IOrderDetails>();
  
  const {
    query: { order_id },
  } = useRouter();

  const handleOpenChatWithPartner = async() => {
    setIsLoading(true)
    try {
      const chatList = await getConversations(user?.user_id);
      if (dataOrder){
        const chat = chatList.filter((element: IChatResponse)=> element.closed === null && element.members.includes(dataOrder.partner.user_id))[0];
      
        if (chat) {
        setPreSelectedChat(chat.chat_id);
        push(PATH_DASHBOARD.chat.root);
      } else {
        const newChat = await createChat({order_id: null, members: [dataOrder?.partner?.user_id, user?.user_id]});
        if (newChat) {
          setPreSelectedChat(newChat.chat_id);
          push(PATH_DASHBOARD.chat.root);
        }
      } }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (order_id && typeof order_id === 'string') {
      const partnerById = async () => {
        try {
          const orderData = await orderDetailsGet(order_id);
          setDataOrder(orderData);
        } catch {
          console.error('erro teste');
        }
      };
      partnerById();
    }
  }, [order_id]);

  const currentOrder = dataOrder;

  return (
    <>
      <Head>
        <title>Administrador | Detalhes do Pedido</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Detalhes do Pedido"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Pedidos', href: PATH_DASHBOARD.order.list },
            { name: 'Detalhes do Pedido' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Tooltip title="Voltar">
                <Button component={NextLink} href={PATH_DASHBOARD.order.list} size="small" variant="contained">
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
                {!isLoading ?
                <Icon icon="ph:chat-centered-dots-light" width="30" height="30" /> : 
                <Icon icon="eos-icons:bubble-loading" width="30" height="30" />}
                </Button>
              </Tooltip>
            </Container>
          }
        />
        {currentOrder !== undefined && <OrderDetails currentOrder={currentOrder} /> }
      </Container>
    </>
  );
}
