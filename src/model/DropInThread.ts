export interface DropInThread {
    id?: string;
    title: string;
    body: string;
    creatorImageUrl: string;
    creatorName: string;
    creatorId: string;
    createdAt: string; // ISO string or Date
    comments?: Comment[];
    likes: Like[];
    commentCount: number,
    likeCount: number,
    extraFields?: Record<string, any>;
  }

  export interface Comment {
    id?: string;           // optional for new comments
    threadId: string,
    username: string;
    userId: string;
    userImageUrl?: string; // optional avatar
    body: string;
    createdAt?: string;    // optional, usually set by backend
  }
  
  export interface Like {
    id?: string;          // optional for new likes
    username: string;
    userId: string;
    createdAt?: string;   // optional, usually set by backend
  }
  