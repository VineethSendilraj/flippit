import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const error = req.nextUrl.searchParams.get("error")
  return new Response(JSON.stringify({ code, error }, null, 2), {
    headers: { "Content-Type": "application/json" },
  })
}


