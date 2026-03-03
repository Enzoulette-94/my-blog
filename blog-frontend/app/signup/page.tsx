"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { signupSchema, SignupInput } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export default function SignupPage() {
  const { signup } = useAuth()

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", password_confirmation: "" },
  })

  async function onSubmit(values: SignupInput) {
    try {
      await signup(values.email, values.password, values.password_confirmation)
      toast.success("Compte créé avec succès !")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'inscription")
    }
  }

  return (
    <div className="flex justify-center items-start pt-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>Créez votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="vous@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Minimum 6 caractères" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password_confirmation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Création..." : "Créer mon compte"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground justify-center">
          Déjà un compte ?&nbsp;
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
