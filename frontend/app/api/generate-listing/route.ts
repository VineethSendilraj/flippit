import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface GenerateListingRequest {
  queryText: string
  msrpPrice: number | null
  platform: "ebay" | "facebook" | "craigslist"
}

function getOpenAiKey(): string {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("Missing OPENAI_API_KEY")
  return key
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateListingRequest>
    const queryText = typeof body.queryText === "string" ? body.queryText.trim() : ""
    const msrpPrice = typeof body.msrpPrice === "number" ? body.msrpPrice : null
    const platform = body.platform || "ebay"

    if (!queryText) return NextResponse.json({ error: "queryText is required" }, { status: 400 })

    const prompt = `Create an optimized marketplace listing for ${platform}.
Product: ${queryText}
Suggested price: ${msrpPrice ?? "unknown"}
Return strictly JSON with fields: title (concise, SEO-friendly), description (persuasive 3-5 bullet paragraphs, include condition, authenticity, what's included, shipping/meetup guidance). No markdown, no extra keys.`

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getOpenAiKey()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You generate high-converting marketplace listings. Respond with strict JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 600,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: `OpenAI error ${resp.status}`, details: text }, { status: 502 })
    }

    const data = await resp.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: "No content" }, { status: 502 })

    let parsed: { title?: string; description?: string }
    try {
      parsed = JSON.parse(content)
    } catch {
      const cleaned = String(content).replace(/```json\s*/g, "").replace(/```/g, "").trim()
      parsed = JSON.parse(cleaned)
    }

    return NextResponse.json({
      title: parsed.title || queryText,
      description: parsed.description || "",
      suggestedPrice: msrpPrice,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


