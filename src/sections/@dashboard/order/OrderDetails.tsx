import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { IOrderDetails, IOrderItenDetails } from 'src/@types/order';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import useResponsive from 'src/hooks/useResponsive';
import * as Yup from 'yup';
import { useSnackbar } from '../../../components/snackbar';
import { hexToRgb } from '../../../utils/hexToRgb';

const STATUS_OPTION = [
  { name: 'Pendente', label: 'Pendente' },
  { name: 'Recusado', label: 'Recusado' },
  { name: 'Aceito', label: 'Aceito' },
  { name: 'Em andamento', label: 'Em andamento' },
  { name: 'Concluído', label: 'Concluído' },
  { name: 'Cancelado pelo cliente', label: 'Cancelado pelo cliente' },
];

const TABLE_HEAD = [
  { id: 'itemName', label: 'Item', align: 'left' },
  { id: 'amount', label: 'Quantidade', align: 'center' },
  { id: 'price', label: 'Preço Unitário', align: 'center' },
  { id: '', label: '' },
];
interface FormValuesProps {
  zip_code: string;
  city: string;
  state: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  typePayment: string;
  numberOfInstallments: number;
  statusOrder: string;
  total_fees: number | string;
  net_value: number | string;
}

type Props = {
  currentOrder?: IOrderDetails;
};

export default function OrderDetails({ currentOrder }: Props) {
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'lg');
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      zip_code: currentOrder?.consumer.zip_code || '',
      city: currentOrder?.consumer?.city || '',
      state: currentOrder?.consumer?.state || '',
      street: currentOrder?.consumer?.street || '',
      number: currentOrder?.consumer?.number || undefined,
      complement: currentOrder?.consumer?.complement || '',
      district: currentOrder?.consumer?.district || '',
      typePayment: currentOrder?.payments[0]?.description || '',
      numberOfInstallments: currentOrder?.payments[0]?.installments,
      statusOrder: currentOrder?.status_name || '',
      total_fees: String(currentOrder && currentOrder?.service_fee + currentOrder?.card_fee) || 0,
      net_value: String(currentOrder?.card_fee) || 0,
    }),
    [currentOrder]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { setValue, handleSubmit } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // await putCategory(categoryUpdate);
      enqueueSnackbar('Status do pedido atualizado com Sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Não foi possivel atualizar o status do pedido.', { variant: 'error' });
    }
  };
  const valueOrder = currentOrder?.order_itens.map(
    (item: IOrderItenDetails) => item.product_value * item.quantity
  );

  useEffect(() => {
    const valueLiquid =
      currentOrder && valueOrder
        ? valueOrder?.reduce((a: number, b: number) => a + b) *
          (1 + currentOrder?.service_fee + currentOrder?.card_fee)
        : 0;
    const fees = currentOrder && currentOrder?.service_fee + currentOrder?.card_fee;
    setValue('net_value', valueLiquid.toFixed(2).replace('.', ','));
    setValue('total_fees', String(Number(fees) * 100).replace('.', ','));
  }, [currentOrder]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={4}
              columnGap={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <Stack>
                <TableContainer component={Paper}>
                  <Scrollbar>
                    <Table>
                      <TableHead>
                        {TABLE_HEAD.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            sx={{
                              backgroundColor: `rgba(${hexToRgb(theme.palette.primary.main)[0]}, ${
                                hexToRgb(theme.palette.primary.main)[1]
                              }, ${hexToRgb(theme.palette.primary.main)[2]}, 0.1)`,
                              color: theme.palette.grey[900],
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                              }}
                            >
                              {headCell.label}
                            </Box>
                          </TableCell>
                        ))}
                      </TableHead>
                      <TableBody>
                        {currentOrder?.order_itens.map((item: IOrderItenDetails, index) => (
                          <TableRow
                            key={item.product_name}
                            sx={{
                              borderBottom: '1px solid #C4C4C4',
                              ...(index === currentOrder.order_itens.length - 1 && {
                                borderBottom: 'none',
                              }),
                            }}
                          >
                            <TableCell
                              align="left"
                              sx={{ whiteSpace: 'nowrap', paddingLeft: '2rem' }}
                            >
                              {item.product_name}
                            </TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="center">R${item.product_value},00</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer>

                <Stack sx={{ display: 'flex', alignItems: 'end', mt: 2, gap: 2, paddingRight: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Entrega feita por: {currentOrder?.shipping_options?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Envio estimado: R${' '}
                    {currentOrder?.shipping_options?.value.toFixed(2).replace('.', ',')}
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Subtotal: {`R$ ${valueOrder?.reduce((a: number, b: number) => a + b, 0)}`},00
                  </Typography>
                </Stack>
              </Stack>
              <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: 3 }}>
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Endereço de entrega
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <RHFTextField
                    name="zip_code"
                    label="CEP"
                    type="text"
                    inputProps={{ maxLength: 9 }}
                    disabled
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <RHFTextField name="city" label="Cidade" disabled />
                  <RHFTextField name="state" label="Estado" disabled />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <RHFTextField name="street" label="Logradouro" disabled sx={{ flex: 2 }} />
                  <RHFTextField name="number" label="Número" disabled sx={{ flex: 1 }} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <RHFTextField name="complement" label="Complemento" disabled />
                  <RHFTextField name="district" label="Bairro" disabled />
                </Stack>
              </Stack>

              <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Método de Pagamento:
                </Typography>
                <Stack sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                  <RHFTextField name="typePayment" label="Tipo de pagamento" disabled />
                  <RHFTextField
                    name="numberOfInstallments"
                    label="Quantidade de parcelas"
                    disabled
                  />
                </Stack>

                <Stack sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                  <RHFTextField
                    name="total_fees"
                    label="Taxas:"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            %
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <RHFTextField
                    name="net_value"
                    label="Valor líquido:"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>

              <Stack sx={{ display: 'flex', gap: '1rem', mt: 3 }}>
                <Stack spacing={2} direction={isDesktop ? 'row' : 'column'}>
                  <RHFSelect disabled native name="statusOrder" label="Condição do Pedido">
                    <option value="" />
                    {STATUS_OPTION.map((status) => (
                      <option key={status.name} label={status.label}>
                        {status.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Stack>
              </Stack>
            </Box>
            {/* <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Salvar status do pedido' : 'Salvar Alterações'}
              </LoadingButton>
            </Stack> */}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
