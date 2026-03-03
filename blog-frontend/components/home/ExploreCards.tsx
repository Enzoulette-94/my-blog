import Link from "next/link"
import { FileText, Camera, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stats } from "@/lib/api-server"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `il y a ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}

interface ExploreCardsProps {
  stats: Stats
}

export function ExploreCards({ stats }: ExploreCardsProps) {
  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link href="/articles" className="group">
          <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
            <CardHeader>
              <FileText className="h-10 w-10 mb-2 text-primary" />
              <CardTitle className="text-2xl">Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-3xl font-bold">{stats.articles_count}</p>
              <p className="text-muted-foreground text-sm">publications</p>
              {stats.latest_article && (
                <p className="text-xs text-muted-foreground pt-2">
                  Dernier : {timeAgo(stats.latest_article.created_at)}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="gap-1 px-0 group-hover:gap-2 transition-all">
                Explorer <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/photos" className="group">
          <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
            <CardHeader>
              <Camera className="h-10 w-10 mb-2 text-primary" />
              <CardTitle className="text-2xl">Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-3xl font-bold">{stats.photos_count}</p>
              <p className="text-muted-foreground text-sm">photos</p>
              {stats.latest_photo ? (
                <p className="text-xs text-muted-foreground pt-2">
                  Dernière : {timeAgo(stats.latest_photo.created_at)}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground pt-2">Aucune photo pour l&apos;instant</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="gap-1 px-0 group-hover:gap-2 transition-all">
                Explorer <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{stats.users_count} membres dans la communauté</span>
      </div>
    </div>
  )
}
