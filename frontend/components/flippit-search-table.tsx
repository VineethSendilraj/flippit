"use client"

import { useState } from "react"
import FlippitSearchBar from "./flippit-search-bar"

interface SearchFilters {
  query: string
  region: string
  minBudget: number
  maxBudget: number
}

const FlippitSearchTable = () => {
  const handleSearch = (newFilters: SearchFilters) => {
    // Handle search logic here if needed in the future
    console.log("Search filters:", newFilters)
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <FlippitSearchBar onSearch={handleSearch} />
    </div>
  )
}

export default FlippitSearchTable
