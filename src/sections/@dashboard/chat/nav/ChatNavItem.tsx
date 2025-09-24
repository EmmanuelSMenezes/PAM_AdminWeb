import { ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { IChat, Member } from 'src/@types/communication';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useChatContext } from 'src/hooks/useChatContext';
import { getDateOnTimeZone } from 'src/utils/date';
import { useEffect } from 'react';
import BadgeStatus from '../../../../components/badge-status';
import { CustomAvatar, CustomAvatarGroup } from '../../../../components/custom-avatar';

type Props = {
  chat: IChat;
  openNav: boolean;
  isSelected: boolean;
  onSelect: VoidFunction;
  isClosed: boolean;
};

export default function ChatNavItem({ chat, openNav, isSelected, onSelect, isClosed }: Props) {
  const { user } = useAuthContext();
  const { usersStatus } = useChatContext();
  const details = getDetails(chat, user?.isCollaborator ? user?.sponsor_id : user?.user_id);
  const lastActivity = chat?.lastMessage?.read_at || chat?.lastMessage?.created_at;
  const newLastActivity =
    new Date().toLocaleDateString('pt-BR') === new Date(lastActivity).toLocaleDateString('pt-BR')
      ? new Date(lastActivity).getHours() !== new Date().getHours()
        ? getDateOnTimeZone(lastActivity, -3).toTimeString().slice(0, 5)
        : new Date(lastActivity).toTimeString().slice(0, 5)
      : new Date(lastActivity).toLocaleDateString('pt-BR');

  const isUnread = () => {
    const messagesCount = chat?.messages.filter(
      (message) => message.sender_id !== user?.user_id && message?.read_at === null
    ).length;
    if (chat.closed && chat.closed_by) return false;
    if (messagesCount > 0) return true;
    return false;
  };

  const status = usersStatus.find(
    (s) => s.User_id === details?.otherParticipants[0]?.user_id
  )?.Status;

  return (
    <ListItemButton
      disableGutters
      onClick={onSelect}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        {details.otherParticipants.length > 1 ? (
          <CustomAvatarGroup compact sx={{ width: 48, height: 48 }}>
            {details.otherParticipants.slice(0, 2).map((participant: Member) => (
              <CustomAvatar
                key={participant?.user_id}
                alt={participant?.name}
                src={participant?.avatar}
              />
            ))}
          </CustomAvatarGroup>
        ) : (
          <CustomAvatar
            key={details.otherParticipants[0]?.user_id}
            alt={details.otherParticipants[0]?.name}
            src={details.otherParticipants[0]?.avatar}
            BadgeProps={{
              badgeContent: <BadgeStatus status={status || 'offline'} />,
            }}
            sx={{ width: 48, height: 48 }}
          />
        )}
      </ListItemAvatar>

      {openNav && (
        <>
          <ListItemText
            primary={details.displayNames}
            primaryTypographyProps={{
              noWrap: true,
              variant: !isClosed ? 'subtitle2' : 'body2',
              color: !isClosed ? 'text.primary' : 'text.secondary',
            }}
            secondary={details.displayText}
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread() ? 'subtitle2' : 'body2',
              color: isUnread() ? 'text.primary' : 'text.secondary',
            }}
          />
          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
            >
              {lastActivity ? newLastActivity : ''}
            </Typography>
            {isUnread() && <BadgeStatus status="unread" size="small" />}
          </Stack>
        </>
      )}
    </ListItemButton>
  );
}

const getDetails = (chat: IChat, currentUserId: string) => {
  const otherParticipants = chat?.membersProfile?.filter(
    (participant: any) => participant?.user_id !== currentUserId
  );

  const displayNames =
    chat.description ||
    otherParticipants?.map((participant: Member) => participant?.name).join(', ');

  let displayText = '';
  if (chat.lastMessage) {
    const sender = chat.lastMessage.sender_id === currentUserId ? 'Você: ' : '';
    const message =
      chat.lastMessage.messageType === 'IMG' ? 'Sent a photo' : chat.lastMessage.content;
    displayText = `${sender}${message}`;
  }

  return { otherParticipants, displayNames, displayText };
};
