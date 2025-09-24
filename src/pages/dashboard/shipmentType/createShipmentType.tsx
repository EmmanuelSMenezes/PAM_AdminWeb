import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Container, Grid, Stack, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import { deliveryCreate } from 'src/service/billing';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface FormValuesProps {
  name: string;
}

CreateShipmentTypePage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CreateShipmentTypePage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    name: '',
  }

  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required('O nome é obrigatório')
      .min(3, 'O nome deve ter pelo menos 3 caracteres')
      .max(50, 'O nome não pode ter mais de 50 caracteres'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
    mode: 'all'
  })

  const {
    handleSubmit,
    watch,
    reset,
    formState: {isSubmitting}
  } = methods;

  const onSubmit = async(data: FormValuesProps) => {
    try {
       await deliveryCreate(data.name) ;
       enqueueSnackbar('Tipo de frete cadastrado com sucesso!', {
        variant: 'success',
      });
      reset()
    } catch (error) {
      enqueueSnackbar('Não foi possivel cadastrar o Tipo de Frete. Verifique os campos e tente novamente!', {
        variant: 'error',
      });
    }
  } 

  return (
    <>
      <Head>
        <title>Administrador | Cadastro do Tipo de Frete</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cadastrar Tipo de Frete"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Tipos de Frete', href: PATH_DASHBOARD.shipmentType.list },
            {name: 'Cadatrar Tipo de Frete' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Tooltip title="Voltar">
                <Button component={NextLink} href={PATH_DASHBOARD.shipmentType.list} size="small" variant="contained">
                  <Iconify icon="pajamas:go-back" />
                </Button>
              </Tooltip>
            </Container>
          }
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField name="name" label="*Nome:" />
                  </Stack>
              </Box>
            </Card>

            <Stack spacing={3}>
              <LoadingButton type="submit" variant="contained" 
                disabled={watch('name') === ''} 
                size="medium" loading={isSubmitting}>
                Criar
              </LoadingButton>
            </Stack>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
