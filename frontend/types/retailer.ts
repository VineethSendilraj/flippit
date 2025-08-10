export interface RetailerData {
  name: string
  phoneNumber: string
  address: string
  specialization: string
  hasBeenCalled: boolean
  callTranscript: string
  callAudioUrl: string
  callSummary: string
  lowestPriceOffered: number | null
}

export interface ArbitrageSearch {
  id: string
  created_at: string
  query: string
  location: string
}

// Row shape used across dashboard UI from table `arbitrage_companies`/`retailers`
export interface Retailer {
  id: string
  name: string
  phone_number: string
  location: string
  has_been_called: boolean
  call_transcript: string
  call_audio_url?: string
  call_summary: string
  lowest_price_offered: number | null
}
