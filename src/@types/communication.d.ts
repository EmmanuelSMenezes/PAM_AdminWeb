export interface INotification {
  notification_id: string;
  title: string;
  description: string;
  read_at?: Date | null;
  user_id: string;
  type: string;
  aux_content?: string;
  created_at: Date;
}

export interface IChat {
  chat_id: string;
  description: string;
  created_at: Date;
  updated_at?: Date;
  created_by: string;
  members: string[];
  membersProfile: Member[];
  lastMessage: LastMessage;
  messages: Message[];
  unReadCountMessages: number;
  closed_by: string;
  closed?: Date;
  order_id?: string;
}

export interface Member {
  user_id: string;
  avatar: string;
  name: string;
}

export interface LastMessage {
  content: string;
  read_at?: Date;
  created_at: Date;
  sender_id: string;
  message_id?: string;
  messageType: string;
}

export interface Message {
  content: string;
  read_at?: Date;
  created_at: Date;
  sender_id: string;
  chat_id?: string;
  message_id?: string;
  messageType: string;
}


// ************************************_________________________ *************************************
export type IChatsResponse = IChatResponse[]

export interface IChatResponse {
  chat_id: string
  description: string
  created_at: string
  updated_at: string
  created_by: string
  members: string[]
  membersProfile: MembersProfileResponse[]
  lastMessage: LastMessageResponse
  messages: MessageResponse[]
  unReadCountMessages: number
  closed_by: string
  closed: string
  order_id: string
}

export interface MembersProfileResponse {
  user_id: string
  avatar: string
  name: string
}

export interface LastMessageResponse {
  content: string
  read_at: string
  created_at: string
  sender_id: string
  messageType: string
}

export interface MessageResponse {
  content: string
  read_at: string
  created_at: string
  sender_id: string
  messageType: string
}
