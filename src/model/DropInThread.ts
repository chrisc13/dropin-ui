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
    extraFields?: Record<string, any>;
  }

  export interface Like {
    username: string;
    id: string;
  }

  export interface Comment {
    username: string;
    id: string;
    userImageUrl: string;
  }
  