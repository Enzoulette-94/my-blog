import { NextRequest, NextResponse } from "next/server"
import { authApi } from "@/lib/api"

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  if (token) {
    await authApi.logout(token).catch(() => {})
  }

  const res = NextResponse.json({ message: "Déconnecté" }, { status: 200 })
  res.cookies.delete("token")
  return res
}
