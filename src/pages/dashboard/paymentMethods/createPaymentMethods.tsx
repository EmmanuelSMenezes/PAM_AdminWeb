import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Container, Grid, Stack, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import { paymentCreate } from 'src/service/billing';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface FormValuesProps {
  description: string;
}

CreatePaymentMethodsPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function CreatePaymentMethodsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    description: '',
  };

  const NewProductSchema = Yup.object().shape({
    description: Yup.string()
      .required('O título é obrigatório')
      .min(3, 'O título deve ter pelo menos 3 caracteres')
      .max(50, 'O título não pode ter mais de 50 caracteres'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await paymentCreate(data?.description);
      enqueueSnackbar('Meio de Pagamento cadastrado com sucesso!', {
        variant: 'success',
      });
      reset();
    } catch (error) {
      enqueueSnackbar(
        'Não foi possível cadastrar o Meio de Pagamento. Verifique os campos e tente novamente!',
        {
          variant: 'error',
        }
      );
    }
  };

  return (
    <>
      <Head>
        <title>Administrador | Cadastro do Meio de Pagamento</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cadastrar"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Meios de Pagamento', href: PATH_DASHBOARD.paymentMethods.list },
            { name: 'Cadatrar Meio de Pagamento' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Tooltip title="Voltar">
                <Button
                  component={NextLink}
                  href={PATH_DASHBOARD.paymentMethods.list}
                  size="small"
                  variant="contained"
                >
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
                  <RHFTextField name="description" label="*Título:" />
                </Stack>
              </Box>
            </Card>

            <Stack spacing={3}>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={watch('description') === ''}
                size="medium"
                loading={isSubmitting}
              >
                Criar
              </LoadingButton>
            </Stack>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
