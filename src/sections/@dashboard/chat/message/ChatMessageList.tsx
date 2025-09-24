import { useEffect, useRef, useState } from 'react';
import { IChat } from 'src/@types/communication';
import { Lightbox } from 'src/components/lightbox';
import Scrollbar from '../../../../components/scrollbar';
import ChatMessageItem from './ChatMessageItem';

type Props = {
  chat?: IChat;
};

export default function ChatMessageList({ chat }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<number>(-1);

  const imagesLightbox = chat?.messages
    ?.filter((message) => message.messageType === 'IMG')
    ?.map((messages) => ({ src: messages.content }));

  const handleOpenLightbox = (imageUrl: string) => {
    const imageIndex = imagesLightbox?.findIndex((image) => image.src === imageUrl);
    if (imageIndex !== undefined) {
      setSelectedImage(imageIndex);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const scrollMessagesToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollMessagesToBottom();
  }, [chat]);

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{
          ref: scrollRef,
        }}
        sx={{ p: 3, height: 1 }}
      >
        {chat?.messages?.map((message) => (
          <ChatMessageItem
            key={message?.message_id ? message?.message_id : `${Math.random() * 999999}-newmessage`}
            message={message}
            chat={chat}
            onOpenLightbox={() => handleOpenLightbox(message.content)}
          />
        ))}
      </Scrollbar>
      <Lightbox
        index={selectedImage}
        slides={imagesLightbox}
        open={selectedImage >= 0}
        close={handleCloseLightbox}
      />
    </>
  );
}
