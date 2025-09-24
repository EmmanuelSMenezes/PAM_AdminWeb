import { useState } from 'react';
import * as Yup from 'yup';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { PATH_AUTH } from '../../routes/paths';
import { useAuthContext } from '../../auth/useAuthContext';
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
  wrongLogin?: string;
  wrongPassword?: string;
};

export default function AuthLoginForm() {
  const { login } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('O e-mail deve ser um endereço de e-mail válido'),
    password: Yup.string().required('Senha é obrigatório'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const response = await login(data.email, data.password);

      if (!response?.user?.isActiveCollaborator && response?.user?.isCollaborator){
        enqueueSnackbar('Cadastro Inativo! Entre em contato com o responsável pelo seu Acesso.', { variant: 'error' });
      } else {
        enqueueSnackbar('Login efetuado com sucesso!', { variant: 'success' });
      }
    } catch (error) {
      console.log('teste error');
      if (error.status === 403) {
        if (error.message === 'Não foi possível criar sessão. Usuário não está cadastrado com e-mail ou numero de telefone informado') {
          setError('wrongLogin', {type: 'custom', message: error.message});
        }
        if (error.message === 'Não foi possível criar sessão. Email ou Senha incorreta.') {
          setError('wrongPassword', {type: 'custom', message: 'Não foi possível criar sessão. Senha incorreta.'});
        }
      } else if (error.status === 400) {
        enqueueSnackbar(
          'Sua senha deve ter no mínimo 8 caracteres e conter no mínimo: 1 letra maiúscula, 1 caractere especial.',
          { variant: 'error' }
        );
      } else if (error.status === 500) {
        enqueueSnackbar('Erro interno no servidor. Tente novamente mais tarde.', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Não foi possível efetuar login', { variant: 'error' });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField 
          name="email" 
          label="E-mail"
          helperText={errors?.wrongLogin && errors.wrongLogin?.message}
          FormHelperTextProps={{ style: {color: '#ff5330'}}}
        />

        <RHFTextField
          name="password"
          label="Senha"
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
          helperText={errors?.wrongPassword && errors.wrongPassword?.message}
          FormHelperTextProps={{ style: {color: '#ff5330'}}}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={NextLink}
          href={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Esqueceu a senha?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
