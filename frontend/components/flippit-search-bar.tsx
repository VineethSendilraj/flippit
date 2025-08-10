"use client"

import { useState } from "react"
import { Search, X, MapPin, DollarSign, ChevronDown } from "lucide-react"

interface SearchFilters {
  query: string
  region: string
  minBudget: number
  maxBudget: number
}

interface FlippitSearchBarProps {
  onSearch: (filters: SearchFilters) => void
  placeholder?: string
}

const FlippitSearchBar = ({ onSearch, placeholder = "Search for luxury items, brands, opportunities..." }: FlippitSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTags, setSearchTags] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [minBudget, setMinBudget] = useState(0)
  const [maxBudget, setMaxBudget] = useState(100000)
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    updateFilters(value, searchTags, selectedRegion, minBudget, maxBudget)
  }

  const updateFilters = (query: string, tags: string[], region: string, min: number, max: number) => {
    const searchString = tags.length > 0 ? tags.join(" ") : query
    onSearch({
      query: searchString,
      region,
      minBudget: min,
      maxBudget: max
    })
  }

  const addSearchTag = (tag: string) => {
    if (!searchTags.includes(tag)) {
      const newTags = [...searchTags, tag]
      setSearchTags(newTags)
      updateFilters("", newTags, selectedRegion, minBudget, maxBudget)
    }
  }

  const removeSearchTag = (tagToRemove: string) => {
    const newTags = searchTags.filter(tag => tag !== tagToRemove)
    setSearchTags(newTags)
    updateFilters("", newTags, selectedRegion, minBudget, maxBudget)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchTags([])
    updateFilters("", [], selectedRegion, minBudget, maxBudget)
  }

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    setShowRegionDropdown(false)
    updateFilters(searchQuery, searchTags, region, minBudget, maxBudget)
  }

  const handleBudgetChange = (min: number, max: number) => {
    setMinBudget(min)
    setMaxBudget(max)
    updateFilters(searchQuery, searchTags, selectedRegion, min, max)
  }

  // Flippit-specific categories for luxury arbitrage
  const flippitCategories = [
    "Watches",
    "Jewelry", 
    "Handbags",
    "Sneakers",
    "Electronics",
    "Art & Collectibles",
    "Fashion",
    "Vintage",
    "Limited Edition",
    "Designer"
  ]

  // Regions for location-based search
  const regions = [
    { value: "all", label: "All Regions" },
    { value: "ny", label: "New York" },
    { value: "ca", label: "California" },
    { value: "fl", label: "Florida" },
    { value: "tx", label: "Texas" },
    { value: "il", label: "Illinois" },
    { value: "pa", label: "Pennsylvania" },
    { value: "oh", label: "Ohio" },
    { value: "ga", label: "Georgia" },
    { value: "nc", label: "North Carolina" },
    { value: "mi", label: "Michigan" }
  ]

  // Budget ranges
  const budgetRanges = [
    { min: 0, max: 500, label: "Under $500" },
    { min: 500, max: 1000, label: "$500 - $1,000" },
    { min: 1000, max: 5000, label: "$1,000 - $5,000" },
    { min: 5000, max: 10000, label: "$5,000 - $10,000" },
    { min: 10000, max: 25000, label: "$10,000 - $25,000" },
    { min: 25000, max: 50000, label: "$25,000 - $50,000" },
    { min: 50000, max: 100000, label: "$50,000 - $100,000" },
    { min: 100000, max: 999999, label: "$100,000+" }
  ]

  return (
    <>
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        
        .animated-border {
          background: 
            linear-gradient(white, white) padding-box,
            conic-gradient(from var(--angle), #3b82f620 0deg, #3b82f640 90deg, #3b82f6 180deg, #3b82f640 270deg, #3b82f620 360deg) border-box;
          animation: 6s rotate linear infinite;
        }
        
        .dark .animated-border {
          background: 
            linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
            conic-gradient(from var(--angle), #3b82f620 0deg, #3b82f640 90deg, #3b82f6 180deg, #3b82f640 270deg, #3b82f620 360deg) border-box;
        }
        
        @keyframes rotate {
          to {
            --angle: 360deg;
          }
        }
      `}</style>
      <div className="max-w-2xl mx-auto">
        {/* Search Input */}
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl border-2 border-transparent focus-within:border-transparent transition-colors duration-200 shadow-lg animated-border dark:shadow-slate-700/50">
          <div className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchTags.length > 0 ? "Add another search term..." : placeholder}
              className="flex-1 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  addSearchTag(searchQuery.trim())
                  setSearchQuery("")
                }
              }}
            />
            
            {(searchQuery || searchTags.length > 0) && (
              <button
                onClick={clearSearch}
                className="w-8 h-8 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400 dark:text-gray-300" />
              </button>
                      )}
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 px-4 pb-3 border-t border-gray-100 dark:border-slate-700 pt-3">
          {/* Region Filter */}
          <div className="relative">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {regions.find(r => r.value === selectedRegion)?.label || "All Regions"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showRegionDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {regions.map((region) => (
                    <button
                      key={region.value}
                      onClick={() => handleRegionChange(region.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 ${
                        selectedRegion === region.value 
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Budget Filter */}
          <div className="relative">
            <button
              onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {budgetRanges.find(b => b.min === minBudget && b.max === maxBudget)?.label || "Custom Range"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showBudgetDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {budgetRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleBudgetChange(range.min, range.max)
                        setShowBudgetDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 ${
                        minBudget === range.min && maxBudget === range.max
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                
                {/* Custom Range Input */}
                <div className="border-t border-gray-200 dark:border-slate-700 p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom Range</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minBudget === 0 ? "" : minBudget}
                      onChange={(e) => setMinBudget(Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxBudget === 100000 ? "" : maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value) || 100000)}
                      className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        handleBudgetChange(minBudget, maxBudget)
                        setShowBudgetDropdown(false)
                      }}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Search Tags */}
          {searchTags.length > 0 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {searchTags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                    {tag}
                    <button
                      onClick={() => removeSearchTag(tag)}
                      className="ml-2 w-4 h-4 bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category Tags - Always show when not typing */}
          {!searchQuery && (
            <div className="px-4 pb-4">
              <div className="text-left text-gray-500 dark:text-gray-400 text-sm mb-3">
                {searchTags.length === 0 ? "Filter by category:" : "Add more categories:"}
              </div>
              <div className="flex flex-wrap gap-2">
                {flippitCategories
                  .filter(category => !searchTags.includes(category))
                  .map((category) => (
                    <button
                      key={category}
                      onClick={() => addSearchTag(category)}
                      className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      {category}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FlippitSearchBar
