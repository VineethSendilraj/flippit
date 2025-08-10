"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FlippitSearchBar from "./flippit-search-bar"

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
      <FlippitSearchBar onSearch={handleSearch} onSubmit={handleSubmit} />
    </div>
  )
}

export default FlippitSearchTable
