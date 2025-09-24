import { Stack, StackProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import BadgeStatus from 'src/components/badge-status';
import { CustomAvatar, CustomAvatarGroup } from 'src/components/custom-avatar';
import { useChatContext } from 'src/hooks/useChatContext';
import { IChat, Member } from '../../../../@types/communication';

interface Props extends StackProps {
  members?: Member[];
  chat?: IChat;
  handleEndChat: () => void;
}

export default function ChatHeaderCompose({ chat, members, sx, handleEndChat, ...other }: Props) {
  const { user } = useAuthContext();
  const { usersStatus } = useChatContext();
  const [statusMember, setStatusMember] = useState('');

  const selectedMember = user?.isCollaborator
    ? members?.filter((member) => member?.user_id !== user?.sponsor_id)
    : members?.filter((member) => member?.user_id !== user?.user_id);

  useEffect(() => {
    if (selectedMember && selectedMember.length === 1) {
      setStatusMember(
        usersStatus?.filter((stat) => stat?.User_id === selectedMember[0]?.user_id)[0]?.Status
      );
    }
  }, [usersStatus, selectedMember]);

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        py: 2,
        px: 2.5,
        ...sx,
      }}
      {...other}
    >
      {members?.length && selectedMember?.length && (
        <Stack direction="row" alignItems="center">
          {selectedMember.length > 1 ? (
            <CustomAvatarGroup compact sx={{ width: 48, height: 48 }}>
              {selectedMember.slice(0, 2).map((participant: Member) => (
                <CustomAvatar
                  key={participant?.user_id}
                  alt={participant?.name}
                  src={participant?.avatar}
                />
              ))}
            </CustomAvatarGroup>
          ) : (
            <CustomAvatar
              src={selectedMember[0]?.avatar}
              alt={selectedMember?.map((participant: Member) => participant?.name).join(', ')}
              name={selectedMember?.map((participant: Member) => participant?.name).join(', ')}
              // BadgeProps={{
              //   badgeContent: <BadgeStatus status={statusMember || "offline"} />,
              // }}
              sx={{ cursor: 'pointer', width: 40, height: 40 }}
            />
          )}
          {}
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', marginLeft: '10px' }}>
            {chat?.description ||
              selectedMember?.map((participant: Member) => participant?.name).join(', ')}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
