import {
  Button,
  Checkbox, IconButton, MenuItem,
  TableCell, TableRow
} from '@mui/material';
import { useState } from 'react';
import { ICategory } from 'src/@types/category';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';

type Props = {
  row: ICategory;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onSuspendRow: VoidFunction;
  onActiveRow: VoidFunction;
};

export default function CategoryTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onSuspendRow,
  onActiveRow,
}: Props) {
  const { identifier, description, category_parent_name } = row;

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

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="left">{description}</TableCell>
        <TableCell align="left">{category_parent_name}</TableCell>
        <TableCell align="center">{identifier}</TableCell>
        <TableCell align="center" onClick={() => { handleClosePopover() }}>
          <Label
            variant="soft"
            color={(row.active === false && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {row.active ? 'Ativo' : 'Suspenso'}
          </Label>
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
        {row.active === true ? (
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:slash-outline"  />
            Suspender
          </MenuItem> ) : (
            <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-square-2-outline" />
            Ativar
          </MenuItem>
          )}


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
      {row.active === true ? (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Suspender"
          content="
          Tem certeza que deseja Suspender?"
          action={
            <Button variant="contained" color="error" onClick={onSuspendRow}>
              Suspender
            </Button>
          }
        />) : (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Ativar"
          content="
          Tem certeza que deseja Ativar?"
          action={
            <Button variant="contained" color="success" onClick={onActiveRow}>
              Ativar
            </Button>
          }
      />)}
    </>
  );
}
