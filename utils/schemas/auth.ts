import z from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
});

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export type SignupType = z.infer<typeof signupInput>;
export type SigninType = z.infer<typeof signinInput>;