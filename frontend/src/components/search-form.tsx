"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LOCATIONS = [
  { label: "New York City", value: "new-york-city" },
  { label: "Los Angeles", value: "los-angeles" },
  { label: "Chicago", value: "chicago" },
  { label: "Miami", value: "miami" },
  { label: "San Francisco", value: "san-francisco" },
]

const SEARCH_SUGGESTIONS = [
  { label: "Luxury jewelry and watches", value: "luxury-jewelry-watches" },
  { label: "High-end diamond rings", value: "high-end-diamond-rings" },
  { label: "Luxury watch dealers", value: "luxury-watch-dealers" },
  { label: "Premium gold jewelry", value: "premium-gold-jewelry" },
  { label: "Designer watches", value: "designer-watches" },
]

export function SearchForm() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query || !location) return

    setIsLoading(true)

    try {
      // Create a new search session in Supabase
      const searchId = await createSearchSession(query, location)

      // Redirect to the loading page
      router.push(`/loading?id=${searchId}&query=${encodeURIComponent(query)}&location=${location}`)
    } catch (error) {
      console.error("Error creating search session:", error)
      setIsLoading(false)
    }
  }

  const createSearchSession = async (query: string, location: string) => {
    // Create a more descriptive search ID
    const timestamp = Date.now()
    const querySlug = query
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 20)
    return `search_${querySlug}_${timestamp}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="What are we arbitraging next?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!query || !location || isLoading}>
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Find Arbitrage Opportunities
          </>
        )}
      </Button>
    </form>
  )
}
