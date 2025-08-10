"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getRetailersBySearchId, supabase } from "@/lib/supabase"
import { BuyModeView } from "@/components/buy-mode-view"
import { SellModeView } from "@/components/sell-mode-view"
import { ModeToggle } from "@/components/mode-toggle"
import { AutoCallToggle } from "@/components/auto-call-toggle"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const searchId = searchParams.get("id")
  const [mode, setMode] = useState<"buy" | "sell">("buy")
  const [retailers, setRetailers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lowestPrice, setLowestPrice] = useState<{
    price: number | null
    retailer: string | null
  }>({ price: null, retailer: null })
  const [msrpPrice, setMsrpPrice] = useState<number | null>(null)
  const [queryText, setQueryText] = useState<string>("")

  useEffect(() => {
    if (!searchId) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [retailersRes, queryRes] = await Promise.all([
          getRetailersBySearchId(searchId),
          supabase.from("arbitrage_queries").select("msrp_price, query_text").eq("id", searchId).single(),
        ])
        setRetailers(retailersRes)
        if (queryRes.data && typeof queryRes.data.msrp_price === "number") {
          setMsrpPrice(queryRes.data.msrp_price)
        } else {
          setMsrpPrice(null)
        }
        if (queryRes.data && typeof queryRes.data.query_text === "string") {
          setQueryText(queryRes.data.query_text)
        }
        // Find the lowest price offered
        const retailerWithLowestPrice = retailersRes
          .filter((r) => r.lowest_price_offered !== null)
          .sort((a, b) => a.lowest_price_offered - b.lowest_price_offered)[0]

        if (retailerWithLowestPrice) {
          setLowestPrice({
            price: retailerWithLowestPrice.lowest_price_offered,
            retailer: retailerWithLowestPrice.name,
          })
        }
      } catch (error) {
        console.error("Error fetching retailers or msrp:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchId])

  if (!searchId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-gray-500">Select a search from the sidebar or start a new search</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Arbitrage Dashboard</h1>
        <div className="flex items-center gap-4">
          {lowestPrice.price && (
            <div className="rounded-md bg-green-900/20 px-3 py-1 text-sm">
              <span className="font-medium text-green-500">
                Lowest price: ${lowestPrice.price.toLocaleString()} from {lowestPrice.retailer}
              </span>
            </div>
          )}
          <AutoCallToggle />
          <ModeToggle mode={mode} setMode={setMode} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          </div>
        ) : mode === "buy" ? (
          <BuyModeView retailers={retailers} setRetailers={setRetailers} msrpPrice={msrpPrice} />
        ) : (
          <SellModeView retailers={retailers} msrpPrice={msrpPrice} queryText={queryText} />
        )}
      </div>
    </div>
  )
}
