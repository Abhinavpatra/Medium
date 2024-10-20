apparently i think the issue is that i am generating a new prisma client each time i send a request, which is overloading it and as a result locally it is not working, i think i need to do the thing that next implements, that is to generate a prisma client only once in a separate file, then export it. 


userRouter.get('/all-shit', async (c) => {
   
   try {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    return c.json({ "shit, i work": "fuck yeah"});
    
   } catch (error) {
    return c.json({ "shit, i  dont work": "fuck no"});
   }
    
  
        
    
});
