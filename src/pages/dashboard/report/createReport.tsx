import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Container, Grid, Stack, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify/Iconify';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider from '../../../components/hook-form';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface FormValuesProps { };

const defaultValues = { };

CreateReport.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CreateReport() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();


  const NewProductSchema = Yup.object().shape({
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
        // await createReport({ });
      reset();
      enqueueSnackbar('Relatório cadastrada com sucesso!', { variant: 'success' });
      push(PATH_DASHBOARD.report.list);
    } catch (error) {
      console.log(error, 'error');
      enqueueSnackbar(
        'Não foi possivel cadastrar a Relatório. Verifique os campos e tente novamente!',
        { variant: 'error' }
      );
    }
  };

  return (
    <>
      <Head>
        <title>Administrador | Relatório </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Relatórios"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Relatórios', href: PATH_DASHBOARD.report.list },
            { name: `Cadastrar Relatório`},
          ]}
          action={
            <Tooltip title="Voltar">
              <Button component={NextLink} href={PATH_DASHBOARD.report.list} size="small" variant="contained">
                <Iconify icon="pajamas:go-back" />
              </Button>
            </Tooltip>
          }
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              Report
            </Card>

            <Stack spacing={3}>
              <LoadingButton type="submit" variant="contained" size="medium" loading={isSubmitting}>
                Criar Relatório
              </LoadingButton>
            </Stack>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
