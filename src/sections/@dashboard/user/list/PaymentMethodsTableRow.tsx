import { IconButton, MenuItem, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import { IPayment } from 'src/@types/billing';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';

type Props = {
  row: IPayment;
  selected: boolean;
  onSelectRow: VoidFunction;
  onSuspendRow: VoidFunction;
  onActiveRow: VoidFunction;
};

export default function PaymentMethodsTableRow({
  row,
  selected,
  onSelectRow,
  onSuspendRow,
  onActiveRow,
}: Props) {
  const { active, description, payment_local_name } = row;
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{description}</TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={(active === false && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {active ? 'Ativo' : 'Suspenso'}
          </Label>
        </TableCell>
        <TableCell align="center">{payment_local_name}</TableCell>

        <TableCell align="center">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {active !== true ? (
          <MenuItem
            onClick={() => {
              onActiveRow();
              handleClosePopover();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-square-2-outline" />
            Ativar
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              onSuspendRow();
              handleClosePopover();
            }}
            sx={{ color: 'warning.main' }}
          >
            <Iconify icon="eva:slash-outline" />
            Suspender
          </MenuItem>
        )}
      </MenuPopover>
    </>
  );
}
