import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest) {
  const clientId = process.env.EBAY_CLIENT_ID
  const ruName = process.env.EBAY_RUNAME

  if (!clientId || !ruName) {
    return new Response(
      JSON.stringify({ error: "Missing EBAY_CLIENT_ID or EBAY_RUNAME" }, null, 2),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }

  const scope = encodeURIComponent("https://api.ebay.com/oauth/api_scope")
  const redirectUri = encodeURIComponent(ruName)
  const url = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(
    clientId,
  )}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=arbiai-demo`

  return Response.redirect(url, 302)
}


