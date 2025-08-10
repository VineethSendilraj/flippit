"use client"

import React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Retailer } from "@/types/retailer"

interface SellModeViewProps {
  retailers: Retailer[]
  msrpPrice?: number | null
  searchId: string
}

export function SellModeView({ retailers, msrpPrice, searchId }: SellModeViewProps) {
  const router = useRouter()
  // Find the lowest price among retailers
  const lowestPrice = retailers
    .map(r => r.lowest_price_offered)
    .filter((p): p is number => typeof p === "number")
    .reduce((min: number | null, p: number) => (min === null || (p !== null && p < min) ? p : min), null)

  // Hardcoded suggested sell price
  const suggestedSellPrice = 38000
  // Potential profit: suggested sell price - lowest price
  const potentialProfit = (lowestPrice && suggestedSellPrice) ? suggestedSellPrice - lowestPrice : null

  // Listing template info
  const listingTitle = "Rolex Day Date 36"
  const listingDescription = `Selling a Rolex Day Date 36 in good condition. Authentic, gently used luxury watch. Please message for details or more photos.`
  const listingCondition = "Good"

  return (
    <div className="space-y-8">
      {/* Pricing Information - Top Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6">
          <div className="space-y-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Suggested Sell Price</span>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {suggestedSellPrice ? `$${suggestedSellPrice.toLocaleString()}` : "-"}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6">
          <div className="space-y-2">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Potential Profit</span>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
              {potentialProfit ? `$${potentialProfit.toLocaleString()}` : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Listing Platforms - Bottom Section */}
      <div className="rounded-xl border border-gray-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create a Listing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* eBay */}
          <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image 
                  src="/logos/ebay.png" 
                  alt="eBay Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">eBay</h3>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4 space-y-1 text-sm">
              <div><span className="font-medium">Title:</span> {listingTitle}</div>
              <div><span className="font-medium">Description:</span> {listingDescription.slice(0, 50)}...</div>
              <div><span className="font-medium">Price:</span> {suggestedSellPrice ? `$${suggestedSellPrice}` : "-"}</div>
              <div><span className="font-medium">Condition:</span> {listingCondition}</div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push(`/listings/ebay?id=${encodeURIComponent(searchId)}`)}
            >
              Go to listing page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Facebook Marketplace */}
          <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image 
                  src="/logos/facebook.png" 
                  alt="Facebook Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Facebook Marketplace</h3>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4 space-y-1 text-sm">
              <div><span className="font-medium">Title:</span> {listingTitle}</div>
              <div><span className="font-medium">Description:</span> {listingDescription.slice(0, 50)}...</div>
              <div><span className="font-medium">Price:</span> {suggestedSellPrice ? `$${suggestedSellPrice}` : "-"}</div>
              <div><span className="font-medium">Condition:</span> {listingCondition}</div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push(`/listings/facebook?id=${encodeURIComponent(searchId)}`)}
            >
              Go to listing page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Craigslist */}
          <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image 
                  src="/logos/craigslist.png" 
                  alt="Craigslist Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Craigslist</h3>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4 space-y-1 text-sm">
              <div><span className="font-medium">Title:</span> {listingTitle}</div>
              <div><span className="font-medium">Description:</span> {listingDescription.slice(0, 50)}...</div>
              <div><span className="font-medium">Price:</span> {suggestedSellPrice ? `$${suggestedSellPrice}` : "-"}</div>
              <div><span className="font-medium">Condition:</span> {listingCondition}</div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push(`/listings/craigslist?id=${encodeURIComponent(searchId)}`)}
            >
              Go to listing page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}