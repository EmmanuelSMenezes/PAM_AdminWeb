import { Button, Checkbox, IconButton, MenuItem, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import { ICollaboratorResponse } from 'src/@types/collaborator';
import { useAuthContext } from 'src/auth/useAuthContext';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';

type Props = {
  row: ICollaboratorResponse;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onSuspendRow: VoidFunction;
  onActiveRow: VoidFunction;
};

export default function CollaboratorTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onSuspendRow,
  onActiveRow,
}: Props) {
  const { fullname, email } = row;
  const { user } = useAuthContext();
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
      <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="left">{fullname}</TableCell>
        <TableCell align="left">{row.profile.document}</TableCell>
        <TableCell align="left">{email}</TableCell>
        <TableCell align="left">
          <Label
            variant="soft"
            color={(row.active === false && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {row.active ? 'Ativo' : 'Suspenso'}
          </Label>
        </TableCell>
        {!user?.isCollaborator && (
          <TableCell align="right">
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}
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
        {row.active !== true ? (
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
    </>
  );
}
