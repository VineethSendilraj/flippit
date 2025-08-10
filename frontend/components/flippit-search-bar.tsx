"use client"

import { useState, useEffect } from "react"
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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [minBudget, setMinBudget] = useState(0)
  const [maxBudget, setMaxBudget] = useState(100000)
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setShowSuggestions(value.length > 0)
    setSelectedSuggestionIndex(-1)
    updateFilters(value)
  }

  const updateFilters = (query: string = searchQuery) => {
    onSearch({
      query,
      region: selectedRegion,
      minBudget,
      maxBudget
    })
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    updateFilters("")
  }

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    updateFilters(suggestion)
  }

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    setShowRegionDropdown(false)
    setTimeout(() => updateFilters(), 0)
  }

  const handleBudgetChange = (min: number, max: number) => {
    setMinBudget(min)
    setMaxBudget(max)
    setShowBudgetDropdown(false)
    setTimeout(() => updateFilters(), 0)
  }

  // Autocomplete suggestions based on luxury items and brands
  const suggestions = [
    "Rolex Submariner",
    "Hermès Birkin",
    "Jordan 1 Retro",
    "Louis Vuitton Neverfull",
    "Patek Philippe Nautilus",
    "Chanel Classic Flap",
    "Yeezy Boost 350",
    "Cartier Love Bracelet",
    "Supreme Box Logo",
    "Omega Speedmaster",
    "Gucci Dionysus",
    "Air Jordan 4",
    "Tiffany & Co Engagement Ring",
    "Van Cleef & Arpels Alhambra",
    "Off-White Jordan 1",
    "Bottega Veneta Jodie",
    "Richard Mille RM 11",
    "Dior Saddle Bag",
    "Travis Scott Jordan 1",
    "Bulgari Serpenti"
  ]

  const filteredSuggestions = searchQuery.length > 0 
    ? suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(filteredSuggestions[selectedSuggestionIndex])
        } else if (searchQuery.trim()) {
          setShowSuggestions(false)
          updateFilters(searchQuery)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.filter-dropdown')) {
        setShowRegionDropdown(false)
        setShowBudgetDropdown(false)
      }
      if (!target.closest('.search-container')) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            conic-gradient(from var(--angle), #60a5fa20 0deg, #60a5fa40 90deg, #60a5fa 180deg, #60a5fa40 270deg, #60a5fa20 360deg) border-box;
        }
        
        @keyframes rotate {
          to {
            --angle: 360deg;
          }
        }
      `}</style>
      <div className="max-w-2xl mx-auto relative search-container">
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
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 text-lg text-gray-900 dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 outline-none bg-transparent"
              autoComplete="off"
            />
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="w-8 h-8 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => selectSuggestion(suggestion)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 ${
                  selectedSuggestionIndex === index 
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Filters Row */}
        <div className="mt-4 flex items-center justify-center gap-3">
          {/* Region Filter */}
          <div className="relative filter-dropdown">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-200 dark:border-slate-600"
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
          <div className="relative filter-dropdown">
            <button
              onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-200 dark:border-slate-600"
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
                      onClick={() => handleBudgetChange(range.min, range.max)}
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
                      onClick={() => handleBudgetChange(minBudget, maxBudget)}
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

      </div>
    </>
  )
}

export default FlippitSearchBar
