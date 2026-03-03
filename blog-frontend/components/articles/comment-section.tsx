"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { commentsApi } from "@/lib/api"
import { commentSchema, CommentInput } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Trash2 } from "lucide-react"

export function CommentSection({ articleId }: { articleId: number }) {
  const { user, token } = useAuth()
  const queryClient = useQueryClient()

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => commentsApi.list(articleId),
  })

  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  })

  const addMutation = useMutation({
    mutationFn: (values: CommentInput) =>
      commentsApi.create(articleId, { comment: values }, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] })
      form.reset()
      toast.success("Commentaire ajouté")
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  })

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) =>
      commentsApi.delete(articleId, commentId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] })
      toast.success("Commentaire supprimé")
    },
  })

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        Commentaires {comments ? `(${comments.length})` : ""}
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : comments?.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-4">Aucun commentaire. Soyez le premier !</p>
      ) : (
        <ul className="space-y-3 mb-6">
          {comments?.map((comment) => (
            <li key={comment.id} className="flex gap-3 rounded-lg border p-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
              {user?.email === comment.author && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMutation.mutate(comment.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => addMutation.mutate(v))} className="space-y-3">
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Ajouter un commentaire..." className="resize-none" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" size="sm" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Envoi..." : "Commenter"}
            </Button>
          </form>
        </Form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary underline-offset-4 hover:underline">Connectez-vous</a>
          {" "}pour commenter.
        </p>
      )}
    </section>
  )
}
