import Link from "next/link"
import { Article } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LatestArticlesProps {
  articles: Article[]
}

export function LatestArticles({ articles }: LatestArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="max-w-3xl mx-auto mt-16">
      <h2 className="text-xl font-semibold mb-6 text-center">Derniers articles</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`} className="group">
            <Card className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold line-clamp-2 leading-snug">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{article.author}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(article.created_at).toLocaleDateString("fr-FR")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
