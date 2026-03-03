"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, password_confirmation: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("blog_user")
    const storedToken = localStorage.getItem("blog_token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Identifiants invalides")
    }

    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("blog_user", JSON.stringify(data.user))
    localStorage.setItem("blog_token", data.token)

    router.push("/articles")
    router.refresh()
  }, [router])

  const signup = useCallback(async (email: string, password: string, password_confirmation: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, password_confirmation }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error((err.errors || [err.error || "Erreur"]).join(", "))
    }

    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("blog_user", JSON.stringify(data.user))
    localStorage.setItem("blog_token", data.token)

    router.push("/articles")
    router.refresh()
  }, [router])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "DELETE" })
    setUser(null)
    setToken(null)
    localStorage.removeItem("blog_user")
    localStorage.removeItem("blog_token")
    router.push("/login")
    router.refresh()
  }, [router])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider")
  return ctx
}
