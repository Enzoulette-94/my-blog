"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { photosApi } from "@/lib/api"
import { PhotoUpload } from "@/components/photos/photo-upload"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ImageOff, User } from "lucide-react"

const BATCH_SIZE = 12

export default function PhotosPage() {
  const { token } = useAuth()
  const [visible, setVisible] = useState(BATCH_SIZE)

  const { data: photos, isLoading } = useQuery({
    queryKey: ["photos", "public"],
    queryFn: () => photosApi.publicList(),
  })

  const displayed = photos?.slice(0, visible) ?? []
  const hasMore = photos ? visible < photos.length : false

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Galerie photos</h1>

      {token && (
        <div className="mb-8">
          <h2 className="text-base font-semibold mb-3">Ajouter une photo</h2>
          <PhotoUpload />
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: BATCH_SIZE }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : photos?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageOff className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p>Aucune photo pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {displayed.map((photo) => (
              <Link
                key={photo.id}
                href={`/photos/${photo.id}`}
                className="relative group rounded-lg overflow-hidden border aspect-square bg-muted block"
              >
                {photo.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.url}
                    alt="Photo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <ImageOff className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <User className="h-3 w-3 text-white shrink-0" />
                  <span className="text-white text-xs truncate">{photo.user.email}</span>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + BATCH_SIZE)}>
                Charger plus
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
