import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';
import { signUpInput } from '@abhinavpatra/common';

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

userRouter.get('/', (c) => {
    return c.json({ message: "User Router is working" });
});

userRouter.post('/signup', async (c) => {
    console.log("User signup route hit");
    console.log('Environment check:', {
        hasJwtSecret: !!c.env.JWT_SECRET,
        jwtSecretLength: c.env.JWT_SECRET?.length
    });
    
    try {
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
        
        console.log("User signup route hit2");

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
    } catch (e: any) {
        console.error("Signup error:", e);
        
        if (e.code === 'P2002') {
            c.status(409);
            return c.json({ error: "Username already exists" });
        }
        
        c.status(500);
        return c.json({ error: "Error creating user" });
    }
});

userRouter.post('/signin', async (c) => {
    try {
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
        return c.json({"jwt": jwt});
    } catch (e) {
        console.error("Signin error:", e);
        c.status(500);
        return c.json({ error: "Error signing in" });
    }
});

userRouter.get('/me', async(c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        
        const authHeader = c.req.header('Authorization');
        if (!authHeader) {
            c.status(401);
            return c.json({ error: "Unauthorized" });
        }
        
        const user = await verify(authHeader, c.env.JWT_SECRET) as { id: string };
        const userData = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                id: true,
                name: true,
                username: true
            }
        });
        
        if (!userData) {
            c.status(404);
            return c.json({ error: "User not found" });
        }
        
        return c.json({ user: userData });
    } catch (e) {
        console.error("Auth error:", e);
        c.status(403);
        return c.json({ error: "Invalid token" });
    }
});

userRouter.get('/all-users', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
            }
        });
        return c.json({ users });
    } catch (e) {
        console.error("Error fetching users:", e);
        c.status(500);
        return c.json({ error: "Error fetching users", details: e });
    }
});

export default userRouter;