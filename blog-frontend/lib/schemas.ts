import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export const signupSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
})

export const articleSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  content: z.string().min(1, "Contenu requis"),
  private: z.boolean(),
})

export const commentSchema = z.object({
  content: z.string().min(1, "Commentaire requis"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ArticleInput = z.infer<typeof articleSchema>
export type CommentInput = z.infer<typeof commentSchema>
