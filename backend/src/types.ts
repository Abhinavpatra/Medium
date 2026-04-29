import type { PrismaClient } from "@prisma/client/edge";

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export interface BlogBindings {
  Bindings: Env;
  Variables: {
    userId: string;
  };
}

export interface UserBindings {
  Bindings: Env;
  Variables: {
    userId: string;
  };
}

export type BlogContext = {
  Bindings: Env;
  Variables: {
    userId: string;
  };
}

export type UserContext = {
  Bindings: Env;
  Variables: Record<string, unknown>;
}

export interface PostSelectResult {
  id: number;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
}

export interface PostWithAuthor {
  id: number;
  title: string;
  content: string;
  authorId: string;
  author: {
    name: string | null;
    id: number;
  };
}

export type PostWithPreview = Pick<PostWithAuthor, 'id' | 'title' | 'content' | 'authorId'> & {
  author: Pick<PostWithAuthor['author'], 'name' | 'id'>;
};

export interface BulkPostResult {
  id: number;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  author: {
    name: string | null;
    id: number;
  } | null;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  authorId: string;
  author: {
    name: string | null;
    id: number;
  };
  comments: CommentWithAuthor[];
}

export interface CommentWithAuthor {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    id: number;
    name: string | null;
    username: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserData {
  id: number;
  name: string | null;
  username: string;
}

export interface ParsedJwtPayload {
  id: string | number;
}