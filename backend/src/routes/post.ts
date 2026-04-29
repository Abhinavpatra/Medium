import { createBlogInput, updateBlogInput } from "@abhinavpatra/common";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import type { BlogContext, PostWithPreview, BulkPostResult } from "../types";

const blogRouter = new Hono<BlogContext>();

blogRouter.get("/", (c) => {
  return c.json({ message: "blog Router is working" });
});

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  console.log(`Request method: ${c.req.method}, Path: ${c.req.url}`);

  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id as string);
      await next();
    } else {
      c.status(401);
      return c.json({
        message: "You are not authorized",
      });
    }
  } catch (e) {
    console.error("Auth middleware error:", e);
    c.status(401);
    return c.json({
      message: "You are not authorized",
    });
  }
});

blogRouter.post("/new-post", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid INPUT/inputs" });
    }

    const userId = c.get("userId");
    if (!userId) {
      c.status(401);
      return c.json({ message: "Unauthorized - User ID not found" });
    }

    const prisma = new PrismaClient().$extends(withAccelerate());

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
    return c.json({
      message: "Error creating post",
      error: error,
    });
  }
});

blogRouter.put("/update-post", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        message: "invalid INPUT/inputs",
      });
    }

    const userId = c.get("userId");
    const prisma = new PrismaClient().$extends(withAccelerate());

    // Check if post exists and user owns it
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

    return c.json({
      id: post.id,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    c.status(500);
    return c.json({
      message: "Error updating post",
      error: error,
    });
  }
});

blogRouter.post("/:id/comments", async (c) => {
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
      return c.json({
        message: "Comment must be between 1 and 600 characters",
      });
    }

    const userId = c.get("userId");
    const prisma = new PrismaClient().$extends(withAccelerate());

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      c.status(404);
      return c.json({ message: "Post not found" });
    }

    const existingCommentCount = await prisma.comment.count({
      where: {
        postId,
        authorId: userId,
      },
    });

    if (existingCommentCount >= 10) {
      c.status(429);
      return c.json({ message: "Comment limit reached for this post" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    c.status(500);
    return c.json({ message: "Error creating comment", error });
  }
});

blogRouter.get("/bulk", async (c) => {
  console.log("Fetching posts in bulk");

  const prisma = new PrismaClient().$extends(withAccelerate());

  try {
    // Get pagination parameters from query string
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        id: "desc", // Show newest first
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

    // Truncate content for bulk view
    const postsWithPreview = posts.map((post) => ({
      ...post,
      content:
        post.content.substring(0, 200) +
        (post.content.length > 200 ? "..." : ""),
    }));

    // Get total count for pagination
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

blogRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    c.status(400);
    return c.json({ message: "Invalid post ID" });
  }

  const prisma = new PrismaClient().$extends(withAccelerate());

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        content: true,
        title: true,
        id: true,
        authorId: true,
        author: {
          select: {
            name: true,
            id: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      c.status(404);
      return c.json({ message: "Post not found" });
    }

    return c.json({
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    c.status(500);
    return c.json({
      message: "Error fetching post",
      error: error,
    });
  }
});

export default blogRouter;

