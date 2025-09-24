import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Container, Grid, Stack, Tooltip } from '@mui/material';
import axios from 'axios';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { defaultValuesPartner } from 'src/@types/defaultValuesPartner';
import { useAuthContext } from 'src/auth/useAuthContext';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { createUser } from 'src/service/auth';
import { createPartner } from 'src/service/partner';
import { maskCpfCnpj, maskPhone } from 'src/utils/formatForm';
import { getCoordinates } from 'src/utils/getCoordinates';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import DashboardLayout from '../../../layouts/dashboard';

type FormValuesProps = {
  partner_id: string;
  legal_name: string;
  fantasy_name: string;
  email: string;
  phone_number: string;
  document: string;
  branch: {
    branch_name: string;
    document: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      district: string;
      city: string;
      state: string;
      zip_code: string;
      latitude: string;
      longitude: string;
    };
  };
  created_by: string;
  user_id: string;
};

RegisterPartnerPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const STATES = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' },
];

export default function RegisterPartnerPage() {
  const { user } = useAuthContext();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const [formattedZip, setFormattedZip] = useState('');

  const RegisterSchema = Yup.object().shape({
    legal_name: Yup.string()
      .required('O nome é obrigatório')
      .min(3, 'O nome deve ter pelo menos 3 caracteres')
      .max(50, 'O nome não pode ter mais de 50 caracteres'),
    email: Yup.string()
      .email('Insira um email válido')
      .required('O email é obrigatório')
      .test({ message: 'Email Inválido', test: (value) => value !== user?.email }),
    phone_number: Yup.string()
      .required('O telefone é obrigatório')
      .min(11, 'Telefone Incompleto')
      .matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\s?\d|[2-9])\d{3})-?(\d{4}))$/,
        'Telefone Inválido'
      ),
    document: Yup.string()
      .required('CPF/CNPJ é obrigatório')
      .test('cpf', 'CPF/CNPJ inválido', (value) => {
        if (!value) return false;
        return cpf.isValid(value) || cnpj.isValid(value);
      })
      .required('CPF/CNPJ é obrigatório'),
    branch: Yup.object().shape({
      address: Yup.object().shape({
        zip_code: Yup.string().required('O CEP é obrigatório').min(9, 'Insira um CEP válido'),
        street: Yup.string()
          .required('A rua é obrigatória')
          .min(1, 'A rua deve ter pelo menos um caractere')
          .max(50, 'A rua não pode ter mais de 50 caracteres'),
        number: Yup.string()
          .required('O número é obrigatório')
          .max(10, 'O número não pode ter mais de 10 caracteres'),
        district: Yup.string()
          .required('O bairro é obrigatório')
          .min(3, 'O bairro deve ter pelo menos 3 caracteres')
          .max(50, 'O bairro não pode ter mais de 50 caracteres'),
        city: Yup.string()
          .required('A cidade é obrigatória')
          .min(3, 'A cidade deve ter pelo menos 3 caracteres')
          .max(50, 'A cidade não pode ter mais de 50 caracteres'),
        state: Yup.string().required('O estado é obrigatório'),
      }),
    }),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: defaultValuesPartner,
    mode: 'all',
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    setFormattedZip(formattedValue);
    setValue('branch.address.zip_code', value);
    if (value.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${value}/json/`)
        .then((response) => {
          setValue('branch.address.city', response.data.localidade);
          setValue('branch.address.district', response.data.bairro);
          setValue('branch.address.street', response.data.logradouro);
          setValue('branch.address.state', response.data.uf);
          setValue('branch.address.zip_code', formattedValue);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setValue('branch.address.city', '');
      setValue('branch.address.district', '');
      setValue('branch.address.street', '');
      setValue('branch.address.state', '');
    }
  };
  const handleCpfChange = (event: { target: { value: string } }) => {
    const maskedCpfCnpj = maskCpfCnpj(event.target.value);
    setValue('document', maskedCpfCnpj);
  };

  const handlePhoneChange = (event: { target: { value: string } }) => {
    const maskedPhone = maskPhone(event.target.value);
    setValue('phone_number', maskedPhone);
  };

  const onSubmit = async (data: FormValuesProps) => {
    const newAddress = {
      street: data.branch.address.street,
      number: data.branch.address.number,
      complement: data.branch.address.complement,
      district: data.branch.address.district,
      city: data.branch.address.city,
      state: data.branch.address.state,
      zip_code: data.branch?.address?.zip_code?.replace(/\D/g, ''),
      latitude: '',
      longitude: '',
      active: true,
      created_by: user?.user_id,
    };
    try {
      const coordinates = await getCoordinates(newAddress);
      newAddress.latitude = coordinates.latitude.toString();
      newAddress.longitude = coordinates.longitude.toString();

      const userId = await createUser({
        email: data.email,
        roleName: 3,
        fullname: data.legal_name,
        phone: data.phone_number.replace(/\D/g, ''),
        document: data.document.replace(/\D/g, ''),
        generatedPassword: true,
      });
      // console.log(userId);
      await createPartner({
        legal_name: data.legal_name,
        fantasy_name: data.fantasy_name,
        document: data.document.replace(/\D/g, ''),
        email: data.email,
        phone_number: data.phone_number.replace(/\D/g, ''),
        branch: [
          {
            branch_name: data.legal_name,
            document: data.document.replace(/\D/g, ''),
            phone: data.phone_number.replace(/\D/g, ''),
            address: { ...newAddress },
          },
        ],
        created_by: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
        user_id: userId.user_id,
        admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
      });
      enqueueSnackbar('Parceiro cadastrado com sucesso!', { variant: 'success' });
      enqueueSnackbar('Foi enviado um Email para o parceiro cadastrado.', { variant: 'success' });
      reset();
      push(PATH_DASHBOARD.partner.list);
      return;
    } catch (error) {
      setValue('branch.address.zip_code', formattedZip);
      enqueueSnackbar(error?.message, { variant: 'error' });
    }
  };

  return (
    <>
      <Head>
        <title>Administrador | Cadastrar Parceiro</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cadastrar Parceiro"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Parceiros', href: PATH_DASHBOARD.partner.root },
            { name: 'Cadastrar Parceiros' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Tooltip title="Voltar">
                <Button
                  component={NextLink}
                  href={PATH_DASHBOARD.partner.list}
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
          <Stack spacing={2.5}>
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
                    <RHFTextField name="legal_name" label="*Nome / Razão social:" />
                    <RHFTextField name="fantasy_name" label="Nome Fantasia:" />
                    <RHFTextField name="email" label="*E-mail:" />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      onChange={handlePhoneChange}
                      name="phone_number"
                      label="*DDD + Telefone:"
                      type="text"
                      inputProps={{ maxLength: 15 }}
                    />
                    <RHFTextField
                      onChange={handleCpfChange}
                      name="document"
                      label="*CPF/CNPJ:"
                      type="text"
                      inputProps={{ maxLength: 18 }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      onChange={handleZipCodeChange}
                      name="branch.address.zip_code"
                      label="*CEP:"
                      type="text"
                      inputProps={{ maxLength: 9 }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField name="branch.address.city" label="*Cidade:" />
                    <RHFSelect native name="branch.address.state" label="*Estado:">
                      <option value="" />
                      {STATES.map((item: { label: string; value: string }) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      name="branch.address.street"
                      label="*Logradouro:"
                      sx={{ flex: 2 }}
                    />
                    <RHFTextField name="branch.address.number" label="*Número:" sx={{ flex: 1 }} />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField name="branch.address.complement" label="Complemento:" />
                    <RHFTextField name="branch.address.district" label="*Bairro" />
                  </Stack>
                </Box>
                <Stack alignItems="flex-end" sx={{ mt: 5 }}>
                  <LoadingButton
                    fullWidth
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={
                      watch('branch.address.city') === '' ||
                      watch('branch.address.district') === '' ||
                      watch('branch.address.number') === '' ||
                      watch('branch.address.state') === '' ||
                      watch('branch.address.street') === '' ||
                      watch('legal_name') === '' ||
                      watch('email') === '' ||
                      watch('phone_number') === '' ||
                      watch('document') === ''
                    }
                    loading={isSubmitting && !isSubmitSuccessful}
                    sx={{
                      bgcolor: 'text.primary',
                      color: (theme) =>
                        theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                      '&:hover': {
                        bgcolor: 'text.primary',
                        color: (theme) =>
                          theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                      },
                    }}
                  >
                    {isSubmitting && !isSubmitSuccessful ? 'Carregando' : 'Cadastrar Parceiro'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
}
