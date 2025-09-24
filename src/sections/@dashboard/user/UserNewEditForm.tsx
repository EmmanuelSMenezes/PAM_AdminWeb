import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IPartnerById } from 'src/@types/partner';
import { iUpdateUser } from 'src/@types/user';
import { updateUser } from 'src/service/auth';
import { updatePartner } from 'src/service/partner';
import { maskCpfCnpj, maskPhone } from 'src/utils/formatForm';
import * as Yup from 'yup';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import { CustomFile } from '../../../components/upload';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fData } from '../../../utils/formatNumber';

interface FormValuesProps extends Omit<IPartnerById, 'avatar'> {
  avatar: CustomFile | string | null;
}

type Props = {
  isEdit?: boolean;
  currentUser?: IPartnerById;
};

export default function UserNewEditForm({ isEdit = false, currentUser }: Props) {
  const { push } = useRouter();
  const [phone, setPhone] = useState('');
  const [CpfCnpj, setCpfCnpj] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const cpfCnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  const NewUserSchema = Yup.object().shape({
    legal_name: Yup.string().required('Nome é obrigatório'),
    fantasy_name: Yup.string().required('Nome Fantasia é obrigatório'),
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('E-mail deve ser um endereço de e-mail válido'),
    phone_number: Yup.string().required('O número de telefone é obrigatório'),
    document: Yup.string()
      .required('CPF ou CNPJ são obrigatórios')
      .matches(cpfCnpjRegex, 'Informe um CPF ou CNPJ válido'),
  });

  const handlePhoneChange = (event: { target: { value: string } }) => {
    const maskedPhone = maskPhone(event.target.value);
    setPhone(maskedPhone);
    setValue('phone_number', maskedPhone);
  };

  const handleCpfCnpjChange = (event: { target: { value: string } }) => {
    const maskedCpfCnpj = maskCpfCnpj(event.target.value);
    setCpfCnpj(maskedCpfCnpj);
    setValue('document', maskedCpfCnpj);
  };

  const defaultValues = useMemo(
    () => ({
      partner_id: currentUser?.partner_id || '',
      legal_name: currentUser?.legal_name || '',
      fantasy_name: currentUser?.fantasy_name || '',
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || '',
      document: currentUser?.document || '',
      branch: [
        {
          branch_id: currentUser?.branch[0].branch_id || '',
          branch_name: currentUser?.branch[0].branch_name || '',
          document: currentUser?.branch[0].document || '',
          address: {
            address_id: currentUser?.branch[0].address.address_id || '',
            street: currentUser?.branch[0].address.street || '',
            number: currentUser?.branch[0].address.number || '',
            complement: currentUser?.branch[0].address.complement || '',
            district: currentUser?.branch[0].address.district || '',
            city: currentUser?.branch[0].address.city || '',
            state: currentUser?.branch[0].address.state || '',
            zip_code: currentUser?.branch[0].address.zip_code || '',
            active: currentUser?.branch[0].address.active || true,
            latitude: currentUser?.branch[0].address.latitude || '',
            longitude: currentUser?.branch[0].address.longitude || '',
          },
        },
      ],
      active: currentUser?.active || true,
      user_id: currentUser?.user_id || '',
      admin_id: currentUser?.admin_id || '',
    }),
    [currentUser]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data: FormValuesProps) => {
    data.document = data.document.replace(/\D/g, '');
    data.phone_number = data.phone_number.replace(/\D/g, '');
    setValue('document', data.document);
    const userUpdate: iUpdateUser = {
      Email: data.email,
      Fullname: data.legal_name,
      Phone: data.phone_number,
      Document: data.document,
      User_id: data.user_id,
      Active: true,
      Avatar: data?.avatar,
    };
    try {
      await updateUser(userUpdate);
      await updatePartner({ ...data });
      reset();
      enqueueSnackbar('Parceiro atualizado com Sucesso!', { variant: 'success' });
      push(PATH_DASHBOARD.partner.list);
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    if (currentUser) {
      setPhone(maskPhone(currentUser.phone_number));
      setCpfCnpj(maskCpfCnpj(currentUser.document));
      setValue('document', CpfCnpj);
    }
  }, [currentUser, setValue, CpfCnpj]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.active === true ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.active ? 'Ativo' : 'Suspenso'}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
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
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== true}
                        onChange={(event) => field.onChange(!event.target.checked)}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Suspender
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Aplicar suspesão de conta
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="legal_name" label="Nome Comleto" />
              <RHFTextField name="fantasy_name" label="Nome Fantasia" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField
                value={CpfCnpj}
                onChange={handleCpfCnpjChange}
                name="document"
                label="CPF/CNPJ"
              />
              <RHFTextField
                value={phone}
                onChange={handlePhoneChange}
                name="phone_number"
                label="Telefone"
                inputProps={{ maxLength: 15 }}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Salvar Alterações'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
