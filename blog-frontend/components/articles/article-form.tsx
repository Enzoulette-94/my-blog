"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Article } from "@/lib/types"
import { articleSchema, ArticleInput } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"

interface ArticleFormProps {
  defaultValues?: Partial<Article>
  onSubmit: (values: ArticleInput) => Promise<void>
  submitLabel: string
}

export function ArticleForm({ defaultValues, onSubmit, submitLabel }: ArticleFormProps) {
  const form = useForm<ArticleInput, unknown, ArticleInput>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      private: defaultValues?.private ?? false,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Titre</FormLabel>
            <FormControl>
              <Input placeholder="Le titre de votre article" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Contenu</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Écrivez votre article ici..."
                className="min-h-[300px] resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="private" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel>Article privé</FormLabel>
              <FormDescription>Visible uniquement par vous</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Enregistrement..." : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
