import { NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  user_id: number
  exp: number
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json(null, { status: 200 })
  }

  try {
    const payload = jwtDecode<JwtPayload>(token)
    if (payload.exp * 1000 < Date.now()) {
      const res = NextResponse.json(null, { status: 200 })
      res.cookies.delete("token")
      return res
    }
    return NextResponse.json({ user_id: payload.user_id }, { status: 200 })
  } catch {
    return NextResponse.json(null, { status: 200 })
  }
}
