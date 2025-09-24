import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AppBar, IconButton, Stack, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { INotification } from 'src/@types/communication';
import { useAuthContext } from 'src/auth/useAuthContext';
import { getNotificationsByUserId, markAsReadNotification } from 'src/service/communication';
import Iconify from '../../../components/iconify';
import Logo from '../../../components/logo';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import { HEADER, HOST_API_COMMUNICATION, NAV } from '../../../config-global';
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
import { bgBlur } from '../../../utils/cssStyles';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const [notifications, setNotifications] = useState<INotification[]>([] as INotification[]);
  const [notificationSignalRConnection, setNotificationSignalRConnection] = useState<
    HubConnection | undefined
  >();
  const { enqueueSnackbar } = useSnackbar();
  const { user, token } = useAuthContext();
  const theme = useTheme();

  const { themeLayout } = useSettingsContext();

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const isDesktop = useResponsive('up', 'lg');

  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;

  const updateNotifications = (newNotifications: INotification[]) => setNotifications(newNotifications);

  const getAllNotifications = useCallback(async () => {
    try {
      const response = await getNotificationsByUserId(user?.user_id);
      setNotifications(response);
    } catch (error) {
      enqueueSnackbar(
        'Não foi possivel recuperar as notificações, atualize a página e tente novamente.',
        {
          variant: 'error',
        }
      );
    }
  }, []);

  useEffect(() => {
    getAllNotifications();
  }, []);

  const createHubConnectionSignalR = async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${HOST_API_COMMUNICATION}notification-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    await newConnection.start();
    setNotificationSignalRConnection(newConnection);
  };

  useEffect(() => {
    createHubConnectionSignalR();
  }, []);

  useEffect(() => {
    if (notificationSignalRConnection) {
      notificationSignalRConnection.invoke('ListenNotificationsByUser', user?.user_id);
      notificationSignalRConnection.on('ReiceveNotifications', (notification) => {
        console.info(`[WS - ON]: Notification Received.`);
        setNotifications((old) => [JSON.parse(notification), ...old]);
      });
    }
  }, [notificationSignalRConnection]);

  const handleMarkAllAsRead = useCallback(async () => {
    const unReadNotifications = notifications.filter((notification) => !notification.read_at);

    const requests: Promise<INotification>[] = [];
    unReadNotifications.forEach(
      (unReadNotification) =>
        requests.push(markAsReadNotification(unReadNotification.notification_id))
    );

    await Promise.all(requests)
      .then()
      .finally(() => {
        getAllNotifications();
      });
  }, [notifications, getAllNotifications, setNotifications]);

  const renderContent = (
    <>
      {isDesktop && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        {/* <LanguagePopover /> */}

        <NotificationsPopover
          notifications={notifications}
          handleMarkAllAsRead={handleMarkAllAsRead}
          updateNotifications={updateNotifications}
        />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
