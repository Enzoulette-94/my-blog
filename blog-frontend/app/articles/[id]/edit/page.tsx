"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { articlesApi } from "@/lib/api"
import { ArticleInput } from "@/lib/schemas"
import { ArticleForm } from "@/components/articles/article-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>()
  const { token, user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id, token],
    queryFn: () => articlesApi.get(Number(id), token || undefined),
  })

  async function handleSubmit(values: ArticleInput) {
    if (!token) return
    try {
      await articlesApi.update(Number(id), { article: values }, token)
      queryClient.invalidateQueries({ queryKey: ["article", id] })
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      toast.success("Article mis à jour !")
      router.push(`/articles/${id}`)
    } catch {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  if (isLoading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )

  if (!article || article.author !== user?.email) {
    return <p className="text-center text-muted-foreground py-16">Accès refusé.</p>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier l&apos;article</h1>
      <ArticleForm
        defaultValues={article}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  )
}
