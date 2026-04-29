import { createBlogInput, updateBlogInput } from "@abhinavpatra/common";
import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import type { UserContext } from '../types';

const blogRouter = new Hono<UserContext>();

function createPrismaClient(accelerateUrl: string) {
    return new PrismaClient({
        accelerateUrl
    }).$extends(withAccelerate());
}

blogRouter.get("/", (c) => {
  return c.json({ message: "blog Router is working" });
});

blogRouter.get("/bulk", async (c) => {
  console.log("Fetching posts in bulk");

  const prisma = createPrismaClient(c.env.DATABASE_URL as string);

  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        id: "desc",
      },
      select: {
        title: true,
        content: true,
        id: true,
        authorId: true,
        author: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const postsWithPreview = posts.map((post) => ({
      ...post,
      content:
        post.content.substring(0, 200) +
        (post.content.length > 200 ? "..." : ""),
    }));

    const totalPosts = await prisma.post.count();

    return c.json({
      posts: postsWithPreview,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    c.status(500);
    return c.json({
      message: "Error fetching posts",
      error: error,
    });
  }
});

blogRouter.post("/new-post", async (c) => {
  const authHeader = c.req.header("Authorization") || "";
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET, "HS256");
    c.set("userId", user.id as string);
  } catch (e) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  try {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid inputs" });
    }

    const userId = c.get("userId") as string;
    const prisma = createPrismaClient(c.env.DATABASE_URL as string);

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });

    return c.json({ id: post.id });
  } catch (error) {
    console.error("Error creating post:", error);
    c.status(500);
    return c.json({ message: "Error creating post", error: error });
  }
});

blogRouter.put("/update-post", async (c) => {
  const authHeader = c.req.header("Authorization") || "";
  let userId: string;
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET, "HS256");
    userId = user.id as string;
  } catch (e) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  try {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid inputs" });
    }

    const prisma = createPrismaClient(c.env.DATABASE_URL as string);

    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(body.id, 10) },
    });

    if (!existingPost) {
      c.status(404);
      return c.json({ message: "Post not found" });
    }

    if (existingPost.authorId !== userId) {
      c.status(403);
      return c.json({ message: "Not authorized to update this post" });
    }

    const post = await prisma.post.update({
      where: {
        id: parseInt(body.id, 10),
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({ id: post.id });
  } catch (error) {
    console.error("Error updating post:", error);
    c.status(500);
    return c.json({ message: "Error updating post", error: error });
  }
});

blogRouter.post("/:id/comments", async (c) => {
  const authHeader = c.req.header("Authorization") || "";
  let userId: string;
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET, "HS256");
    userId = user.id as string;
  } catch (e) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  try {
    const postId = parseInt(c.req.param("id"), 10);

    if (Number.isNaN(postId)) {
      c.status(400);
      return c.json({ message: "Invalid post ID" });
    }

    const body = await c.req.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!content || content.length > 600) {
      c.status(411);
      return c.json({ message: "Comment must be between 1 and 600 characters" });
    }

    const prisma = createPrismaClient(c.env.DATABASE_URL as string);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      c.status(404);
      return c.json({ message: "Post not found" });
    }

    const existingCommentCount = await prisma.comment.count({
      where: { postId, authorId: userId },
    });

    if (existingCommentCount >= 10) {
      c.status(429);
      return c.json({ message: "Comment limit reached for this post" });
    }

    const comment = await prisma.comment.create({
      data: { content, postId, authorId: userId },
      select: { id: true, content: true, createdAt: true },
    });

    return c.json({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    c.status(500);
    return c.json({ message: "Error creating comment", error });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    c.status(400);
    return c.json({ message: "Invalid post ID" });
  }

  const prisma = createPrismaClient(c.env.DATABASE_URL as string);

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        content: true,
        title: true,
        id: true,
        authorId: true,
        author: { select: { name: true, id: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          select: { id: true, content: true, createdAt: true, author: { select: { name: true, username: true } } },
        },
      },
    });

    if (!post) {
      c.status(404);
      return c.json({ message: "Post not found" });
    }

    return c.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    c.status(500);
    return c.json({ message: "Error fetching post", error });
  }
});

export default blogRouter;