import { useState } from 'react';
import { Divider, List, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useChatContext } from 'src/hooks/useChatContext';
import { useAuthContext } from '../../../../auth/useAuthContext';
import BadgeStatus from '../../../../components/badge-status';
import { CustomAvatar } from '../../../../components/custom-avatar';
import MenuPopover from '../../../../components/menu-popover';

const STATUS = ['online', 'invisível', 'ausente'] as const;

export default function ChatNavAccount() {
  const { user } = useAuthContext();
  const { status, updateStatus } = useChatContext();

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <CustomAvatar
        src={user?.profile?.avatar}
        alt={user?.profile?.fullname}
        name={user?.profile?.fullname}
        // BadgeProps={{
        //   badgeContent: <BadgeStatus status={status} />,
        // }}
        onClick={handleOpenPopover}
        sx={{ cursor: 'pointer', width: 48, height: 48 }}
      />

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="top-left" sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2, pr: 1, pl: 2.5 }}>
          <div>
            <Typography noWrap variant="subtitle2">
              {user?.profile?.fullname}
            </Typography>

            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </div>
        </Stack>

        <Divider />

        <List sx={{ px: 1 }}>
          <MenuItem>
            {/* <BadgeStatus size="large" status={status} sx={{ m: 0.5, flexShrink: 0 }} /> */}

            <Select
              native
              fullWidth
              value={status}
              // onChange={(event) => updateStatus(event.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  p: 0,
                  pl: 2,
                  typography: 'body2',
                  textTransform: 'capitalize',
                },
                '& .MuiNativeSelect-icon': {
                  right: -16,
                  top: 'unset',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  display: 'none',
                },
              }}
            >
              {STATUS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </MenuItem>
        </List>
      </MenuPopover>
    </>
  );
}
