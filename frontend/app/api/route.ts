import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface CreateListingRequestBody {
  title: string
  description: string
  price: number
  photoUrl: string
  conditionId?: number
}

interface CreateListingSuccessResponse {
  itemId: string
  url: string
}

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function isHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === "https:"
  } catch {
    return false
  }
}

function truncate(input: string, max: number): string {
  return input.length > max ? input.slice(0, max) : input
}

async function getAccessToken(env: "sandbox" | "production"): Promise<string> {
  const clientId = assertEnv("EBAY_CLIENT_ID", process.env.EBAY_CLIENT_ID)
  const clientSecret = assertEnv("EBAY_CLIENT_SECRET", process.env.EBAY_CLIENT_SECRET)
  const refreshToken = assertEnv("EBAY_REFRESH_TOKEN", process.env.EBAY_REFRESH_TOKEN)

  const base = env === "sandbox" ? "https://api.sandbox.ebay.com" : "https://api.ebay.com"
  const tokenUrl = `${base}/identity/v1/oauth2/token`

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope: "https://api.ebay.com/oauth/api_scope",
  })

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to obtain eBay access token: ${res.status} ${res.statusText} - ${text}`)
  }

  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) {
    throw new Error("eBay token response missing access_token")
  }
  return data.access_token
}

function buildAddFixedPriceItemXml(params: {
  title: string
  description: string
  price: number
  photoUrl: string
  conditionId: number
}): string {
  const safeTitle = truncate(params.title, 80)
  const descriptionCdata = `<![CDATA[${params.description}]]>`

  return `<?xml version="1.0" encoding="utf-8"?>
<AddFixedPriceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <Item>
    <Title>${safeTitle}</Title>
    <Description>${descriptionCdata}</Description>
    <PrimaryCategory>
      <CategoryID>31387</CategoryID>
    </PrimaryCategory>
    <StartPrice currencyID="USD">${params.price.toFixed(2)}</StartPrice>
    <CategoryMappingAllowed>true</CategoryMappingAllowed>
    <ConditionID>${params.conditionId}</ConditionID>
    <Country>US</Country>
    <Currency>USD</Currency>
    <DispatchTimeMax>3</DispatchTimeMax>
    <ListingDuration>GTC</ListingDuration>
    <ListingType>FixedPriceItem</ListingType>
    <PictureDetails>
      <PictureURL>${params.photoUrl}</PictureURL>
    </PictureDetails>
    <PostalCode>95125</PostalCode>
    <Quantity>1</Quantity>
    <ShipToLocations>US</ShipToLocations>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSPriority</ShippingService>
        <ShippingServiceCost currencyID="USD">25.00</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <Site>US</Site>
  </Item>
</AddFixedPriceItemRequest>`
}

function parseXmlValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, "i")
  const match = xml.match(regex)
  return match ? match[1] : null
}

function extractFirstError(xml: string): string | null {
  const ack = parseXmlValue(xml, "Ack")
  if (ack && ack.toLowerCase() === "success") return null
  const longMsg = parseXmlValue(xml, "LongMessage")
  if (longMsg) return longMsg
  const shortMsg = parseXmlValue(xml, "ShortMessage")
  if (shortMsg) return shortMsg
  return null
}

export async function POST(request: Request) {
  try {
    const env = (process.env.EBAY_ENV || "sandbox").toLowerCase() === "sandbox" ? "sandbox" : "production"
    const body = (await request.json()) as Partial<CreateListingRequestBody>

    if (!body) {
      return NextResponse.json({ error: "Missing request body" }, { status: 400 })
    }

    const title = typeof body.title === "string" ? body.title.trim() : ""
    const description = typeof body.description === "string" ? body.description.trim() : ""
    const price = typeof body.price === "number" ? body.price : Number.NaN
    const photoUrl = typeof body.photoUrl === "string" ? body.photoUrl.trim() : ""
    const conditionId = typeof body.conditionId === "number" && Number.isFinite(body.conditionId) ? body.conditionId : 3000

    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 })
    if (truncate(title, 80) !== title) return NextResponse.json({ error: "title must be ≤ 80 characters" }, { status: 400 })
    if (!description) return NextResponse.json({ error: "description is required" }, { status: 400 })
    if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "price must be a positive number" }, { status: 400 })
    if (!photoUrl || !isHttpsUrl(photoUrl)) return NextResponse.json({ error: "photoUrl must be a valid public HTTPS URL" }, { status: 400 })

    const accessToken = await getAccessToken(env)

    const xml = buildAddFixedPriceItemXml({
      title,
      description,
      price,
      photoUrl,
      conditionId,
    })

    const tradingBase = env === "sandbox" ? "https://api.sandbox.ebay.com" : "https://api.ebay.com"
    const res = await fetch(`${tradingBase}/ws/api.dll`, {
      method: "POST",
      headers: {
        "X-EBAY-API-CALL-NAME": "AddFixedPriceItem",
        "X-EBAY-API-SITEID": "0",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "1237",
        "X-EBAY-API-IAF-TOKEN": accessToken,
        "Content-Type": "text/xml",
      },
      body: xml,
    })

    const responseText = await res.text()
    if (!res.ok) {
      return NextResponse.json(
        { error: `eBay Trading API error: ${res.status} ${res.statusText}`, details: responseText },
        { status: 502 },
      )
    }

    const itemId = parseXmlValue(responseText, "ItemID")
    const errorMsg = extractFirstError(responseText)
    if (!itemId || errorMsg) {
      return NextResponse.json(
        { error: errorMsg || "Failed to create listing", details: responseText },
        { status: 502 },
      )
    }

    const url = `https://sandbox.ebay.com/itm/${itemId}`
    const payload: CreateListingSuccessResponse = { itemId, url }
    return NextResponse.json(payload, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}



