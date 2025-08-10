import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { InteractiveGridPattern } from "@/components/interactive-grid-pattern"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Interactive Grid Background */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <InteractiveGridPattern
          className="opacity-20 w-screen [mask-image:radial-gradient(ellipse_at_center,_black_0%,_black_25%,_rgba(0,0,0,0.5)_40%,_transparent_75%)]"
          width={40}
          height={40}
          squares={[48, 32]}
          squaresClassName="hover:fill-blue-500/60 dark:hover:fill-blue-400/60 transition-all duration-200"
          allowInteractive={true}
        />
      </div>

      {/* Main Layout */}
      <div className="flex h-screen w-full relative z-10">
        <Sidebar />
        <div className="flex-1 overflow-auto p-4">
          <div className="h-full rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
