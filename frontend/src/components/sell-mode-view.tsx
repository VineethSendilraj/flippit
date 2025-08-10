"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { ExternalLink, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SellModeViewProps {
  retailers: any[]
  msrpPrice?: number | null
  queryText?: string
}

export function SellModeView({ retailers, msrpPrice, queryText }: SellModeViewProps) {
  // Find the lowest price among retailers
  const lowestPrice = retailers
    .map(r => r.lowest_price_offered)
    .filter(p => typeof p === "number")
    .reduce((min, p) => (min === null || (p !== null && p < min) ? p : min), null as number | null)

  // Suggested sell price: 20% above lowest price, fallback to MSRP if no lowest price
  const suggestedSellPrice = lowestPrice ? Math.round(lowestPrice * 1.2) : msrpPrice || null
  // Potential profit: suggested sell price - lowest price
  const potentialProfit = (lowestPrice && suggestedSellPrice) ? suggestedSellPrice - lowestPrice : null

  // Listing template info
  const listingTitle = (queryText && queryText.trim().length > 0) ? queryText.trim().slice(0, 80) : "Rolex Day Date 36"
  const listingDescription = `Selling a ${listingTitle} in good condition. Authentic, gently used luxury watch. Please message for details or more photos.`
  const listingCondition = "Good"

  const [ebayLoading, setEbayLoading] = useState(false)
  const [ebayUrl, setEbayUrl] = useState<string | null>(null)

  async function createEbayListing() {
    try {
      setEbayLoading(true)
      setEbayUrl(null)
      const title = listingTitle
      const description = listingDescription
      const price = suggestedSellPrice
      // Use a public sample image for demo reliability
      const photoUrl = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop"

      const res = await fetch("/api/ebay/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, price, photoUrl }),
      })

      const data = await res.json()
      if (data.ok) {
        setEbayUrl(data.url)
        toast.success("Listed on eBay (Sandbox)!")
      } else {
        // Surface readable toast; log raw XML for debugging
        // eslint-disable-next-line no-console
        console.error(data.raw || data.error)
        toast.error("eBay listing failed — check console for details.")
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error("Unexpected error while creating eBay listing")
    } finally {
      setEbayLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center gap-2">
        {typeof msrpPrice === "number" && (
          <span className="rounded bg-blue-900/20 px-3 py-1 text-sm font-semibold text-blue-400">
            MSRP: ${msrpPrice.toLocaleString()}
          </span>
        )}
        {typeof lowestPrice === "number" && (
          <span className="rounded bg-blue-900/20 px-3 py-1 text-sm font-semibold text-blue-400">
            Lowest Price: ${lowestPrice.toLocaleString()}
          </span>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1">
          <div className="rounded-md border bg-background p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-blue-400">Suggested Sell Price</span>
              <span className="text-2xl font-bold text-blue-500">{suggestedSellPrice ? `$${suggestedSellPrice.toLocaleString()}` : "-"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-blue-400">Potential Profit</span>
              <span className="text-2xl font-bold text-blue-500">{potentialProfit ? `$${potentialProfit.toLocaleString()}` : "-"}</span>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-6">
          <div className="rounded-md border bg-background p-6 flex flex-col gap-4">
            <span className="text-lg font-semibold mb-2">Create a Listing</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* eBay */}
              <div className="flex flex-col gap-2 border rounded-md p-4">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <a href="https://www.ebay.com/sl/sell" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    eBay <span role="img" aria-label="eBay">🛒</span>
                  </a>
                </span>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono whitespace-pre-wrap mb-2">
                  Title: {listingTitle}
                  <br />Description: {listingDescription}
                  <br />Price: {suggestedSellPrice ? `$${suggestedSellPrice}` : "-"}
                  <br />Condition: {listingCondition}
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={createEbayListing}
                    disabled={!suggestedSellPrice || ebayLoading}
                  >
                    {ebayLoading ? "Listing..." : "Create listing thru API"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {ebayUrl && (
                    <a
                      href={ebayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Sandbox Listing
                    </a>
                  )}
                </div>
              </div>
              {/* Facebook Marketplace */}
              <div className="flex flex-col gap-2 border rounded-md p-4">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <a href="https://www.facebook.com/marketplace/create/item" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    Facebook Marketplace <span role="img" aria-label="Facebook">📘</span>
                  </a>
                </span>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono whitespace-pre-wrap mb-2">
                  Title: {listingTitle}
                  <br />Description: {listingDescription}
                  <br />Price: {suggestedSellPrice ? `$${suggestedSellPrice}` : "-"}
                  <br />Condition: {listingCondition}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => {}}
                >
                  Create listing thru API
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              {/* Craigslist */}
              <div className="flex flex-col gap-2 border rounded-md p-4">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <a href="https://www.craigslist.org/about/sites" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    Craigslist <span role="img" aria-label="Craigslist">🏘</span>
                  </a>
                </span>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono whitespace-pre-wrap mb-2">
                  Title: {listingTitle}
                  <br />Description: {listingDescription}
                  <br />Price: {suggestedSellPrice ? `$${suggestedSellPrice}` : "-"}
                  <br />Condition: {listingCondition}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => {}}
                >
                  Create listing thru API
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}