"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { Clock, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getArbitrageSearches } from "@/lib/supabase"
import type { ArbitrageSearch } from "@/types/retailer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggleInline } from "@/components/theme-toggle-inline"

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
    <div className="flex h-full w-72 flex-col p-4">
      <div className="flex h-full flex-col rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Flippit</h1>
          </Link>
          <ThemeToggleInline />
        </div>
        <div className="px-4 pb-4">
          <Link href="/" className="w-full">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-300/50 dark:border-slate-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-slate-800/80 backdrop-blur-sm rounded-xl"
            >
              <Search className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="py-2">
            <h2 className="mb-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Searches</h2>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 dark:border-gray-500 border-t-blue-600 dark:border-t-blue-400" />
              </div>
            ) : searches.length === 0 ? (
              <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">No recent searches</p>
            ) : (
              <div className="space-y-2">
                {searches.map((search) => (
                  <Link
                    key={search.id}
                    href={`/dashboard?id=${search.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                      currentSearchId === search.id
                        ? "bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50 shadow-sm backdrop-blur-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 hover:text-gray-900 dark:hover:text-white hover:backdrop-blur-sm",
                    )}
                  >
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {search.query} ({search.location})
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Powered By at Bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-1">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-white bg-white z-30">
                    <Image 
                      src="/logos/openai.png" 
                      alt="OpenAI Logo" 
                      width={16} 
                      height={16}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-white z-20">
                    <Image 
                      src="/logos/claude.webp" 
                      alt="Claude Logo" 
                      width={16} 
                      height={16}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-white z-10">
                    <Image 
                      src="/logos/perplexity.webp" 
                      alt="Perplexity Logo" 
                      width={16} 
                      height={16}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">
                  Powered by AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
