import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { resetPassword } from 'src/service/auth';
import { useRouter } from 'next/router';
import { PATH_AUTH } from 'src/routes/paths';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';

type FormValuesProps = {
  password: string;
  passwordConfirmation: string;
};

export default function NewPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();
  const {
    query: { userToken },
  } = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string().required(
      'A senha deve conter 8 dígitos, incluindo letra maiúscula e caractere especial.'
    ),
    passwordConfirmation: Yup.string()
      .required('As senhas devem ser iguais.')
      .oneOf([Yup.ref('password')], 'As senhas devem ser iguais.'),
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
    // reset,
    // setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { password, passwordConfirmation } = data;
    if (userToken && typeof userToken === 'string') {
      try {
        await resetPassword({ token: userToken, password, passwordConfirmation });
        push(PATH_AUTH.login);
        enqueueSnackbar('Senha atualizada com sucesso!', {
          variant: 'success',
        });
      } catch (error) {
        enqueueSnackbar('Não foi possível alterar a senha, tente novamente mais tarde.', {
          variant: 'error',
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <RHFTextField
          name="password"
          label="Nova Senha"
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

        <RHFTextField
          name="passwordConfirmation"
          label="Confirmar Senha"
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
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Salvar senha
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
