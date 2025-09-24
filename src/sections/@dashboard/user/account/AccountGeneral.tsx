import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { iUpdateUser } from 'src/@types/user';
import { updateUser } from 'src/service/auth';
import { maskCpfCnpj, maskPhone } from 'src/utils/formatForm';
import * as Yup from 'yup';
import { useAuthContext } from '../../../../auth/useAuthContext';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { useSnackbar } from '../../../../components/snackbar';
import { CustomFile } from '../../../../components/upload';
import { fData } from '../../../../utils/formatNumber';

type FormValuesProps = {
  fullname: string;
  email: string;
  avatar: CustomFile | string | null;
  phone: string;
  document: string;
  user_id: string;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const [phone, setPhone] = useState('');
  const [CpfCnpj, setCpfCnpj] = useState('');

  const { user, setUser } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    fullname: Yup.string().required('Nome é obrigatório'),
    email: Yup.string()
      .required('Email é obrigatório')
      .email('O e-mail deve ser um endereço de e-mail válido'),
    phone: Yup.string().required('Telefone é obrigatório'),
    document: Yup.string()
      .test('cpf', 'CPF inválido', (value) => {
        if (!value) return false;
        return cpf.isValid(value) || cnpj.isValid(value);
      })
      .required('CPF é obrigatório'),
  });

  useEffect(() => {
    if (user) {
      setPhone(maskPhone(user.phone));
      setCpfCnpj(maskCpfCnpj(user.profile.document));
    }
  }, [user]);

  const handlePhoneChange = (event: { target: { value: string } }) => {
    const maskedPhone = maskPhone(event.target.value);
    setPhone(maskedPhone);
    setValue('phone', maskedPhone);
  };

  const handleCpfCnpjChange = (event: { target: { value: string } }) => {
    const maskedCpfCnpj = maskCpfCnpj(event.target.value);
    setCpfCnpj(maskedCpfCnpj);
    setValue('document', maskedCpfCnpj);
  };

  const defaultValues = {
    fullname: user?.profile?.fullname || '',
    email: user?.email || '',
    avatar: user?.profile?.avatar || null,
    phone: user?.phone || '',
    document: user?.profile?.document || '',
    user_id: user?.user_id || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    data.document = data.document.replace(/\D/g, '');
    data.phone = data.phone.replace(/\D/g, '');
    try {
      const userUpdate: iUpdateUser = {
        Email: data.email,
        Fullname: data.fullname,
        Phone: data.phone,
        Document: data.document,
        User_id: user?.user_id,
        Active: true,
        Avatar: data?.avatar,
        Phone_verified: false,
      };
      const responseUser = await updateUser(userUpdate);
      responseUser.admin_id = user?.isCollaborator ? user?.sponsor_id : user?.admin_id;
      localStorage.setItem('@PAM:user', JSON.stringify(responseUser));
      setUser(responseUser);

      enqueueSnackbar('Dados atualizados com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possivel atualizar usuário', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="avatar"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Permitido *.jpeg, *.jpg, *.png, *.gif
                  <br /> no tamanho máximo de {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={4}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="fullname" label="*Nome:" />

              <RHFTextField name="email" label="*Email:" />

              <RHFTextField
                value={CpfCnpj}
                onChange={handleCpfCnpjChange}
                name="document"
                label="*CPF:"
              />
              <RHFTextField
                value={phone}
                onChange={handlePhoneChange}
                name="phone"
                label="*Telefone:"
                inputProps={{ maxLength: 15 }}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Salvar Alterações
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
