import Link from "next/link"
import { ArrowRight, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getStats, getLatestArticles } from "@/lib/api-server"

export default async function HomePage() {
  const [stats, articles] = await Promise.all([
    getStats(),
    getLatestArticles(6),
  ])

  const featured = articles[0]
  const rest = articles.slice(1, 5)

  return (
    <div className="w-full py-10">

      {/* En-tête */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-1">EnzouletteBlog</h1>
        <p className="text-muted-foreground text-sm">Football, passion &amp; culture</p>
        <div className="mt-4 border-t-4 border-secondary" />
      </div>

      {/* Stats discrètes */}
      <div className="flex gap-6 text-xs text-muted-foreground mb-10">
        <span><strong className="text-foreground">{stats.articles_count}</strong> articles</span>
        <span><strong className="text-foreground">{stats.photos_count}</strong> photos</span>
        <span><strong className="text-foreground">{stats.users_count}</strong> membres</span>
        <Link href="/photos" className="ml-auto flex items-center gap-1 hover:text-primary transition-colors">
          <Camera className="h-3 w-3" />
          Galerie photos
        </Link>
      </div>

      {/* À la une */}
      {featured && (
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">À la une</span>
          <Link href={`/articles/${featured.id}`} className="group block mt-2">
            <h2 className="text-2xl font-bold leading-snug group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-2">
              {featured.author} · {new Date(featured.created_at).toLocaleDateString("fr-FR")}
            </p>
          </Link>
        </div>
      )}

      {/* Séparateur */}
      <div className="border-t mb-8" />

      {/* Liste des derniers articles */}
      <div className="space-y-5">
        {rest.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="group flex items-start justify-between gap-4"
          >
            <div>
              <p className="font-semibold leading-snug group-hover:text-primary transition-colors">
                {article.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {article.author} · {new Date(article.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 mt-1 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 border-t pt-8">
        <Button asChild variant="outline" className="w-full">
          <Link href="/articles">Voir tous les articles</Link>
        </Button>
      </div>

    </div>
  )
}
