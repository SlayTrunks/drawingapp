import { z } from "zod";

export const signupSchema  = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  
  password: z
    .string(),

    photo:z
    .string()

    ,

    name: z
    .string(),
});

export const signinSchema = z.object({
    
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  
  password: z
    .string(),
})
export const jwtsecret = "secret";

