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
