import {
  Avatar,
  Button,
  Checkbox, IconButton, MenuItem, Stack, TableCell, TableRow, Typography
} from '@mui/material';
import { useState } from 'react';
import { IPartner } from 'src/@types/partner';
import { maskCpfCnpj } from 'src/utils/formatForm';
import ConfirmDialog from '../../../../components/confirm-dialog';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import MenuPopover from '../../../../components/menu-popover';

type Props = {
  row: IPartner;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onSuspendRow: VoidFunction;
  onManagementRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onSuspendRow,
  onManagementRow,
}: Props) {
  const { legal_name, document, active, email, avatar } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openConfirmSuspend, setOpenConfirmSuspend] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirmSuspend = () => {
    setOpenConfirmSuspend(true);
  };

  const handleCloseConfirmSuspend = () => {
    setOpenConfirmSuspend(false);
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
            {avatar instanceof File ? (
              <Avatar alt={legal_name} src={URL.createObjectURL(avatar)} />
            ) : (
              <Avatar alt={legal_name} src={avatar} />
            )}
            <Typography
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              variant="subtitle2"
              noWrap
            >
              {legal_name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{maskCpfCnpj(document)}</TableCell>
        <TableCell align="left">{email}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(active === false && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {active ? 'Ativo' : 'Suspenso'}
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
        {active === true ? (
          <MenuItem
            onClick={() => {
              handleOpenConfirmSuspend();
              handleClosePopover();
            }}
            sx={{ color: 'warning.main' }}
          >
            <Iconify icon="eva:slash-outline" />
            Suspender
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleOpenConfirmSuspend();
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Deletar"
        content="
        Tem certeza que deseja deletar?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Deletar
          </Button>
        }
      />
      {active === true ? (
        <ConfirmDialog
          open={openConfirmSuspend}
          onClose={handleCloseConfirmSuspend}
          title="Suspender"
          content="
        Tem certeza que deseja Suspender?"
          action={
            <Button variant="contained" color="error" onClick={onSuspendRow}>
              Suspender
            </Button>
          }
        />
      ) : (
        <ConfirmDialog
          open={openConfirmSuspend}
          onClose={handleCloseConfirmSuspend}
          title="Ativar"
          content="
        Tem certeza que deseja Ativar?"
          action={
            <Button variant="contained" color="success" onClick={onSuspendRow}>
              Ativar
            </Button>
          }
        />
      )}
    </>
  );
}
