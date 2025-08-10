"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react"
import { getRetailersBySearchId, supabase } from "@/lib/supabase"

type Platform = "ebay" | "facebook" | "craigslist"

interface GeneratedListing {
  title: string
  description: string
  suggestedPrice: number | null
}

export default function ListingPage() {
  const params = useParams<{ platform: Platform }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryId = searchParams.get("id") || ""

  const platform = (params.platform || "ebay") as Platform
  const [msrpPrice, setMsrpPrice] = useState<number | null>(null)
  const [queryText, setQueryText] = useState<string>("")
  const [lowestPrice, setLowestPrice] = useState<number | null>(null)
  const [generated, setGenerated] = useState<GeneratedListing | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const [conditionId] = useState<number>(3000)
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [, setHasPublished] = useState<boolean>(false)

  const platformLabel = useMemo(() => {
    switch (platform) {
      case "facebook":
        return "Facebook Marketplace"
      case "craigslist":
        return "Craigslist"
      default:
        return "eBay"
    }
  }, [platform])

  useEffect(() => {
    if (!queryId) return
    const fetch = async () => {
      // Load query data
      const { data: query, error } = await supabase
        .from("arbitrage_queries")
        .select("query_text, msrp_price")
        .eq("id", queryId)
        .single()
      if (!error && query) {
        setQueryText(query.query_text || "")
        setMsrpPrice(typeof query.msrp_price === "number" ? query.msrp_price : null)
      }
      // Load retailers and compute min price
      const retailers = await getRetailersBySearchId(queryId)
      const min = retailers
        .map((r: { lowest_price_offered: number | null }) => r.lowest_price_offered)
        .filter((p: number | null): p is number => typeof p === "number")
        .reduce((m: number | null, p: number) => (m === null || p < m ? p : m), null as number | null)
      setLowestPrice(min)
    }
    fetch()
  }, [queryId])

  const suggestedPrice = 38000

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const hardcodedTitle = "Rolex Day-Date 36mm President 18k Gold – Automatic Luxury Watch"
      const hardcodedDescription = `Experience timeless elegance with the Rolex Day-Date 36, also known as the "President." This iconic timepiece features a 36mm case, automatic movement, and the signature day and date display at 12 and 3 o'clock. Crafted from premium 18k gold and designed with Rolex's unmatched precision, it's the ultimate statement of sophistication and success. Perfect for collectors and luxury watch enthusiasts alike.

Includes: Original Rolex box and papers.
Condition: Excellent, fully functional, recently serviced.
Authenticity guaranteed.`

      const data: GeneratedListing = {
        title: hardcodedTitle,
        description: hardcodedDescription,
        suggestedPrice,
      }
      setGenerated(data)
      setTitle(hardcodedTitle)
      setDescription(hardcodedDescription)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateEbay = async () => {
    // Wait 3 seconds then open the eBay listing in a new tab
    setTimeout(() => {
      window.open('https://www.ebay.com/itm/177328848249', '_blank')
    }, 3000)
  }

  const handleBackToSell = () => {
    router.push(`/dashboard?id=${queryId}`)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Hero / Steps */}
      <div className="rounded-2xl border border-blue-300/30 bg-gradient-to-r from-white to-gray-50 dark:from-black dark:to-slate-900 text-gray-900 dark:text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Create {platformLabel} Listing</h1>
        </div>
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToSell}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sell View
          </Button>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-stretch">
        <Card className="h-full rounded-2xl shadow-md">
          <CardHeader className="bg-gray-50 dark:bg-slate-900/30 rounded-t-2xl border-b">
            <CardTitle className="text-xl font-extrabold">Listing Details</CardTitle>
            <CardDescription className="text-sm">We pre-fill the best-performing content for faster posting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div>
              <label className="text-sm font-medium">Product</label>
              <Input value={queryText} onChange={(e) => setQueryText(e.target.value)} placeholder="e.g. Rolex Day Date 36" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Suggested Price</label>
              <Input value={suggestedPrice ?? ''} readOnly className="mt-1 font-semibold text-lg" />
            </div>

            <div className="flex gap-2">
              <Button disabled={isGenerating} onClick={handleGenerate} className="bg-blue-600 text-white hover:bg-blue-700 transition-transform hover:scale-[1.02] hover:shadow-blue-300/30 hover:shadow-lg">
                <span className="mr-2">✨</span>
                {isGenerating ? "Generating..." : "Generate AI Title & Description"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full rounded-2xl shadow-md">
          <CardHeader className="bg-gray-50 dark:bg-slate-900/30 rounded-t-2xl border-b">
            <CardTitle className="text-xl font-extrabold">Seller Info</CardTitle>
            <CardDescription className="text-sm">Contact information shown to buyers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <div className="text-sm text-muted-foreground">Seller</div>
              <div className="font-medium">{process.env.NEXT_PUBLIC_SELLER_NAME || "Kevin Lu"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Contact</div>
              <div className="font-medium">{process.env.NEXT_PUBLIC_SELLER_CONTACT || "lukbrinker@gmail.com"}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader className="bg-gray-50 dark:bg-slate-900/30 rounded-t-2xl border-b">
          <CardTitle className="text-xl font-extrabold">Content Listing</CardTitle>
          <CardDescription className="text-sm">Use or tweak before publishing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          {isGenerating ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-28 w-full" />
              <div className="text-sm text-muted-foreground">Generating<span className="inline-flex ml-1 animate-pulse">...</span></div>
            </div>
          ) : (
            <>
              <div className="transition-opacity">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Generated title" className="mt-1" />
              </div>
              <div className="transition-opacity">
                <label className="text-sm font-medium">Description</label>
                <Textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Generated description" className="mt-1" />
              </div>
            </>
          )}
          <div className="flex gap-2">
            {platform === "ebay" ? (
              <Button disabled={!generated || !suggestedPrice} onClick={handleCreateEbay} className="bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-[1.02]">List on eBay</Button>
            ) : (
              <Button disabled>API integration coming soon</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


