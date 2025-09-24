import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IPartnerById } from 'src/@types/partner';
import { iUpdateUser } from 'src/@types/user';
import { useAuthContext } from 'src/auth/useAuthContext';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { CustomFile } from 'src/components/upload';
import { deleteUser, updateUser } from 'src/service/auth';
import { updatePartner } from 'src/service/partner';
import { maskCpfCnpj, maskPhone } from 'src/utils/formatForm';
import { getCoordinates } from 'src/utils/getCoordinates';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface FormValuesProps extends Omit<IPartnerById, 'avatar'> {
  avatar: CustomFile | string | null;
}

type Props = {
  isEdit?: boolean;
  currentPartner?: IPartnerById;
};

export default function PartnerEditForm({ isEdit = false, currentPartner }: Props) {
  const { push } = useRouter();
  const [phone, setPhone] = useState('');
  const [CpfCnpj, setCpfCnpj] = useState('');
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [formattedZip, setFormattedZip] = useState('');
  const initialAddress = {
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  };

  const [address, setAddress] = useState(initialAddress);
  const [feeSum, setFeeSum] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const cpfCnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  const NewUserSchema = Yup.object().shape({
    legal_name: Yup.string()
      .min(3, 'O nome deve ter pelo menos 3 caracteres')
      .max(50, 'O nome não pode ter mais de 50 caracteres')
      .required('O nome é obrigatório'),
    email: Yup.string().email('Insira um email válido').required('O email é obrigatório'),
    phone_number: Yup.string()
      .min(14, 'Insira um número de telefone válido')
      .required('O número de telefone é obrigatório'),
    document: Yup.string()
      .required('CPF ou CNPJ são obrigatórios')
      .matches(cpfCnpjRegex, 'Informe um CPF ou CNPJ válido'),
    service_fee: Yup.string().required('Taxa de serviço é obrigatória'),
    card_fee: Yup.string()
      .required('Taxa de cartão é obrigatória')
      .test('sum-of-fees', 'A soma das taxas deve ser menor que 100%', function (value) {
        // eslint-disable-next-line react/no-this-in-sfc
        const serviceFee = parseInt(this.parent.service_fee, 10) || 0;
        const cardFee = parseInt(value, 10) || 0;
        return serviceFee + cardFee < 100;
      }),
    branch: Yup.array().of(
      Yup.object().shape({
        branch_name: Yup.string()
          .min(3, 'O nome deve ter pelo menos 3 caracteres')
          .max(50, 'O nome não pode ter mais de 50 caracteres')
          .required('O nome é obrigatório'),
        address: Yup.object().shape({
          zip_code: Yup.string().min(9, 'Insira um CEP válido').required('O CEP é obrigatório'),
          street: Yup.string()
            .min(3, 'A rua deve ter pelo menos 3 caracteres')
            .max(50, 'A rua não pode ter mais de 50 caracteres')
            .required('A rua é obrigatória'),
          number: Yup.string()
            .max(10, 'O número não pode ter mais de 10 caracteres')
            .required('O número é obrigatório'),
          district: Yup.string()
            .min(3, 'O bairro deve ter pelo menos 3 caracteres')
            .max(50, 'O bairro não pode ter mais de 50 caracteres')
            .required('O bairro é obrigatório'),
          city: Yup.string()
            .min(3, 'A cidade deve ter pelo menos 3 caracteres')
            .max(50, 'A cidade não pode ter mais de 50 caracteres')
            .required('A cidade é obrigatória'),
          state: Yup.string().required('O estado é obrigatório'),
        }),
      })
    ),
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenUpdate = () => {
    const serviceValueFee = Number(watch('service_fee'));
    const cardValueFee = Number(watch('card_fee'));
    const sum = serviceValueFee + cardValueFee;
    setFeeSum(sum >= 100);
    setOpenUpdate(sum < 100);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

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

  const handleDeleteRow = async () => {
    try {
      if (currentPartner?.user_id) {
        await deleteUser([currentPartner?.user_id]);
        push(PATH_DASHBOARD.partner.list);
        enqueueSnackbar('Parceiro Excluido com sucesso!', { variant: 'success' });
        push(PATH_DASHBOARD.partner.list);
      }
    } catch {
      enqueueSnackbar('Não foi possivel excluir o Parceiro!', { variant: 'error' });
    }
    setOpen(false);
  };

  const defaultValues = useMemo(
    () => ({
      partner_id: currentPartner?.partner_id || '',
      legal_name: currentPartner?.legal_name || '',
      fantasy_name: currentPartner?.fantasy_name || '',
      email: currentPartner?.email || '',
      phone_number: currentPartner?.phone_number || '',
      document: currentPartner?.document || '',
      // identifier: currentPartner?.identifier || '',
      branch: [
        {
          branch_id: currentPartner?.branch[0].branch_id || '',
          branch_name: currentPartner?.branch[0].branch_name || '',
          document: currentPartner?.branch[0].document || '',
          phone: currentPartner?.branch[0].phone || '',
          partner_id: currentPartner?.branch[0].partner_id || '',
          updated_by: user?.user_id || '',
          // created_by: string;
          address: {
            address_id: currentPartner?.branch[0]?.address?.address_id || '',
            street: currentPartner?.branch[0]?.address?.street || '',
            number: currentPartner?.branch[0]?.address?.number || '',
            complement: currentPartner?.branch[0]?.address?.complement || '',
            district: currentPartner?.branch[0]?.address?.district || '',
            city: currentPartner?.branch[0]?.address?.city || '',
            state: currentPartner?.branch[0]?.address?.state || '',
            zip_code: currentPartner?.branch[0]?.address?.zip_code || '',
            active: currentPartner?.branch[0]?.address?.active || true,
            latitude: currentPartner?.branch[0]?.address?.latitude || '',
            longitude: currentPartner?.branch[0]?.address?.longitude || '',
            updated_by: user?.user_id || '',
          },
        },
      ],
      active: currentPartner?.active || true,
      user_id: currentPartner?.user_id || '',
      admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
      created_by: currentPartner?.created_by || '',
      updated_by: user?.user_id || '',
      service_fee: currentPartner?.service_fee || 0,
      card_fee: currentPartner?.card_fee || 0,
    }),
    [currentPartner, user]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    mode: 'all',
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
    if (isEdit && currentPartner) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentPartner]);

  const onSubmit = async (data: FormValuesProps) => {
    data.document = data.document.replace(/\D/g, '');
    data.phone_number = data.phone_number.replace(/\D/g, '');
    data.service_fee = Number(String(data.service_fee)) / 100;
    data.card_fee = Number(String(data.card_fee)) / 100;
    setValue('document', data.document);

    const newAddress = {
      street: data.branch[0]?.address?.street,
      number: data.branch[0]?.address?.number,
      complement: data.branch[0]?.address?.complement,
      district: data.branch[0]?.address?.district,
      city: data.branch[0]?.address?.city,
      state: data.branch[0]?.address?.state,
      zip_code: data.branch[0]?.address?.zip_code.replace(/\D/g, ''),
      latitude: '',
      longitude: '',
      active: true,
      created_by: user?.user_id,
      updated_by: user?.user_id,
      address_id: data.branch[0].address.address_id,
    };
    const userUpdate: iUpdateUser = {
      Email: data.email,
      Fullname: data.legal_name,
      Phone: data.phone_number,
      Document: data.document,
      User_id: data.user_id,
      Active: data.active,
      Phone_verified: false,
    };
    try {
      const coordinates = await getCoordinates(newAddress);
      newAddress.latitude = coordinates.latitude.toString();
      newAddress.longitude = coordinates.longitude.toString();
      data.branch[0].address = newAddress;
      data.service_fee = data.service_fee.toFixed(3);
      data.card_fee = data.card_fee.toFixed(3);
      await updateUser(userUpdate);
      await updatePartner({ ...data });
      reset();
      enqueueSnackbar('Parceiro atualizado com Sucesso!', { variant: 'success' });
      push(PATH_DASHBOARD.partner.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possível atualizar Parceiro', { variant: 'error' });
    }
    setOpenUpdate(false);
  };

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    setFormattedZip(formattedValue);
    setValue('branch.0.address.zip_code', value);
    if (value.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${value}/json/`)
        .then((response) => {
          if (response.data.cep !== formattedValue) {
            setAddress(initialAddress);
          }
          setAddress({
            street: response.data.logradouro,
            neighborhood: response.data.bairro,
            city: response.data.localidade,
            state: response.data.uf,
          });
          setValue('branch.0.address.city', response.data.localidade);
          setValue('branch.0.address.district', response.data.bairro);
          setValue('branch.0.address.street', response.data.logradouro);
          setValue('branch.0.address.state', response.data.uf);
          setValue('branch.0.address.zip_code', formattedValue);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setAddress(initialAddress);
    }
  };

  useEffect(() => {
    if (currentPartner) {
      setPhone(maskPhone(currentPartner.phone_number));
      setCpfCnpj(maskCpfCnpj(currentPartner.document));
      setValue('phone_number', maskPhone(currentPartner.phone_number));
      setValue('document', maskCpfCnpj(currentPartner.document));
      setValue('service_fee', (Number(currentPartner.service_fee) * 100).toFixed(0));
      setValue('card_fee', (Number(currentPartner.card_fee) * 100).toFixed(0));
      const formattedValue = currentPartner.branch[0]?.address?.zip_code?.replace(
        /(\d{5})(\d{3})/,
        '$1-$2'
      );
      setValue('branch.0.address.zip_code', formattedValue);
      setFormattedZip(formattedValue);
    }
  }, [currentPartner, setValue]);

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

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="active"
                    control={control}
                    defaultValue={currentPartner?.active || false}
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
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpen}
              sx={{
                mx: 0,
                mb: 3,
                width: 1,
                justifyContent: 'space-between',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <>
                <Typography variant="subtitle2">Deletar </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Excluir Parceiro
                </Typography>
              </>
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <RHFTextField name="legal_name" label="*Nome Completo:" />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              sx={{ margin: '22px 0px' }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="fantasy_name" label="Nome Fantasia:" />
              <RHFTextField name="email" label="*Email:" />
              <RHFTextField
                value={CpfCnpj}
                onChange={handleCpfCnpjChange}
                name="document"
                label="*CPF/CNPJ:"
              />
              <RHFTextField
                value={phone}
                onChange={handlePhoneChange}
                name="phone_number"
                label="*Telefone:"
                inputProps={{ maxLength: 15 }}
              />
              <RHFTextField name="branch.0.branch_name" label="*Nome Matriz:" />
              <RHFTextField
                value={formattedZip}
                onChange={handleZipCodeChange}
                name="branch.0.address.zip_code"
                label="*CEP:"
                type="text"
                inputProps={{ maxLength: 9 }}
              />
              <RHFTextField name="branch.0.address.city" label="*Cidade:" />
              <RHFTextField name="branch.0.address.state" label="*Estado:" />
              <RHFTextField name="branch.0.address.street" label="*Logradouro:" sx={{ flex: 2 }} />
              <RHFTextField name="branch.0.address.number" label="*Número:" sx={{ flex: 1 }} />
              <RHFTextField name="branch.0.address.complement" label="Complemento:" />
              <RHFTextField name="branch.0.address.district" label="*Bairro:" />
            </Box>

            <Stack spacing={1} direction="row">
              <RHFTextField
                name="service_fee"
                label="Taxa de serviço:"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                  onInput: (e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^\d]/g, '');
                    if (input.value.length > 2) {
                      if (input.value !== '100') {
                        input.value = input.value.slice(0, 2);
                      }
                    }
                  },
                }}
              />
              <RHFTextField
                name="card_fee"
                label="Taxa de cartão:"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                  onInput: (e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^\d]/g, '');
                    if (input.value.length > 2) {
                      if (input.value !== '100') {
                        input.value = input.value.slice(0, 2);
                      }
                    }
                  },
                }}
              />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                onClick={handleOpenUpdate}
                variant="contained"
                disabled={Number(values.service_fee) + Number(values.card_fee) >= 100}
              >
                Salvar Alterações
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={open}
        onClose={handleClose}
        title="Deletar"
        content={<>Tem certeza de que deseja excluir Parceiro ?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow();
            }}
          >
            Deletar
          </Button>
        }
      />
      <ConfirmDialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        title="Atualizar"
        content={<>Tem certeza de que deseja Atualizar Parceiro ?</>}
        action={
          <LoadingButton
            onClick={handleSubmit(onSubmit)}
            type="submit"
            variant="contained"
            loading={isSubmitting}
            color="warning"
          >
            Atualizar
          </LoadingButton>
        }
      />
    </FormProvider>
  );
}
