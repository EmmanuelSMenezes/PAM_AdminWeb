import { Avatar, ListItemButton, Typography } from '@mui/material';
import { IChatContact } from 'src/@types/chat';
import { useAuthContext } from 'src/auth/useAuthContext';
import SearchNotFound from '../../../../components/search-not-found';


type Props = {
  searchContacts: string;
  searchResults: any;
  onSelectChat: (chat_id: IChatContact) => void;
};

export interface IMembersProfile {
  user_id: string;
  avatar: string;
  name: string;
}

export default function ChatNavSearchResults({
  searchContacts,
  searchResults,
  onSelectChat,
}: Props) {
  const isNotFound = !searchResults.length && !!searchContacts;
  const newSearchResults = searchResults.filter((element: any)=> element.closed === null)
  const { user } = useAuthContext();

  return (
    <>
      <Typography
        paragraph
        variant="h6"
        sx={{
          px: 2.5,
        }}
      >
        Contacts
      </Typography>

      {isNotFound ? (
        <SearchNotFound
          query={searchContacts}
          sx={{
            p: 3,
            mx: 'auto',
            width: `calc(100% - 40px)`,
            bgcolor: 'background.neutral',
          }}
        />
      ) : (
        <>
          {newSearchResults.map((result: any) => (
            <ListItemButton
              key={result.id}
              onClick={() => onSelectChat(result)}
              sx={{
                px: 2.5,
                py: 1.5,
                typography: 'subtitle2',
              }}
            >

              <Avatar alt={result?.membersProfile?.filter((a: IMembersProfile)=> a?.user_id !== (user?.isCollaborator ? user?.sponsor_id : user?.user_id))[0]?.name} 
              src={result?.membersProfile?.filter((a: IMembersProfile)=> a?.user_id !== (user?.isCollaborator ? user?.sponsor_id : user?.user_id))[0]?.avatar} 
              sx={{ mr: 2 }} />
              {result?.membersProfile?.filter((a: IMembersProfile)=> a?.user_id !== (user?.isCollaborator ? user?.sponsor_id : user?.user_id))[0]?.name}
            </ListItemButton>
          ))}
        </>
      )}
    </>
  );
}
