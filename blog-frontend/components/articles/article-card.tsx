import Link from "next/link"
import { Article } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

interface ArticleCardProps {
  article: Article
  currentUserEmail?: string
}

export function ArticleCard({ article, currentUserEmail }: ArticleCardProps) {
  const isOwner = article.author === currentUserEmail

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="hover:shadow-md transition-shadow h-full cursor-pointer flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold line-clamp-2 leading-snug">
              {article.title}
            </CardTitle>
            {article.private && (
              <Badge variant="secondary" className="shrink-0 gap-1">
                <Lock className="h-3 w-3" />
                Privé
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-1">
          {article.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between">
          <span>{article.author}{isOwner && " (moi)"}</span>
          <span>{new Date(article.created_at).toLocaleDateString("fr-FR")}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
