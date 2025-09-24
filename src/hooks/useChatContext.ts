import { useContext } from 'react';
import { ChatContext } from 'src/context/ChatContext';

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) throw new Error('useChatContext context must be use inside ChatProvider');

  return context;
};
