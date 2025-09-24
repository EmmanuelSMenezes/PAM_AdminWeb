import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, InputAdornment, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IFeeAdminResponse } from 'src/@types/setting';
import { useAuthContext } from 'src/auth/useAuthContext';
import { interestRateSettingGet, interestRateSettingUpdate } from 'src/service/setting';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { useSnackbar } from '../../../../components/snackbar';

type FormValuesProps = {
  service_fee: number;
  card_fee: number;
};

export default function AccountFee() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [feeAdmin, setFeeAdmin] = useState<IFeeAdminResponse>();
  const [feeSum, setFeeSum] = useState<boolean>(false);

  const FeeSchema = Yup.object().shape({
    service_fee: Yup.string()
      .required('Taxa de serviço é obrigatória')
      .matches(/^[0-9]+$/, 'O campo deve ser um número inteiro.'),
    card_fee: Yup.string()
      .required('Taxa de cartão é obrigatória')
      .test('sum-of-fees', 'A soma das taxas deve ser menor que 100%', function (value) {
        // eslint-disable-next-line react/no-this-in-sfc
        const serviceFee = parseInt(this.parent.service_fee, 10) || 0;
        const cardFee = parseInt(value, 10) || 0;
        return serviceFee + cardFee < 100;
      }),
  });

  const defaultValues = {
    service_fee: feeAdmin?.service_fee || 0,
    card_fee: feeAdmin?.card_fee || 0,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FeeSchema),
    mode: 'all',
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const totalFee = Number(data.service_fee) + Number(data.card_fee);
    setFeeSum(totalFee >= 100);
    data.service_fee = Number(data.service_fee) / 100;
    data.card_fee = Number(data.card_fee) / 100;
    try {
      await interestRateSettingUpdate({
        interest_rate_setting_id: feeAdmin?.interest_rate_setting_id,
        admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
        service_fee: data.service_fee.toFixed(3),
        card_fee: data.card_fee.toFixed(3),
      });
      enqueueSnackbar('Taxa atualizada com sucesso!', { variant: 'success' });
    } catch (error) {
      if (error.status && error.status === 404) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        });
        return;
      }
      console.error(error);
      enqueueSnackbar('Não foi possível alterar a taxa!', { variant: 'error' });
    }
  };

  useEffect(() => {
    async function getFeeAdmin() {
      try {
        const response = await interestRateSettingGet(
          user?.isCollaborator ? user?.sponsor_id : user?.admin_id
        );
        setFeeAdmin(response);
        setValue('service_fee', response.service_fee * 100);
        setValue('card_fee', response.card_fee * 100);
      } catch {
        console.error('erro teste');
      }
    }
    getFeeAdmin();
  }, []);

  const values = watch();

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ padding: '8px', width: '60%' }}>
        <Stack spacing={3} alignItems="flex-end" sx={{ width: '100%' }}>
          <Stack spacing={1} direction="row" sx={{ width: '100%' }}>
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
                  if (input.value.length > 2) {
                    if (input.value !== '100') {
                      input.value = input.value.slice(0, 2);
                    }
                  }
                },
              }}
            />
          </Stack>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={Number(values?.service_fee) + Number(values?.card_fee) >= 100}
          >
            Alterar Taxas
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
