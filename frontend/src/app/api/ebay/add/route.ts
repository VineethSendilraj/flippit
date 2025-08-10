import type { NextRequest } from "next/server"

// OAuth + Trading endpoints (Sandbox)
const OAUTH = "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
const TRADING = "https://api.sandbox.ebay.com/ws/api.dll"

// tiny in-memory token cache
let token: { val: string; exp: number } | null = null

async function getAccessToken(): Promise<string> {
  if (token && Date.now() < token.exp - 60_000) return token.val

  const clientId = process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET
  const refreshToken = process.env.EBAY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing eBay OAuth environment variables")
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope: "https://api.ebay.com/oauth/api_scope",
  })

  const r = await fetch(OAUTH, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  const j = await r.json()
  if (!r.ok) throw new Error("OAuth failed: " + JSON.stringify(j))
  token = { val: j.access_token as string, exp: Date.now() + Number(j.expires_in) * 1000 }
  return token.val
}

export async function POST(req: NextRequest): Promise<Response> {
  const { title, description, price, photoUrl } = await req.json()

  // basic guards
  if (!title || !description || !price || !photoUrl) {
    return new Response(JSON.stringify({ ok: false, error: "Missing title/description/price/photoUrl" }), { status: 400 })
  }
  if (String(title).length > 80) {
    return new Response(JSON.stringify({ ok: false, error: "Title must be ≤ 80 characters" }), { status: 400 })
  }
  if (!/^https:\/\/.+/i.test(String(photoUrl))) {
    return new Response(JSON.stringify({ ok: false, error: "Photo URL must be public HTTPS" }), { status: 400 })
  }

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<AddFixedPriceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <Item>
    <Title>${String(title).slice(0, 80)}</Title>
    <Description><![CDATA[${String(description)}]]></Description>
    <PrimaryCategory><CategoryID>31387</CategoryID></PrimaryCategory>
    <StartPrice currencyID="USD">${Number(price).toFixed(2)}</StartPrice>
    <Country>US</Country>
    <Currency>USD</Currency>
    <DispatchTimeMax>3</DispatchTimeMax>
    <ListingDuration>GTC</ListingDuration>
    <ListingType>FixedPriceItem</ListingType>
    <Location>San Francisco, CA</Location>
    <Quantity>1</Quantity>
    <ConditionID>3000</ConditionID>
    <PictureDetails><PictureURL>${String(photoUrl)}</PictureURL></PictureDetails>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSPriority</ShippingService>
        <ShippingServiceCost currencyID="USD">25.00</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <ReturnPolicy>
      <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
      <ReturnsWithinOption>Days_14</ReturnsWithinOption>
      <RefundOption>MoneyBack</RefundOption>
      <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
    </ReturnPolicy>
    <Site>US</Site>
  </Item>
</AddFixedPriceItemRequest>`

  try {
    const access = await getAccessToken()

    const res = await fetch(TRADING, {
      method: "POST",
      headers: {
        "X-EBAY-API-CALL-NAME": "AddFixedPriceItem",
        "X-EBAY-API-SITEID": "0",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "X-EBAY-API-IAF-TOKEN": access,
        "Content-Type": "text/xml",
      },
      body: xml,
    })

    const text = await res.text()

    if (!res.ok || text.includes("<Ack>Failure</Ack>")) {
      return new Response(JSON.stringify({ ok: false, raw: text }), { status: 400 })
    }

    const itemId = (text.match(/<ItemID>(\d+)<\/ItemID>/) || [])[1]
    const url = itemId ? `https://sandbox.ebay.com/itm/${itemId}` : null

    return new Response(JSON.stringify({ ok: true, itemId, url }), { status: 200 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 })
  }
}


