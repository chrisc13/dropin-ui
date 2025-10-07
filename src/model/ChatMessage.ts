export interface ChatMessage {
    id: string;
    sender: string;
    message: string;
    timestamp: string; // could parse to Date if needed
  }
  
  export interface ConversationPreview {
    otherUser: string;
    lastMessage: ChatMessage;
  }

