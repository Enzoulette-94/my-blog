"use client"

import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { photosApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

export function PhotoUpload() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const uploadMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData()
      formData.append("image", file!)
      return photosApi.create(formData, token!)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] })
      setPreview(null)
      setFile(null)
      toast.success("Photo uploadée !")
    },
    onError: () => toast.error("Erreur lors de l'upload"),
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function handleCancel() {
    setPreview(null)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Aperçu" className="max-h-64 rounded-lg object-contain border" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 bg-background/80"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cliquez pour sélectionner une image</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {file && (
        <div className="flex gap-2">
          <Button onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? "Upload..." : "Uploader"}
          </Button>
          <Button variant="ghost" onClick={handleCancel}>Annuler</Button>
        </div>
      )}
    </div>
  )
}
