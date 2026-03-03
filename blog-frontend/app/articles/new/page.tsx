"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { articlesApi } from "@/lib/api"
import { ArticleInput } from "@/lib/schemas"
import { ArticleForm } from "@/components/articles/article-form"

export default function NewArticlePage() {
  const { token } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  async function handleSubmit(values: ArticleInput) {
    if (!token) return
    try {
      const article = await articlesApi.create({ article: values }, token)
      await queryClient.invalidateQueries({ queryKey: ["articles"] })
      toast.success("Article publié !")
      router.push(`/articles/${article.id}`)
    } catch {
      toast.error("Erreur lors de la création")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouvel article</h1>
      <ArticleForm onSubmit={handleSubmit} submitLabel="Publier" />
    </div>
  )
}
