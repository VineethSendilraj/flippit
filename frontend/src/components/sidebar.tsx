"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Clock, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getArbitrageSearches } from "@/lib/supabase"
import type { ArbitrageSearch } from "@/types/retailer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSearchId = searchParams.get("id")
  const [searches, setSearches] = useState<ArbitrageSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const data = await getArbitrageSearches()
        setSearches(data)
      } catch (error) {
        console.error("Error fetching searches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearches()
  }, [])

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-900">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold text-white">ArbiAI</h1>
        </Link>
      </div>
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            New Search
          </Button>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold text-gray-400">Recent Searches</h2>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
            </div>
          ) : searches.length === 0 ? (
            <p className="px-2 text-sm text-gray-500">No recent searches</p>
          ) : (
            <div className="space-y-1">
              {searches.map((search) => (
                <Link
                  key={search.id}
                  href={`/dashboard?id=${search.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    currentSearchId === search.id
                      ? "bg-slate-800 text-white"
                      : "text-gray-400 hover:bg-slate-800/50 hover:text-white",
                  )}
                >
                  <Clock className="h-4 w-4" />
                  <span className="truncate">
                    {search.query} ({search.location})
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
