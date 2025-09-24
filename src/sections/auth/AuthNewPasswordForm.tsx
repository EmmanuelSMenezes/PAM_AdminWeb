import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment, Typography, FormLabel, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { resetPassword } from 'src/service/auth';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

type FormValuesProps = {
  password: string;
  passwordConfirmation: string;
  afterSubmit?: string;
  wrongPassword?: string;
  wrongPasswordConfirmation?: string;
};

export default function AuthNewPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { token, setTemporaryPassword, setIsAuthenticated } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('A senha é um campo obrigatório')
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .matches(/.*[A-Z].*/, 'A senha deve conter pelo menos uma letra maiúscula')
      .matches(/.*[!@#$%^&*()].*/, 'A senha deve conter pelo menos um caractere especial'),
    passwordConfirmation: Yup.string()
      .required('A confirmação da senha é um campo obrigatório')
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .matches(/.*[A-Z].*/, 'A senha deve conter pelo menos uma letra maiúscula')
      .matches(/.*[!@#$%^&*()].*/, 'A senha deve conter pelo menos um caractere especial')
      .oneOf([Yup.ref('password'), ''], 'As senhas devem ser iguais')
      .nullable(),
  });

  const defaultValues = {
    password: '',
    passwordConfirmation: '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { password, passwordConfirmation } = data;
    try {
      const response = await resetPassword({ token, password, passwordConfirmation });
      if (response) {
        setTemporaryPassword(false);
      }
      setIsAuthenticated(true);

      enqueueSnackbar('Senha atualizada com sucesso', {
        variant: 'success',
      });
    } catch (error) {
      console.log(error);
      if (error.status === 500) {
        enqueueSnackbar('Erro interno no servidor. Tente novamente mais tarde', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Não foi possível alterar a senha, tente novamente mais tarde', {
          variant: 'error',
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
        Primeiro Acesso
      </Typography>
      <Stack spacing={2}>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Verificamos que você está utilizando uma senha temporária, cadastre uma nova senha.
        </Typography>

        <RHFTextField
          name="password"
          label="Nova Senha"
          type={showPassword ? 'text' : 'password'}
          helperText={errors?.wrongPassword && errors.wrongPassword?.message}
          FormHelperTextProps={{ style: { color: '#ff5330' } }}
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
        <RHFTextField
          name="passwordConfirmation"
          label="Confirmar Senha"
          type={showPassword ? 'text' : 'password'}
          helperText={
            errors?.wrongPasswordConfirmation && errors.wrongPasswordConfirmation?.message
          }
          FormHelperTextProps={{ style: { color: '#ff5330' } }}
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
        <FormLabel component="legend" sx={{ typography: 'body2', mb: 2, fontSize: '12px' }}>
          Sua senha deve ter no mínimo 8 caracteres e conter no mínimo: 1 letra maiúscula, 1
          caractere especial.
        </FormLabel>
      </Stack>
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
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
          Salvar Senha
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
