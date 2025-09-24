import { IconButton, InputAdornment, InputBase, InputBaseProps, Stack } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import Iconify from '../../../../components/iconify';

interface Props extends InputBaseProps {
  conversationId: string | null;
  handleSendMessage: (message?: string) => void;
}

export default function ChatMessageInput({
  disabled,
  conversationId,
  handleSendMessage,
  sx,
  ...other
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');

  const handleKeyboardSendMessage = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (message === '') return;
        handleSendMessage(message);
        setMessage('');
      }
    },
    [message, setMessage]
  );

  const handleClickSendMessage = useCallback(() => {
    if (message === '') return;
    handleSendMessage(message);
    setMessage('');
  }, [message, setMessage]);

  return (
    <>
      <InputBase
        value={message}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          handleKeyboardSendMessage(e);
        }}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        placeholder="Digite sua mensagem..."
        // startAdornment={
        //   <InputAdornment position="start">
        //     <IconButton size="small">
        //       <Iconify icon="eva:smiling-face-fill" />
        //     </IconButton>
        //   </InputAdornment>
        // }
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            <IconButton disabled={disabled} size="small" onClick={() => handleClickSendMessage()}>
              <Iconify icon="ic:outline-send" />
            </IconButton>
          </Stack>
        }
        sx={{
          pl: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
        {...other}
      />

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </>
  );
}
