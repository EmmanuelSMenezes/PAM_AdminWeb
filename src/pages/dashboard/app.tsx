import { Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { consumerAllGet } from 'src/service/consumer';
import { orderGet } from 'src/service/order';
import { getPartnerList } from 'src/service/partner';
import { SeoIllustration } from '../../assets/illustrations';
import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../../components/settings';
import DashboardLayout from '../../layouts/dashboard';
import { AppWelcome, AppWidgetSummary } from '../../sections/@dashboard/general/app';

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function GeneralAppPage() {
  const { user } = useAuthContext();
  const [partner, setPartner] = useState<number>(0);
  const [order, setOrder] = useState<number>(0);
  const [consumer, setConsumer] = useState<number>(0);
  const filter = {
    itensPerPage: 5,
    page: 0,
    filter: '',
  };
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();

  async function listPartner() {
    try {
      const partnerGet = await getPartnerList({ ...filter });
      setPartner(partnerGet.pagination.totalRows);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }

  async function listOrder() {
    try {
      const ordersGet = await orderGet({admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id, 
        status: '', consumer: '', partner: '', page: 0, itensPerPage: 5, start_date: '', end_date: '', order_number: ''});
      setOrder(ordersGet.pagination.totalRows);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }

  async function listConsumer() {
    try {
      const totalConsumer = await consumerAllGet();
      setConsumer(totalConsumer.length)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    listPartner();
    listOrder();
    listConsumer();
  }, []);

  return (
    <>
      <Head>
        <title>Administrador | Dashboard</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome
              title={`Bem vindo de volta! \n ${user?.profile.fullname}`}
              description="Aqui você pode acompanhar as últimas atualizações relacionadas ao seu negócio. "
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total de Parceiros"
              total={partner}
              percent={2.0}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total de Pedidos"
              percent={3.0}
              total={order}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total de Consumidores"
              percent={-0.1}
              total={consumer}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
