import { title } from 'process'
import z from 'zod'


export const signUpInput= z.object({
    username:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()
  })
  



// This line creates a type that is inferred from the signUpInput schema.
// It creates a type that is the same as the type of the data that is expected
// to be passed to the signUpInput schema.
// For example, if you have a function that takes a signUpInput, you can
// use the SignUpInput type like this:
// function signup(input: SignUpInput) { ... }
// This will ensure that the input passed to the function is valid according
// to the signUpInput schema.

export const signInInput= z.object({
  username:z.string().email(),
  password:z.string().min(6),
})


export const createBlogInput=z.object({
    title:z.string(),
    content:z.string(),
})




export const updateBlogInput=z.object({
    title:z.string(),
    content:z.string(),
    id:z.string()
})

export type updateBlogInput=z.infer<typeof createBlogInput>
export type createBlogInput=z.infer<typeof createBlogInput>
export type signInInput=z.infer<typeof signInInput>
export type SignUpInput = z.infer<typeof signUpInput>
