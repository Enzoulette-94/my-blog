"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { articlesApi } from "@/lib/api"
import { ArticleCard } from "@/components/articles/article-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PenSquare } from "lucide-react"

export default function ArticlesPage() {
  const { user, token } = useAuth()

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", token],
    queryFn: () => articlesApi.list(token || undefined),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        {user && (
          <Button asChild size="sm">
            <Link href="/articles/new">
              <PenSquare className="h-4 w-4 mr-1" />
              Écrire
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : articles?.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">Aucun article pour le moment.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} currentUserEmail={user?.email} />
          ))}
        </div>
      )}
    </div>
  )
}
