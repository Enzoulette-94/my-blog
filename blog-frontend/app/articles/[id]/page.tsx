"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { articlesApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CommentSection } from "@/components/articles/comment-section"
import { Lock, Pencil, Trash2, ArrowLeft } from "lucide-react"

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, token } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", id, token],
    queryFn: () => articlesApi.get(Number(id), token || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: () => articlesApi.delete(Number(id), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      toast.success("Article supprimé")
      router.push("/articles")
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  })

  if (isLoading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )

  if (isError || !article) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Article introuvable ou accès refusé.</p>
      <Button asChild variant="link" className="mt-4">
        <Link href="/articles">Retour aux articles</Link>
      </Button>
    </div>
  )

  const isOwner = user?.email === article.author

  return (
    <div className="max-w-2xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/articles">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
        <div className="flex items-center gap-2 shrink-0">
          {article.private && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              Privé
            </Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Par {article.author} · {new Date(article.created_at).toLocaleDateString("fr-FR", { dateStyle: "long" })}
      </p>

      {isOwner && (
        <div className="flex gap-2 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/articles/${article.id}/edit`}>
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. L&apos;article et tous ses commentaires seront supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap mb-12">
        {article.content}
      </div>

      <CommentSection articleId={Number(id)} />
    </div>
  )
}
