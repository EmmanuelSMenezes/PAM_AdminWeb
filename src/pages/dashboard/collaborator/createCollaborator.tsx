import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Container, Grid, Stack, Tooltip } from '@mui/material';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify';
import { collaboratorCreate } from 'src/service/collaborator';
import { maskCpfCnpj } from 'src/utils/formatForm';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface FormValuesProps {
  roleName: number;
  fullname: string;
  sponsor_id: string;
  email: string;
  document: string;
}

CreateCollaboratorPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CreateCollaboratorPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { push } = useRouter();

  const defaultValues = {
    roleName: 1,
    fullname: '',
    sponsor_id: user?.user_id,
    email: '',
    document: ''
  }

  const NewProductSchema = Yup.object().shape({
    fullname: Yup.string()
      .required('O nome é obrigatório')
      .min(3, 'O nome deve ter pelo menos 3 caracteres')
      .max(50, 'O nome não pode ter mais de 50 caracteres'),
    email: Yup.string().email('Insira um email válido').required('O email é obrigatório').test({message: 'Email Inválido', test:(value)=> value !== user?.email}),
    document: Yup.string().required('CPF/CNPJ é obrigatório')
    .test('cpf', 'CPF/CNPJ inválido', (value) => {
      if (!value) return false;
      return cpf.isValid(value) || cnpj.isValid(value);
    })
    .required('CPF/CNPJ é obrigatório'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
    mode: 'all'
  })

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {isSubmitting}
  } = methods;

  const onSubmit = async(data: FormValuesProps) => {
    data.document = data.document.replace(/\D/g, '');
    try {
       await collaboratorCreate({...data});
       enqueueSnackbar('Cadastro realizado com sucesso!', {
        variant: 'success',
      });
      reset()
      push(PATH_DASHBOARD.collaborator.list);
    } catch (error) {
      enqueueSnackbar(error.message === 'Não foi possível criar Colaborador. Usuário já está cadastrado com e-mail informado' 
      ? error.message :'Não foi possivel cadastrar. Verifique os campos e tente novamente!', {
        variant: 'error',
      });
    }
  } 

  const handleCpfChange = (event: { target: { value: string } }) => {
    const maskedCpfCnpj = maskCpfCnpj(event.target.value);
    setValue('document', maskedCpfCnpj);
  };

  return (
    <>
      <Head>
        <title>Administrador | Cadastro do Colaborador</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cadastrar Colaborador"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root},
            { name: 'Colaborador', href: PATH_DASHBOARD.collaborator.list},
            { name: 'Cadatro do Colaborador' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Tooltip title="Voltar">
                <Button component={NextLink} href={PATH_DASHBOARD.collaborator.list} size="small" variant="contained">
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
                    <RHFTextField name="fullname" label="*Nome / Razão social:" />
                    <RHFTextField
                      onChange={handleCpfChange}
                      name="document"
                      label="*CPF/CNPJ:"
                      type="text"
                      inputProps={{ maxLength: 18 }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField name="email" label="*E-mail:" />
                  </Stack>
              </Box>
            </Card>

            <Stack spacing={3}>
              <LoadingButton type="submit" variant="contained" 
                disabled={watch('fullname') === '' ||
                watch('email') === '' || watch('document') === ''} 
                size="medium" loading={isSubmitting}>
                Criar Colaborador
              </LoadingButton>
            </Stack>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
