"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import FlippitSearchBar from "./flippit-search-bar"
import { Button } from "@/components/ui/button"

interface SearchFilters {
  query: string
  region: string
  minBudget: number
  maxBudget: number
}

const FlippitSearchTable = () => {
  const router = useRouter()
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: "",
    region: "all",
    minBudget: 0,
    maxBudget: 100000
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (newFilters: SearchFilters) => {
    setCurrentFilters(newFilters)
    console.log("Search filters:", newFilters)
  }

  const handleSubmit = async () => {
    if (!currentFilters.query.trim()) return

    setIsLoading(true)

    try {
      // Create a search session ID
      const timestamp = Date.now()
      const querySlug = currentFilters.query
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .substring(0, 20)
      const searchId = `search_${querySlug}_${timestamp}`

      // Map region to location format
      const locationMap: { [key: string]: string } = {
        "all": "new-york-city",
        "ny": "new-york-city", 
        "ca": "los-angeles",
        "fl": "miami",
        "tx": "houston",
        "il": "chicago"
      }
      const location = locationMap[currentFilters.region] || "new-york-city"

      // Redirect to the loading page
      router.push(`/loading?id=${searchId}&query=${encodeURIComponent(currentFilters.query)}&location=${location}`)
    } catch (error) {
      console.error("Error creating search session:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <FlippitSearchBar onSearch={handleSearch} />
      
      {/* Search Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={!currentFilters.query.trim() || isLoading}
          className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Find Arbitrage Opportunities
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default FlippitSearchTable
