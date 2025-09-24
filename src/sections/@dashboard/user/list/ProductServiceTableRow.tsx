import {
  Avatar,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { IProductResponse } from 'src/@types/productService';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';

type Props = {
  row: IProductResponse;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onSuspendRow: VoidFunction;
  onManagementRow: VoidFunction;
};

export default function ProductServiceTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onSuspendRow,
  onManagementRow,
}: Props) {
  const { url, name, identifier, minimum_price }: any = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  function formatValueToBRL(value: any) {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

    return formattedValue.replace('R$', 'R$ ');
  }

  return (
    <>
      <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            onClick={() => {
              onManagementRow();
              handleClosePopover();
            }}
          >
            {url instanceof File ? (
              <Avatar alt={name} src={URL.createObjectURL(url)} />
            ) : (
              <Avatar alt={name} src={url} />
            )}
          </Stack>
        </TableCell>

        <TableCell
          align="left"
          onClick={() => {
            onManagementRow();
            handleClosePopover();
          }}
        >
          {name}
        </TableCell>
        <TableCell
          align="left"
          sx={{ width: '150px' }}
          onClick={() => {
            onManagementRow();
            handleClosePopover();
          }}
        >
          {formatValueToBRL(minimum_price)}
        </TableCell>
        <TableCell
          align="center"
          onClick={() => {
            onManagementRow();
            handleClosePopover();
          }}
        >
          {identifier}
        </TableCell>
        <TableCell align="right">
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
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Deletar
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Editar
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Deletar"
        content="
        Tem certeza que deseja deletar?"
        action={
          <Button variant="contained" color="error" onClick={onSuspendRow}>
            Deletar
          </Button>
        }
      />
    </>
  );
}
