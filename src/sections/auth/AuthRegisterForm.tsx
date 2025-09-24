import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment, Alert, FormLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { maskCpfCnpj, maskPhone, maskZipCode } from 'src/utils/formatForm';
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

type FormValuesProps = {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf_cnpj: string;
  address: string;
  address_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  afterSubmit?: string;
};

export default function AuthRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Nome / Razão social é obrigatório'),
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('O e-mail deve ser um endereço de e-mail válido'),
    password: Yup.string().required('Senha é obrigatório').min(6, 'Senha deve conter 6 caracteres'),
    phone: Yup.string().required('Telefone é um campo obrigatório').min(11, 'Insira DDD + Número'),
    cpf_cnpj: Yup.string()
      .required('CPF ou CNPJ é obrigatório')
      .matches(
        /([0-9]{2}[-./]?[0-9]{3}[-./]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[-./]?[0-9]{3}[-./]?[0-9]{3}[-./]?[0-9]{2})/,
        'CPF ou CNPJ Invalido'
      )
      .min(14, 'Cpf deve conter 11 caracteres')
      .max(18, 'Cnpj deve conter 14 caracteres'),
    address: Yup.string().required('Logradouro é obrigatório'),
    address_number: Yup.string().required('Número é obrigatório'),
    complement: Yup.string(),
    neighborhood: Yup.string().required('Bairro é obrigatório'),
    city: Yup.string().required('Cidade é obrigatório'),
    state: Yup.string().required('Estado é obrigatório'),
    zip_code: Yup.string().required('Cep é obrigatório'),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    phone: '',
    cpf_cnpj: '',
    address: '',
    address_number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const handleCpfCnpjChange = (event: { target: { value: string } }) => {
    setCpfCnpj(maskCpfCnpj(event.target.value));
  };

  const handlePhoneChange = (event: { target: { value: string } }) => {
    setPhone(maskPhone(event.target.value));
  };

  const handleZipCodeChange = (event: { target: { value: string } }) => {
    setZipCode(maskZipCode(event.target.value));
  };

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // if (register) {
      //   await register(
      //     data.name,
      //     data.email,
      //     data.password,
      //     data.phone,
      //     data.cpf_cnpj,
      //     data.address,
      //     data.address_number,
      //     data.complement,
      //     data.neighborhood,
      //     data.city,
      //     data.state,
      //     data.zip_code
      //   );
      //   console.log(data);
      // }
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        type: 'custom',
        message: error.message || error,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mb: '-10px' }}>
          Tipo de parceiro
        </FormLabel>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField name="name" label="Nome / Razão social" />
          <RHFTextField name="email" label="E-mail" />
          <RHFTextField
            name="password"
            label="Senha temporária"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField
            value={phone}
            onChange={handlePhoneChange}
            name="phone"
            label="DDD + Telefone"
            type="text"
            inputProps={{ maxLength: 15 }}
          />
          <RHFTextField
            value={cpfCnpj}
            onChange={handleCpfCnpjChange}
            name="cpf_cnpj"
            label="Cpf / Cnpj"
            type="text"
            inputProps={{ maxLength: 18 }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField name="address" label="Logradouro" sx={{ flex: 2 }} />
          <RHFTextField name="address_number" label="Número" sx={{ flex: 1 }} />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField name="complement" label="Complemento" />
          <RHFTextField name="neighborhood" label="Bairro" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField name="city" label="Cidade" />
          <RHFTextField name="state" label="Estado" />
          <RHFTextField
            value={zipCode}
            onChange={handleZipCodeChange}
            name="zip_code"
            label="Cep"
            type="text"
            inputProps={{ maxLength: 9 }}
          />
        </Stack>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isSubmitSuccessful}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Criar uma conta
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
