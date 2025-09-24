import { IconButton, Link, Stack, Typography } from '@mui/material';
import { Member } from 'src/@types/communication';
import { useAuthContext } from 'src/auth/useAuthContext';
import BadgeStatus from '../../../../components/badge-status';
import { CustomAvatar, CustomAvatarGroup } from '../../../../components/custom-avatar';
import Iconify from '../../../../components/iconify';

type Props = {
  members?: Member[];
};

export default function ChatHeaderDetail({ members }: Props) {
  const { user } = useAuthContext();
  const isGroup = false;
  const participantInfo = members?.filter((member) =>
    member?.user_id !== user?.isCollaborator ? user?.sponsor_id : user?.user_id
  )[0];

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 1, 2, 2),
      }}
    >
      {isGroup ? (
        <Stack flexGrow={1}>
          <CustomAvatarGroup max={3}>
            {members?.map((participant) => (
              <CustomAvatar
                key={participant?.user_id}
                alt={participant?.name}
                src={participant?.avatar}
              />
            ))}
          </CustomAvatarGroup>

          <Link
            variant="body2"
            sx={{
              mt: 0.5,
              alignItems: 'center',
              display: 'inline-flex',
              color: 'text.secondary',
            }}
          >
            {members?.length} persons
            <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
          </Link>
        </Stack>
      ) : (
        <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
          <CustomAvatar
            src={participantInfo?.avatar}
            alt={participantInfo?.name}
            // BadgeProps={{
            //   badgeContent: <BadgeStatus status="online" />,
            // }}
          />

          <div>
            <Typography variant="subtitle2">{participantInfo?.name}</Typography>
          </div>
        </Stack>
      )}

      <IconButton>
        <Iconify icon="eva:phone-fill" />
      </IconButton>

      <IconButton>
        <Iconify icon="eva:video-fill" />
      </IconButton>

      <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );
}
