export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  category: string;
  date: string;
  likes: string[];
  comments: Comment[];
  flags?: Flag[];
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  date: string;
  replies: Reply[];
}

export interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  date: string;
}

export interface Flag {
  user: string;
  reason: string;
  date: string;
} 