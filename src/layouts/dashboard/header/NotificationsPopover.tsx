import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { INotification } from 'src/@types/communication';
import { useChatContext } from 'src/hooks/useChatContext';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { markAsReadNotification } from 'src/service/communication';
import { isUuid } from 'uuidv4';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import Scrollbar from '../../../components/scrollbar';
import { fToNow } from '../../../utils/date';

interface NotificationPopoverProps {
  notifications: INotification[];
  handleMarkAllAsRead: () => void;
  updateNotifications: (newNotifications: INotification[]) => void;
}

export default function NotificationsPopover({
  notifications,
  handleMarkAllAsRead,
  updateNotifications
}: NotificationPopoverProps) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [viewAllNotifications, setViewAllNotifications] = useState(false);

  const totalUnRead = notifications.filter((notification) => !notification?.read_at).length;

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

   const handleMarkAsReadNotification = async (notification: INotification) => {
    if (notification?.type === 'chat_message' && isUuid(notification?.aux_content || '')) {
      const selectedNotificationsMarkAsRead = notifications.filter(otherNotification =>
        otherNotification?.aux_content === notification?.aux_content && otherNotification?.read_at === null
      );
      selectedNotificationsMarkAsRead.forEach(async selectedNotification => {
        await markAsReadNotification(selectedNotification?.notification_id);
      });

      const newNotifications = notifications.map((n) => {
        if (selectedNotificationsMarkAsRead.map(v => v?.notification_id).includes(n?.notification_id))
        {
          return { ...n, read_at: new Date()}
        }
        return n;
      });

      updateNotifications(newNotifications);
    }
   }

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notificações</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Você tem {totalUnRead} mensagens não lidas.
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Marcar todas como lida.">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        {viewAllNotifications ? (
          <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
            {notifications.map((notification) => (
              <NotificationItem key={notification?.notification_id} notification={notification} handleClosePopover={handleClosePopover} handleMarkAsReadNotification={handleMarkAsReadNotification} />
            ))}
          </Scrollbar>
        ) : (
          <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  NOVAS
                </ListSubheader>
              }
            >
              {notifications.slice(0, 3).map((notification) => (
                <NotificationItem key={notification?.notification_id} notification={notification} handleClosePopover={handleClosePopover} handleMarkAsReadNotification={handleMarkAsReadNotification} />
              ))}
            </List>

            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  ANTERIORES
                </ListSubheader>
              }
            >
              {notifications.slice(3, 7).map((notification) => (
                <NotificationItem key={notification?.notification_id} notification={notification} handleClosePopover={handleClosePopover} handleMarkAsReadNotification={handleMarkAsReadNotification} />
              ))}
            </List>
          </Scrollbar>
        )}
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            disableRipple
            onClick={() => setViewAllNotifications(!viewAllNotifications)}
          >
            {!viewAllNotifications ? 'Visualizar todas' : 'Visualizar menos'}
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

function NotificationItem({ notification, handleClosePopover, handleMarkAsReadNotification }: { notification: INotification, handleClosePopover: () => void, handleMarkAsReadNotification: (notification: INotification) => void }) {
  const { avatar, title } = renderContent(notification);
  const { setPreSelectedChat } = useChatContext();
  const { push } = useRouter()

  const handleClickNotificationAction = async () => {
    if (notification?.type === 'chat_message' && isUuid(notification?.aux_content || '')) {
      setPreSelectedChat(notification?.aux_content);
      await handleMarkAsReadNotification(notification);
      handleClosePopover();
      push(PATH_DASHBOARD.chat.root);
    }
  };

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification?.read_at && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={handleClickNotificationAction}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification?.created_at)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: INotification) {
  const title = (
    <>
      <Typography variant="subtitle2">{notification?.title}</Typography>
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        {notification?.description}
      </Typography>
    </>
  );

  if (notification?.type === 'order_placed') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }
  if (notification?.type === 'order_shipped') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_shipping.svg" />,
      title,
    };
  }
  if (notification?.type === 'mail') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_mail.svg" />,
      title,
    };
  }
  if (notification?.type === 'chat_message') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_chat.svg" />,
      title,
    };
  }
  return {
    avatar: (
      <img alt={notification?.title} src="/assets/icons/notification/ic_info.png" width={28} />
    ),
    title,
  };
}
