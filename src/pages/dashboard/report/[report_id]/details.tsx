import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Container, Grid, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IOrderDetails } from 'src/@types/order';
import Iconify from 'src/components/iconify';
import { orderDetailsGet } from 'src/service/order';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import FormProvider from '../../../../components/hook-form';
import { useSettingsContext } from '../../../../components/settings';
import DashboardLayout from '../../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../../routes/paths';

OrderDetailsPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
interface FormValuesProps { };

const defaultValues = { };

export default function OrderDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const [dataOrder, setDataOrder] = useState<IOrderDetails>();
  
  const {
    query: { order_id },
  } = useRouter();

  const NewProductSchema = Yup.object().shape({
  });


  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues
  });

  const {
    handleSubmit
  } = methods;


  const onSubmit = async (data: FormValuesProps) => {
    
  };

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


  return (
    <>
      <Head>
        <title>Administrador | Relatórios</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Detalhes do Relatório"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Relatórios', href: PATH_DASHBOARD.report.list },
            { name: 'Detalhes do Relatório' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Tooltip title="Voltar">
                <Button component={NextLink} href={PATH_DASHBOARD.report.list} size="small" variant="contained">
                  <Iconify icon="pajamas:go-back" />
                </Button>
              </Tooltip>
            </Container>
          }
        />
       <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              Relatório
            </Card>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
