import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { ChangePassword } from 'src/service/auth';
import * as Yup from 'yup';
import { ChangePasswordParams } from '../../../../@types/user';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';

type FormValuesProps = ChangePasswordParams;

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuthContext();

  const ChangePassWordSchema = Yup.object().shape({
    old_password: Yup.string().required('Senha é obrigatória'),
    password: Yup.string()
      .required('Nova senha é obrigatória')
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .test(
        'As senhas não correspondem',
        'A nova senha deve ser diferente da senha antiga',
        (value, { parent }) => value !== parent.old_password
      ),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'As senhas devem ser iguais'),
  });

  const defaultValues = {
    token: '',
    old_password: '',
    password: '',
    passwordConfirmation: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await ChangePassword({
        token,
        old_password: data.old_password,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });
      reset();
      enqueueSnackbar('Senha atualizada com sucesso!', { variant: 'success' });
    } catch (error) {
      if (error.status && error.status === 404) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        });
        return;
      }
      console.error(error);
      enqueueSnackbar('Não foi possível alterar senha!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <RHFTextField name="old_password" type="password" label="*Senha:" />

          <RHFTextField
            name="password"
            type="password"
            label="*Nova Senha:"
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> A senha deve ter no
                mínimo 6 caracteres.
              </Stack>
            }
          />

          <RHFTextField name="passwordConfirmation" type="password" label="*Confirme Nova Senha:" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Alterar Senha
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
