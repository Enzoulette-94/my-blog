"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { photosApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Trash2, User, ImageOff } from "lucide-react"

export default function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token, user } = useAuth()
  const queryClient = useQueryClient()

  const { data: photo, isLoading, isError } = useQuery({
    queryKey: ["photo", id],
    queryFn: () => photosApi.get(Number(id)),
  })

  const deleteMutation = useMutation({
    mutationFn: () => photosApi.delete(Number(id), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos", "public"] })
      toast.success("Photo supprimée")
      router.push("/photos")
    },
    onError: () => {
      toast.error("Erreur lors de la suppression")
    },
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="aspect-square w-full rounded-xl" />
        <Skeleton className="h-5 w-40" />
      </div>
    )
  }

  if (isError || !photo) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <ImageOff className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>Photo introuvable.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/photos")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la galerie
        </Button>
      </div>
    )
  }

  const isOwner = !!token && !!user && user.id === photo.user.id

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/photos")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Galerie
        </Button>

        {isOwner && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border bg-muted aspect-square">
        {photo.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.url}
            alt="Photo"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <ImageOff className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>{photo.user.email}</span>
        <span className="ml-auto">
          {new Date(photo.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  )
}
