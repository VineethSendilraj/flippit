function getOpenAiApiKey(): string {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY environment variable")
  }
  return key
}

export async function summarizeCallTranscript(transcript: string): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getOpenAiApiKey()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that summarizes phone call transcripts for luxury jewelry and watch arbitrage. Focus on extracting key information like pricing, availability, and willingness to negotiate.",
          },
          {
            role: "user",
            content: `Please summarize the following call transcript concisely, focusing on pricing information, product availability, and any negotiation points:\n\n${transcript}`,
          },
        ],
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    throw error
  }
}
