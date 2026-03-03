import { HeroSection } from "@/components/home/HeroSection"
import { ExploreCards } from "@/components/home/ExploreCards"
import { LatestArticles } from "@/components/home/LatestArticles"
import { getStats, getLatestArticles } from "@/lib/api-server"

export default async function HomePage() {
  const [stats, latestArticles] = await Promise.all([
    getStats(),
    getLatestArticles(3),
  ])

  return (
    <div>
      <HeroSection />
      <ExploreCards stats={stats} />
      <LatestArticles articles={latestArticles} />
    </div>
  )
}
