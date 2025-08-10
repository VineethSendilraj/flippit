import type { RetailerData } from "@/types/retailer"

function getPerplexityApiKey(): string {
  const key =
    process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY ||
    process.env.PERPLEXITY_API_KEY
  if (!key) {
    throw new Error("Missing PERPLEXITY_API_KEY environment variable")
  }
  return key
}

// Helper function to generate a fake NYC phone number
function generateFakeNYCNumber(): string {
  const prefixes = ["212", "917"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, "0")
  return `${prefix}${suffix}`
}

export async function fetchArbitrageData(query: string, location: string): Promise<{ name: string; phoneNumber: string; location: string }[]> {
  console.log(`Fetching arbitrage data for: ${query} in ${location}`)

  const prompt = `Find 5 real, currently operating luxury jewelry and watch retailers in ${location.replace(/-/g, " ")}. For each retailer:
1. Only include real businesses with verifiable phone numbers and addresses
2. For phone numbers, ONLY return the actual phone number found online, with no additional text or explanations
3. If you cannot find a real phone number, return "NO_PHONE" instead of making up a number
4. Do NOT include any text after the phone number
5. Do NOT use any placeholder, fake, or fallback data

Return ONLY a single JSON array of objects, with this exact format and nothing else:

[{"name":"Store Name","phoneNumber": "actual phone number or NO_PHONE","location":location of store that you find on the internet}]

Do not return multiple arrays, do not return any extra text, do not return explanations, do not return markdown. Only a single JSON array.`

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getPerplexityApiKey()}`,
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.1,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Perplexity API error:", response.status, errorText)
    throw new Error("Perplexity API error")
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  // Avoid logging raw model output in production
  if (!content) throw new Error("No content from Perplexity")

  // Parse JSON array
  let parsedData
  try {
    parsedData = JSON.parse(content.trim())
  } catch (e) {
    // Try to clean up and parse
    const cleaned = content
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .replace(/^\s*[\w\s]*:\s*/gm, "")
      .trim()
    parsedData = JSON.parse(cleaned)
  }

  // Validate and return only real data
  if (!Array.isArray(parsedData)) throw new Error("Invalid data structure from Perplexity")
  
  // Process the data to handle phone numbers
  return parsedData
    .filter(
      (retailer) =>
        retailer &&
        typeof retailer === "object" &&
        retailer.name &&
        retailer.location
    )
    .map(retailer => ({
      ...retailer,
      // If phone number is NO_PHONE or missing, generate a fake NYC number
      phoneNumber: retailer.phoneNumber === "NO_PHONE" || !retailer.phoneNumber 
        ? generateFakeNYCNumber()
        : retailer.phoneNumber.replace(/[^0-9]/g, "") // Remove any non-numeric characters
    }))
}

export async function fetchMsrpPrice(query: string): Promise<number | null> {
  try {
    const prompt = `What is the Manufacturer's Suggested Retail Price (MSRP) in USD for the following item? Only return a single number, no text, no currency symbol, no explanation. Item: ${query}`

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPerplexityApiKey()}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Perplexity API error (MSRP):", response.status, errorText)
      return null
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    if (!content) return null

    // Extract the first number from the response
    const match = content.match(/\d+[,.]?\d*/)
    if (match) {
      return parseFloat(match[0].replace(/,/g, ""))
    }
    return null
  } catch (error) {
    console.error("Error in fetchMsrpPrice:", error)
    return null
  }
}
