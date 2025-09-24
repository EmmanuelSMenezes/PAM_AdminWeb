import { Chip, TableCell, TableRow } from '@mui/material';
import { IOrderItenDetails, IOrderResponse } from 'src/@types/order';

type Props = {
  row: IOrderResponse;
  selected: boolean;
  onManagementRow: VoidFunction;
};

export default function OrderTableRow({ row, selected, onManagementRow }: Props) {
  function formatValueToBRL(value: number) {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

    return formattedValue.replace('R$', 'R$ ');
  }

  function getStatusColor(status: any) {
    switch (status) {
      case 'Pendente':
        return 'warning';
      case 'Em andamento':
        return 'info';
      case 'Concluído':
        return 'success';
      case 'Cancelado pelo cliente':
        return 'error';
      case 'Recusado':
        return 'error';
      default:
        return 'default';
    }
  }

  const valueOrder = row.order_itens.map(
    (item: IOrderItenDetails) => item.product_value * item.quantity
  );

  return (
    <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
      <TableCell
        onClick={() => {
          onManagementRow();
        }}
        align="left"
      >
        {row.order_number}
      </TableCell>
      <TableCell
        onClick={() => {
          onManagementRow();
        }}
        align="center"
      >
        {new Date(row.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell
        onClick={() => {
          onManagementRow();
        }}
        align="center"
      >
        {row.partner?.legal_name}
      </TableCell>
      <TableCell
        onClick={() => {
          onManagementRow();
        }}
        align="center"
      >
        {row.consumer.legal_name}
      </TableCell>
      <TableCell
        onClick={() => {
          onManagementRow();
        }}
        align="left"
      >
        {formatValueToBRL(valueOrder.reduce((a: number, b: number) => a + b, 0))}
      </TableCell>
      <TableCell
        onClick={() => {
          onManagementRow();
        }}
        align="center"
      >
        <Chip
          label={row.status_name}
          color={getStatusColor(row.status_name)}
          sx={{
            borderRadius: '6px',
            backgroundColor:
              // eslint-disable-next-line no-nested-ternary
              row?.status_name === 'Recusado'
                ? '#cc0000'
                : // eslint-disable-next-line no-nested-ternary
                '' || row?.status_name === 'Aceito'
                ? '#d4d4d4'
                : '' || row?.status_name === 'Aguardando pagamento'
                ? '#F5DEB3'
                : '',
          }}
        />
      </TableCell>
    </TableRow>
  );
}
