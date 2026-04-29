export interface SignUpInput {
  username: string;
  password: string;
  name?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    username: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
  };
  comments?: Comment[];
}

export interface BlogsResponse {
  posts: BlogPost[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogDetailResponse {
  post: BlogPost;
}

export interface AuthResponse {
  jwt: string;
}

export interface UserResponse {
  user: User;
}

export interface CreatePostInput {
  title: string;
  content: string;
}

export interface UpdatePostInput {
  id: string;
  title: string;
  content: string;
}

export interface CreateCommentInput {
  content: string;
}

export interface CommentResponse {
  comment: Comment;
}