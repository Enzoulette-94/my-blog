export interface User {
  id: number
  email: string
}

export interface Article {
  id: number
  title: string
  content?: string
  private: boolean
  author: string
  created_at: string
}

export interface Comment {
  id: number
  content: string
  author: string
  created_at: string
}

export interface Photo {
  id: number
  url: string | null
  created_at: string
}

export interface PublicPhoto {
  id: number
  url: string | null
  created_at: string
  user: {
    id: number
    email: string
  }
}

export interface ApiError {
  error?: string
  errors?: string[]
}
