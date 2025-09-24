import { Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import Iconify from 'src/components/iconify/Iconify';

type Props = {
  filterOrder: string;
  filterName: string;
  filterConsumer: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  filterOrderStatus: string;
  onResetFilter: VoidFunction;
  onFilterOrder: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterConsumer: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterOrderStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStartDate: (date: any) => void;
  onFilterEndDate: (date: any) => void;
  onSearchFilter: VoidFunction;
};

export default function OrderTableToolbar({
  filterOrder,
  filterName,
  filterConsumer,
  filterOrderStatus,
  filterStartDate,
  filterEndDate,
  onFilterStartDate,
  onFilterEndDate,
  onFilterName,
  onFilterOrder,
  onFilterConsumer,
  onFilterOrderStatus,
  onResetFilter,
  onSearchFilter,
}: Props) {
  const CURRENCIES = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Aceito', label: 'Aceito' },
    { value: 'Recusado', label: 'Recusado' },
    { value: 'Em andamento', label: 'Em andamento' },
    { value: 'Cancelado pelo cliente', label: 'Cancelado pelo cliente' },
    { value: 'Aguardando pagamento', label: 'Aguardando pagamento' },
  ];

  return (
    <>
      <Stack
        spacing={2}
        direction={{
          xs: 'row',
          sm: 'row',
        }}
        sx={{ px: 2.5, py: 1, width: '100%' }}
      >
        <Stack
          width="28%"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex', gap: '8px' }}
        >
          <TextField
            fullWidth
            value={filterOrder}
            onChange={onFilterOrder}
            placeholder="N° do Pedido"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          width="28%"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex', gap: '8px' }}
        >
          <TextField
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Parceiro"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          width="28%"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex', gap: '8px' }}
        >
          <TextField
            fullWidth
            value={filterConsumer}
            onChange={onFilterConsumer}
            placeholder="Consumidor"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          spacing={2}
          width="17%"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex' }}
        >
          <Button
            onClick={onSearchFilter}
            disabled={
              filterName === '' &&
              filterConsumer === '' &&
              filterOrderStatus === '' &&
              filterStartDate !== null &&
              filterEndDate === null
            }
            sx={{ width: '100%' }}
            variant="soft"
            startIcon={<Iconify icon="eva:search-fill" />}
          >
            Pesquisar
          </Button>
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        direction={{
          xs: 'row',
          sm: 'row',
        }}
        sx={{ px: 2.5, py: 2.5, width: '100%' }}
      >
        <Stack
          spacing={2}
          width="28%"
          alignItems="center"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex', gap: '8px' }}
        >
          <TextField
            fullWidth
            name="status"
            select
            label="Status"
            value={filterOrderStatus}
            onChange={onFilterOrderStatus}
          >
            {CURRENCIES.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack
          spacing={2}
          width="28%"
          alignItems="center"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex', gap: '8px' }}
        >
          <DatePicker
            ignoreInvalidInputs
            mask="__/__/____"
            inputFormat="dd/MM/yyyy"
            label="Data Inicial"
            maxDate={new Date(new Date())}
            value={filterStartDate}
            onChange={onFilterStartDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Stack>

        <Stack
          spacing={2}
          width="28%"
          alignItems="center"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex', gap: '8px' }}
        >
          <DatePicker
            ignoreInvalidInputs
            mask="__/__/____"
            inputFormat="dd/MM/yyyy"
            disabled={filterStartDate === null}
            label="Data Final"
            minDate={new Date(filterStartDate || new Date())}
            maxDate={new Date(new Date())}
            value={filterEndDate}
            onChange={onFilterEndDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Stack>

        <Stack
          spacing={2}
          width="17%"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ display: 'flex' }}
        >
          <Button
            onClick={onResetFilter}
            sx={{ width: '100%' }}
            variant="soft"
            startIcon={<Iconify icon="ant-design:clear-outlined" />}
          >
            Limpar Filtros
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
