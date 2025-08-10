"use client"

import { ShoppingCart, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModeToggleProps {
  mode: "buy" | "sell"
  setMode: (mode: "buy" | "sell") => void
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 dark:border-slate-600 p-1 bg-white dark:bg-slate-800">
      <button
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium transition-colors",
          mode === "buy" 
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-700",
        )}
        onClick={() => setMode("buy")}
      >
        <ShoppingCart className="h-4 w-4" />
        Buy Mode
      </button>
      <button
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium transition-colors",
          mode === "sell" 
            ? "bg-green-600 text-white shadow-sm" 
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-700",
        )}
        onClick={() => setMode("sell")}
      >
        <Tag className="h-4 w-4" />
        Sell Mode
      </button>
    </div>
  )
}
