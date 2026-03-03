import { Article } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

export interface Stats {
  articles_count: number
  photos_count: number
  users_count: number
  latest_article: { id: number; title: string; created_at: string } | null
  latest_photo: { id: number; created_at: string } | null
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API_URL}/stats`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error("Failed to fetch stats")
  return res.json()
}

export async function getLatestArticles(count: number): Promise<Article[]> {
  const res = await fetch(`${API_URL}/articles`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error("Failed to fetch articles")
  const articles: Article[] = await res.json()
  return articles.slice(0, count)
}
