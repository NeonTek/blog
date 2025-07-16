// app/api/admin-login/route.ts

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 })
  }

  return NextResponse.json({ message: "Authenticated" }, { status: 200 })
}
