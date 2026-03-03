import { NextRequest, NextResponse } from "next/server"
import { authApi } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, headers } = await authApi.signup({ user: body })

    const token = headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 500 })
    }

    const res = NextResponse.json({ ...(data as object), token }, { status: 201 })
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })
    return res
  } catch (err: unknown) {
    const e = err as { status?: number; errors?: string[]; error?: string }
    return NextResponse.json(
      { errors: e.errors || [e.error || "Erreur lors de l'inscription"] },
      { status: e.status || 422 }
    )
  }
}
