import { createBlogInput, updateBlogInput } from "@abhinavpatra/common";

import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.get("/", (c) => {
  return c.json({ message: "blog Router is working" });
});

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  console.log(`Request method: ${c.req.method}, Path: ${c.req.url}`);
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    // Ensure user.id is treated as a string
    c.set("userId", user.id as string);
    await next();
  } else {
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

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

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
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "invalid INPUT/inputs",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(body.id, 10), // Convert string ID to number
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

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const posts = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        authorId: true, // Include authorId
        author: {
          select: {
            name: true,
            id: true, // Include author's id
          },
        },
      },
    });
    return c.json({
      posts,
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

// this endpoint /:id with params also but creates problems with /bulk so we are making it /specific/:id

blogRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    c.status(400);
    return c.json({ message: "Invalid post ID" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

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

// this part is working /bulk end point

export default blogRouter;

//  const blogRouter = new Hono<{
//     Bindings: {
//         DATABASE_URL: string;
//         JWT_SECRET: string;
//     },
//     Variables: {
//         userId: string;
//     }
// }>();

// blogRouter.use("/*", async (c, next) => {
//     const authHeader = c.req.header("authorization") || "";
//     try {
//         const user = await verify(authHeader, c.env.JWT_SECRET);
//         if (user) {
//             c.set("userId", user.id as string);
//             await next();
//         } else {
//             c.status(403);
//             return c.json({
//                 message: "You are not logged in"
//             })
//         }
//     } catch(e) {
//         c.status(403);
//         return c.json({
//             message: "You are not logged in"
//         })
//     }
// });

// blogRouter.post('/', async (c) => {
//     const body = await c.req.json();
//     const { success } = createBlogInput.safeParse(body);
//     if (!success) {
//         c.status(411);
//         return c.json({
//             message: "Inputs not correct"
//         })
//     }

//     const authorId = c.get("userId");
//     const prisma = new PrismaClient({
//       datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate())

//     const blog = await prisma.post.create({
//         data: {
//             title: body.title,
//             content: body.content,
//             authorId: authorId
//         }
//     })

//     return c.json({
//         id: blog.id
//     })
// })

// blogRouter.put('/', async (c) => {
//     const body = await c.req.json();
//     const { success } = updateBlogInput.safeParse(body);
//     if (!success) {
//         c.status(411);
//         return c.json({
//             message: "Inputs not correct"
//         })
//     }

//     const prisma = new PrismaClient({
//       datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate())

//     const blog = await prisma.post.update({
//         where: {
//             id: body.id
//         },
//         data: {
//             title: body.title,
//             content: body.content
//         }
//     })

//     return c.json({
//         id: blog.id
//     })
// })

// blogRouter.get('/:id', async (c) => {
//     const id = c.req.param("id");
//     const prisma = new PrismaClient({
//       datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate())

//     try {
//         const blog = await prisma.post.findFirst({
//             where: {
//                 id: Number(id)
//             },
//             select: {
//                 id: true,
//                 title: true,
//                 content: true,
//                 author: {
//                     select: {
//                         name: true
//                     }
//                 }
//             }
//         })

//         return c.json({
//             blog
//         });
//     } catch(e) {
//         c.status(411); // 4
//         return c.json({
//             message: "Error while fetching blog post"
//         });
//     }
// })
// // Todo: add pagination
// blogRouter.get('/bulk', async (c) => {
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate())
//     const blogs = await prisma.post.findMany({
//         select: {
//             content: true,
//             title: true,
//             id: true,
//             author: {
//                 select: {
//                     name: true
//                 }
//             }
//         }
//     });

//     return c.json({
//         blogs
//     })
// })

// export default blogRouter;
