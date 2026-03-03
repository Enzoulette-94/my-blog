const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string
  isFormData?: boolean
}

async function request<T>(
  path: string,
  { method = "GET", body, token, isFormData = false }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (!isFormData && body) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw { status: res.status, ...err }
  }

  if (res.status === 204) return {} as T

  return res.json()
}

// Variante qui retourne aussi les headers (pour récupérer le JWT)
async function requestWithHeaders(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: unknown; headers: Headers }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "POST",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw { status: res.status, ...err }
  }

  const data = await res.json()
  return { data, headers: res.headers }
}

// Auth (appelé depuis les Route Handlers BFF, pas directement côté client)
export const authApi = {
  signup: (body: { user: { email: string; password: string; password_confirmation: string } }) =>
    requestWithHeaders("/signup", { method: "POST", body }),

  login: (body: { user: { email: string; password: string } }) =>
    requestWithHeaders("/login", { method: "POST", body }),

  logout: (token: string) =>
    request("/logout", { method: "DELETE", token }),
}

// Articles
export const articlesApi = {
  list: (token?: string) =>
    request<import("./types").Article[]>("/articles", { token }),

  get: (id: number, token?: string) =>
    request<import("./types").Article>(`/articles/${id}`, { token }),

  create: (body: { article: { title: string; content: string; private: boolean } }, token: string) =>
    request<import("./types").Article>("/articles", { method: "POST", body, token }),

  update: (id: number, body: { article: { title: string; content: string; private: boolean } }, token: string) =>
    request<import("./types").Article>(`/articles/${id}`, { method: "PATCH", body, token }),

  delete: (id: number, token: string) =>
    request(`/articles/${id}`, { method: "DELETE", token }),
}

// Comments
export const commentsApi = {
  list: (articleId: number) =>
    request<import("./types").Comment[]>(`/articles/${articleId}/comments`),

  create: (articleId: number, body: { comment: { content: string } }, token: string) =>
    request<import("./types").Comment>(`/articles/${articleId}/comments`, { method: "POST", body, token }),

  delete: (articleId: number, commentId: number, token: string) =>
    request(`/articles/${articleId}/comments/${commentId}`, { method: "DELETE", token }),
}

// Photos
export const photosApi = {
  list: (token: string) =>
    request<import("./types").Photo[]>("/photos", { token }),

  publicList: () =>
    request<import("./types").PublicPhoto[]>("/photos/public"),

  get: (id: number) =>
    request<import("./types").PublicPhoto>(`/photos/${id}`),

  create: (formData: FormData, token: string) =>
    request<import("./types").Photo>("/photos", { method: "POST", body: formData, token, isFormData: true }),

  delete: (id: number, token: string) =>
    request(`/photos/${id}`, { method: "DELETE", token }),
}
