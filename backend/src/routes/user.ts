import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt';

// this was published using npm publish --access public
import { signUpInput } from '@abhinavpatra/common';

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signUpInput.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({
            message: "invalid INPUT/inputs"
        });
    }

    const user = await prisma.user.create({
        data: {
            username: body.username,
            password: body.password,
            name: body.name
        }
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
        jwt: token
    });
});

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const user = await prisma.user.findUnique({
        where: {
            username: body.username,
            password: body.password
        }
    });

    if (!user) {
        c.status(403);
        return c.json({ error: "User not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({"jwt":jwt});
});

// New route: Get all users
userRouter.get('/all-users', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const users = await prisma.user.findMany();
        return c.json({ users });
    } catch (e) {
        c.status(500);
        return c.json({ error: "Error fetching users", details: e });
    }
});

export default userRouter;
