import { Avatar, Stack, Typography } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IChat, Message } from '../../../../@types/communication';
import Image from '../../../../components/image';

type Props = {
  message: Message;
  chat: IChat;
  onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({ message, chat, onOpenLightbox }: Props) {
  const { user } = useAuthContext();

  const sender = chat?.membersProfile?.find((member) => member?.user_id === message.sender_id);

  const senderDetails =
    message.sender_id === (user?.isCollaborator ? user?.sponsor_id : user?.user_id)
    ? {
        type: 'me',
      }
    : {
        avatar: sender?.avatar,
        name: sender?.name,
      };

  const currentUser = senderDetails.type === 'me';
  const isImage = message.messageType === 'IMG';
  const firstName = senderDetails.name === undefined ? 'Usuário Excluído' : senderDetails.name.split(' ')[0];

  const newLastActivity = new Date(message?.created_at).getHours() !== new Date().getHours()
  ? (`${new Date(message?.created_at).getHours() - 3}:${new Date(message?.created_at).toTimeString().slice(3, 5)} `)
  : new Date(message?.created_at).toTimeString().slice(0, 5)
  
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul","Ago","Set","Out","Nov","Dez"];
  const oldDateFormatted = new Date(message?.created_at);
  const dateFormatted = ((`${oldDateFormatted.getDate()  } ${  meses[(oldDateFormatted.getMonth())]  }. ${  oldDateFormatted.getFullYear()}`));
  const oldDate = new Date().toLocaleDateString('pt-BR') !== new Date(message?.created_at).toLocaleDateString('pt-BR') && dateFormatted;



  return (
    <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
      {!currentUser && (
        <Avatar
          alt={senderDetails.name}
          src={senderDetails.avatar}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack spacing={1} alignItems="flex-end">
        <Typography
          noWrap
          variant="caption"
          sx={{
            color: 'text.disabled',
            ...(!currentUser && {
              mr: 'auto',
            }),
          }}
        > 
          {!currentUser && `${firstName},`} &nbsp;
          {newLastActivity}  
          {oldDate}
        </Typography>

        <Stack
          sx={{
            p: 1.5,
            minWidth: 48,
            maxWidth: 320,
            borderRadius: 1,
            overflow: 'hidden',
            typography: 'body2',
            bgcolor: 'background.neutral',
            ...(currentUser && {
              color: 'grey.800',
              bgcolor: 'primary.lighter',
            }),
            ...(isImage && {
              p: 0,
            }),
          }}
        >
          {isImage ? (
            <Image
              alt="attachment"
              src={message.content}
              onClick={() => onOpenLightbox(message.content)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            />
          ) : (
            message.content
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
