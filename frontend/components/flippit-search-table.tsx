"use client"

import { useState, useMemo } from "react"
import FlippitSearchBar from "./flippit-search-bar"
import FlippitOpportunityCard from "./flippit-opportunity-card"
import { opportunities } from "@/data/opportunities"
import { Grid, List } from "lucide-react"

interface SearchFilters {
  query: string
  region: string
  minBudget: number
  maxBudget: number
}

const FlippitSearchTable = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    region: "all",
    minBudget: 0,
    maxBudget: 100000
  })
  const [view, setView] = useState<'list' | 'grid'>('grid')

  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities

    // Filter by search query (name, brand, description, tags)
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase().trim()
      filtered = filtered.filter(opportunity => 
        opportunity.name.toLowerCase().includes(query) ||
        opportunity.brand.toLowerCase().includes(query) ||
        opportunity.description.toLowerCase().includes(query) ||
        opportunity.marketplace.toLowerCase().includes(query) ||
        opportunity.tags.some(tag => 
          tag.name.toLowerCase().includes(query)
        )
      )
    }

    // Filter by budget range
    filtered = filtered.filter(opportunity => {
      const currentPrice = parseFloat(opportunity.currentPrice.replace(/[$,]/g, ''))
      return currentPrice >= filters.minBudget && currentPrice <= filters.maxBudget
    })

    // Filter by region
    if (filters.region !== "all") {
      filtered = filtered.filter(opportunity => opportunity.region === filters.region)
    }

    return filtered
  }, [filters])

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="w-full space-y-8">
      {/* Search Bar */}
      <FlippitSearchBar onSearch={handleSearch} />

      {/* View Toggle - Right Aligned */}
      <div className="flex justify-end">
        <div className="inline-flex items-center bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-1">
          <button
            onClick={() => setView('grid')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              view === 'grid'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Grid className="w-4 h-4 mr-1.5" />
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              view === 'list'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <List className="w-4 h-4 mr-1.5" />
            List
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filters.query || filters.region !== "all" || filters.minBudget > 0 || filters.maxBudget < 100000 ? (
          <>
            Showing {filteredOpportunities.length} opportunities
            {filters.query && <> for "{filters.query}"</>}
            {filters.region !== "all" && <> in {filters.region}</>}
            {(filters.minBudget > 0 || filters.maxBudget < 100000) && (
              <> within budget ${filters.minBudget.toLocaleString()} - ${filters.maxBudget.toLocaleString()}</>
            )}
          </>
        ) : (
          <>Showing {filteredOpportunities.length} opportunities</>
        )}
      </div>

      {/* Opportunities */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No opportunities found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search terms or browse all categories</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <FlippitOpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-4">
                <img 
                  src={opportunity.image} 
                  alt={opportunity.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {opportunity.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{opportunity.brand}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm truncate mt-1">
                    {opportunity.description}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Current</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{opportunity.currentPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Target</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{opportunity.targetPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Profit</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{opportunity.profit}</p>
                  </div>
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    +{opportunity.profitMargin}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FlippitSearchTable
