import { createClient } from "@supabase/supabase-js"
import type { RetailerData } from "@/types/retailer"

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  if (!url) {
    // Return a placeholder URL for build time
    return "https://xpuwkidotxibgucnsxmg.supabase.co"
  }
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!key) {
    // Return a placeholder key for build time
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdXdraWRvdHhpYmd1Y25zeG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NTgsImV4cCI6MjA2NDI0MDQ1OH0.NQuMB5qENF6MX4yQotQlKprEKGiEnwF8QTK2AFaVspE"
  }
  return key
}

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey())

export async function saveArbitrageData(searchId: string, retailers: RetailerData[]): Promise<void> {
  try {
    // Extract query and location from searchId or use defaults
    const timestamp = searchId.split("_")[1] || Date.now().toString()
    const query = "luxury jewelry and watches" // Default query
    const location = "new-york-city" // Default location

    // First, create a search session record
    const searchRecord = {
      id: searchId,
      created_at: new Date().toISOString(),
      query: query,
      location: location,
    }

    // Try to insert the search record, but don't fail if table doesn't exist
    try {
      const { error: searchError } = await supabase.from("arbitrage_searches").insert([searchRecord])

      if (searchError) {
        console.warn("Could not insert search record (table may not exist):", searchError.message)
      }
    } catch (searchErr) {
      console.warn("Search table may not exist, continuing with retailers...")
    }

    // Then, insert all retailers
    const retailersToInsert = retailers.map((retailer, index) => ({
      id: `${searchId}_retailer_${index}`,
      search_id: searchId,
      name: retailer.name,
      phone_number: retailer.phoneNumber,
      address: retailer.address,
      specialization: retailer.specialization,
      has_been_called: false,
      call_transcript: "",
      call_audio_url: "",
      call_summary: "",
      lowest_price_offered: null,
      created_at: new Date().toISOString(),
    }))

    // Try to insert retailers, but don't fail if table doesn't exist
    try {
      const { error: retailersError } = await supabase.from("retailers").insert(retailersToInsert)

      if (retailersError) {
        console.warn("Could not insert retailers (table may not exist):", retailersError.message)
      }
    } catch (retailersErr) {
      console.warn("Retailers table may not exist, using local storage fallback...")
      // Store in localStorage as fallback
      localStorage.setItem(
        `arbitrage_${searchId}`,
        JSON.stringify({
          search: searchRecord,
          retailers: retailersToInsert,
        }),
      )
    }
  } catch (error) {
    console.error("Error saving data to Supabase:", error)
    // Don't throw error, just log it and continue
    console.warn("Continuing with local storage fallback...")

    // Store in localStorage as fallback
    try {
      const query = "luxury jewelry and watches" // Default query
      const location = "new-york-city" // Default location
      localStorage.setItem(
        `arbitrage_${searchId}`,
        JSON.stringify({
          search: { id: searchId, query, location, created_at: new Date().toISOString() },
          retailers: retailers.map((retailer, index) => ({
            id: `${searchId}_retailer_${index}`,
            search_id: searchId,
            name: retailer.name,
            phone_number: retailer.phoneNumber,
            address: retailer.address,
            specialization: retailer.specialization,
            has_been_called: false,
            call_transcript: "",
            call_audio_url: "",
            call_summary: "",
            lowest_price_offered: null,
          })),
        }),
      )
    } catch (localStorageError) {
      console.error("Could not save to localStorage either:", localStorageError)
    }
  }
}

export async function getArbitrageSearches(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("arbitrage_queries")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Could not fetch from Supabase, using localStorage:", error.message)
      return getLocalStorageSearches()
    }

    return data || []
  } catch (error) {
    console.warn("Supabase not available, using localStorage:", error)
    return getLocalStorageSearches()
  }
}

export async function getRetailersBySearchId(queryId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("arbitrage_companies").select("*").eq("query_id", queryId)

    if (error) {
      console.warn("Could not fetch companies from Supabase, using localStorage:", error.message)
      return getLocalStorageRetailers(queryId)
    }

    return data || []
  } catch (error) {
    console.warn("Supabase not available, using localStorage:", error)
    return getLocalStorageRetailers(queryId)
  }
}

export async function updateRetailer(
  id: string,
  updates: Partial<{
    has_been_called: boolean
    call_transcript: string
    call_audio_url: string
    call_summary: string
    lowest_price_offered: number | null
  }>,
): Promise<void> {
  try {
    const { error } = await supabase.from("retailers").update(updates).eq("id", id)

    if (error) {
      console.warn("Could not update retailer in Supabase, updating localStorage:", error.message)
      updateLocalStorageRetailer(id, updates)
    }
  } catch (error) {
    console.warn("Supabase not available, updating localStorage:", error)
    updateLocalStorageRetailer(id, updates)
  }
}

// LocalStorage fallback functions
function getLocalStorageSearches(): any[] {
  try {
    const searches = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("arbitrage_")) {
        const data = JSON.parse(localStorage.getItem(key) || "{}")
        if (data.search) {
          searches.push(data.search)
        }
      }
    }
    return searches.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return []
  }
}

function getLocalStorageRetailers(searchId: string): any[] {
  try {
    const data = localStorage.getItem(`arbitrage_${searchId}`)
    if (data) {
      const parsed = JSON.parse(data)
      return parsed.retailers || []
    }
    return []
  } catch (error) {
    console.error("Error reading retailers from localStorage:", error)
    return []
  }
}

function updateLocalStorageRetailer(id: string, updates: any): void {
  try {
    // Find which search this retailer belongs to
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("arbitrage_")) {
        const data = JSON.parse(localStorage.getItem(key) || "{}")
        if (data.retailers) {
          const retailerIndex = data.retailers.findIndex((r: any) => r.id === id)
          if (retailerIndex !== -1) {
            data.retailers[retailerIndex] = { ...data.retailers[retailerIndex], ...updates }
            localStorage.setItem(key, JSON.stringify(data))
            break
          }
        }
      }
    }
  } catch (error) {
    console.error("Error updating retailer in localStorage:", error)
  }
}

export async function saveArbitrageDataWithMsrp(queryText: string, location: string, msrpPrice: number | null, companies: { name: string; phoneNumber: string; location: string }[]): Promise<string | null> {
  try {
    // Insert into arbitrage_queries and get the primary key (id)
    const { data: queryData, error: queryError } = await supabase
      .from("arbitrage_queries")
      .insert([
        {
          query_text: queryText,
          location: location,
          msrp_price: msrpPrice,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single()

    if (queryError || !queryData) {
      console.error("Error inserting into arbitrage_queries:", queryError)
      return null
    }
    const queryId = queryData.id

    // Add Agnihotri Jewelers as a test dummy
    const agnihotri = {
      name: "Agnihotri Jewelers",
      phoneNumber: "4698805468",
      location: "387 Park Avenue South New York, New York",
    }
    const allCompanies = [agnihotri, ...companies]

    // Insert all companies into arbitrage_companies
    const companiesToInsert = allCompanies.map((company) => ({
      name: company.name,
      phone_number: company.phoneNumber,
      location: company.location,
      has_been_called: false,
      call_transcript: "",
      call_audio_recording: "",
      call_summary: "",
      price_offered: null,
      query_id: queryId,
      created_at: new Date().toISOString(),
    }))
    const { error: companiesError } = await supabase.from("arbitrage_companies").insert(companiesToInsert)
    if (companiesError) {
      console.error("Error inserting into arbitrage_companies:", companiesError)
    }
    return queryId
  } catch (error) {
    console.error("Error saving arbitrage data:", error)
    return null
  }
}
